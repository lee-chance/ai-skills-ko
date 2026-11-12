#!/usr/bin/env node

/**
 * 업스트림 소스 동기화 스크립트
 *
 * 사용법:
 *   node scripts/sync.js [check|sync] [source-id]
 *
 * 모드:
 *   check - 변경사항만 확인 (파일 업데이트 없음)
 *   sync  - 실제로 동기화 수행 (기본값)
 *
 * source-id가 지정되지 않으면 모든 소스를 처리합니다.
 *
 * 변경 감지 기준:
 *   업스트림 저장소 전체의 HEAD SHA가 아니라, 기록된 SHA(`last_synced_sha`)와
 *   최신 HEAD 사이에서 `upstream_path` 아래 파일이 실제로 바뀌었는지
 *   (`git diff <기록된 SHA> HEAD -- <upstream_path>`)를 기준으로 합니다.
 *   경로 밖 커밋만 있으면 "변경 없음"입니다.
 *   기록된 SHA가 비어 있거나 업스트림에서 사라진 경우(첫 동기화, force push)에는
 *   로컬 원본 폴더와 업스트림 경로의 파일 내용을 직접 비교합니다.
 *
 * 보존 파일:
 *   이 저장소가 원본 폴더에 직접 더한 파일(기본: 루트의 SOURCE.md)은
 *   비교에서 제외하고, 동기화할 때도 지우거나 덮어쓰지 않습니다.
 *   소스별로 더 보존할 파일은 sources.yaml의 `preserve` 필드에
 *   원본 폴더 기준 상대 경로를 쉼표로 구분해 적습니다.
 *
 * 종료 코드:
 *   0 - 모든 소스가 변경 없음 (check) / 동기화 완료 (sync)
 *   1 - check 모드에서 업스트림 변경 감지
 *   2 - 스크립트 오류 (네트워크, git, 설정 등). 변경 감지가 아님
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const EXIT_CHANGES = 1;
const EXIT_ERROR = 2;

// 모든 소스에 공통으로 적용되는 보존 파일 (원본 폴더 루트 기준)
const DEFAULT_PRESERVED = ['SOURCE.md'];

function parseYAML(content) {
  const lines = content.split('\n');
  const sources = [];
  let currentSource = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- id:')) {
      if (currentSource) sources.push(currentSource);
      currentSource = { id: trimmed.split('id:')[1].trim() };
    } else if (currentSource && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      currentSource[key.trim()] = value;
    }
  }
  if (currentSource) sources.push(currentSource);
  return sources;
}

function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe', ...options });
}

function normalize(p) {
  return p.split(path.sep).join('/');
}

function getPreservedSet(source) {
  const extra = (source.preserve || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_PRESERVED, ...extra].map(p => normalize(path.normalize(p))));
}

/**
 * dir 아래의 파일 목록(상대 경로)을 반환한다. 심볼릭 링크는 따라가지 않고
 * 링크 자체를 하나의 항목으로 취급한다. `.git`은 제외한다.
 */
function listEntries(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const walk = (current, base) => {
    for (const item of fs.readdirSync(current)) {
      if (item === '.git') continue;
      const fullPath = path.join(current, item);
      const relativePath = base ? `${base}/${item}` : item;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, relativePath);
      } else {
        results.push(relativePath);
      }
    }
  };
  walk(dir, '');
  return results;
}

function entriesEqual(pathA, pathB) {
  const statA = fs.lstatSync(pathA);
  const statB = fs.lstatSync(pathB);
  if (statA.isSymbolicLink() !== statB.isSymbolicLink()) return false;
  if (statA.isSymbolicLink()) {
    return fs.readlinkSync(pathA) === fs.readlinkSync(pathB);
  }
  return fs.readFileSync(pathA).equals(fs.readFileSync(pathB));
}

/**
 * localDir(현재 원본 폴더)과 upstreamDir(업스트림 경로)을 비교한다.
 * preserved에 있는 파일은 양쪽 모두에서 무시한다.
 * localDir이 아직 없으면 업스트림 파일 전체가 "추가"가 된다.
 */
function compareDirectories(localDir, upstreamDir, preserved) {
  const changes = { added: [], modified: [], deleted: [] };

  const localFiles = new Set(listEntries(localDir).filter(f => !preserved.has(f)));
  const upstreamFiles = new Set(listEntries(upstreamDir).filter(f => !preserved.has(f)));

  for (const file of upstreamFiles) {
    if (!localFiles.has(file)) {
      changes.added.push(file);
    } else if (!entriesEqual(path.join(localDir, file), path.join(upstreamDir, file))) {
      changes.modified.push(file);
    }
  }

  for (const file of localFiles) {
    if (!upstreamFiles.has(file)) {
      changes.deleted.push(file);
    }
  }

  return changes;
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeEmptyDirs(fullPath);
      if (fs.readdirSync(fullPath).length === 0) fs.rmdirSync(fullPath);
    }
  }
}

/**
 * 변경 목록(changes)만 localDir에 적용한다. 목록에 없는 파일은 건드리지 않는다.
 * 보존 파일은 변경 목록에 들어오지 않으므로 지우거나 덮어쓰지 않는다.
 */
function applyChanges(localDir, upstreamDir, changes) {
  fs.mkdirSync(localDir, { recursive: true });

  for (const file of changes.deleted) {
    fs.rmSync(path.join(localDir, file), { force: true });
  }

  for (const file of [...changes.added, ...changes.modified]) {
    const from = path.join(upstreamDir, file);
    const to = path.join(localDir, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.rmSync(to, { force: true });
    if (fs.lstatSync(from).isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(from), to);
    } else {
      fs.copyFileSync(from, to);
    }
  }

  removeEmptyDirs(localDir);
}

function updateRecordedSHA(source, latestSHA) {
  const yamlPath = path.join(process.cwd(), 'sources.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const pattern = new RegExp(`(- id: ${source.id}\\n[\\s\\S]*?last_synced_sha:)[ \\t]*[^\\n]*`);
  if (!pattern.test(yamlContent)) {
    throw new Error(`sources.yaml에서 '${source.id}'의 last_synced_sha를 찾을 수 없습니다.`);
  }
  fs.writeFileSync(yamlPath, yamlContent.replace(pattern, `$1 ${latestSHA}`));
}

function printFileList(title, marker, files) {
  if (files.length === 0) return;
  console.log(`\n${title}:`);
  files.slice(0, 10).forEach(f => console.log(`  ${marker} ${f}`));
  if (files.length > 10) console.log(`  ... 외 ${files.length - 10}개`);
}

/**
 * 업스트림 clone에서 upstream_path 아래 파일을 작업 트리로 꺼낸다.
 * (clone은 --no-checkout이라 필요할 때만 꺼낸다.)
 */
function checkoutPath(cloneDir, upstreamPath) {
  git(['checkout', '--quiet', 'HEAD', '--', upstreamPath], { cwd: cloneDir });
}

/**
 * 기록된 SHA 커밋을 얕게(depth 1) 가져온다. 성공하면 true.
 * 가져오지 못하면(빈 값, 업스트림에서 사라진 커밋 등) false.
 */
function fetchRecordedCommit(cloneDir, sha) {
  if (!sha || !/^[0-9a-f]{40}$/i.test(sha)) return false;
  try {
    git(['fetch', '--quiet', '--depth', '1', 'origin', sha], { cwd: cloneDir });
    git(['cat-file', '-e', `${sha}^{commit}`], { cwd: cloneDir });
    return true;
  } catch {
    return false;
  }
}

/**
 * 기록된 SHA와 HEAD 사이에서 upstream_path 아래 바뀐 파일 목록을 구한다.
 * 경로는 upstream_path 기준 상대 경로로 돌려준다. 이름 변경은 삭제+추가로 본다.
 */
function diffUpstreamPath(cloneDir, fromSHA, upstreamPath, preserved) {
  const changes = { added: [], modified: [], deleted: [] };
  const pathspec = upstreamPath === '.' ? '.' : upstreamPath;
  const prefix = upstreamPath === '.' ? '' : `${normalize(path.normalize(upstreamPath))}/`;

  const out = git(
    ['diff', '--name-status', '--no-renames', '-z', fromSHA, 'HEAD', '--', pathspec],
    { cwd: cloneDir, maxBuffer: 64 * 1024 * 1024 }
  );
  const tokens = out.split('\0').filter(Boolean);
  for (let i = 0; i + 1 < tokens.length; i += 2) {
    const status = tokens[i][0];
    const file = tokens[i + 1].startsWith(prefix) ? tokens[i + 1].slice(prefix.length) : tokens[i + 1];
    if (preserved.has(file)) continue;
    if (status === 'A') changes.added.push(file);
    else if (status === 'D') changes.deleted.push(file);
    else changes.modified.push(file); // M, T 등
  }
  return changes;
}

function syncSource(source, checkOnly = false) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`소스: ${source.name} (${source.id})`);
  console.log(`업스트림: ${source.upstream_repo}`);
  console.log(`${'='.repeat(60)}\n`);

  const currentSHA = source.last_synced_sha;
  console.log(`현재 기록된 SHA: ${currentSHA}`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `sync-${source.id}-`));
  const tmpClone = path.join(tmpDir, 'repo');

  try {
    // 최신 커밋만 얕게 받는다. 작업 트리는 필요할 때만 꺼낸다.
    git(['clone', '--quiet', '--depth', '1', '--no-checkout', source.upstream_repo, tmpClone]);
    const latestSHA = git(['rev-parse', 'HEAD'], { cwd: tmpClone }).trim();
    console.log(`최신 업스트림 SHA: ${latestSHA}`);

    if (source.upstream_path !== '.') {
      try {
        git(['cat-file', '-e', `HEAD:${source.upstream_path}`], { cwd: tmpClone });
      } catch {
        throw new Error(`업스트림에 경로 '${source.upstream_path}'가 없습니다.`);
      }
    }

    const sourcePath = source.upstream_path === '.'
      ? tmpClone
      : path.join(tmpClone, source.upstream_path);
    const targetDir = path.join(process.cwd(), source.local_original);
    const preserved = getPreservedSet(source);

    let changes;
    if (currentSHA === latestSHA) {
      changes = { added: [], modified: [], deleted: [] };
    } else if (fetchRecordedCommit(tmpClone, currentSHA)) {
      changes = diffUpstreamPath(tmpClone, currentSHA, source.upstream_path, preserved);
    } else {
      console.log('\n기록된 SHA를 업스트림에서 찾을 수 없어 로컬 원본 폴더와 직접 비교합니다.');
      checkoutPath(tmpClone, source.upstream_path);
      changes = compareDirectories(targetDir, sourcePath, preserved);
    }
    const totalChanges = changes.added.length + changes.modified.length + changes.deleted.length;

    if (totalChanges === 0) {
      if (currentSHA === latestSHA) {
        console.log('✓ 업스트림과 동기화 상태입니다.\n');
      } else {
        // 경로 밖 커밋만 있는 경우. 기록된 SHA는 로컬 스냅샷을 만든 커밋이므로
        // (SOURCE.md·README와 맞추기 위해) 올리지 않는다.
        console.log(`\n✓ '${source.upstream_path}' 안에는 변경이 없습니다. (업스트림 HEAD는 이동했지만 경로 밖 변경입니다.)`);
        console.log('  기록된 SHA는 그대로 둡니다.\n');
      }
      return { hasChanges: false, source, currentSHA, latestSHA };
    }

    console.log(`\n⚠ 업스트림이 변경되었습니다!`);
    console.log(`\n변경사항: 추가 ${changes.added.length}, 수정 ${changes.modified.length}, 삭제 ${changes.deleted.length}`);
    printFileList('추가된 파일', '+', changes.added);
    printFileList('수정된 파일', '~', changes.modified);
    printFileList('삭제된 파일', '-', changes.deleted);

    if (!checkOnly) {
      console.log(`\n동기화 중...`);
      checkoutPath(tmpClone, source.upstream_path);
      applyChanges(targetDir, sourcePath, changes);
      console.log('✓ 파일 동기화 완료');

      updateRecordedSHA(source, latestSHA);
      console.log('✓ sources.yaml 업데이트 완료\n');
    }

    return {
      hasChanges: true,
      source,
      currentSHA,
      latestSHA,
      changes,
      totalChanges
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function parseArgs(args) {
  const modes = ['check', 'sync'];
  if (modes.includes(args[0])) {
    return { mode: args[0], targetSourceId: args[1] };
  }
  // 모드 없이 source-id만 준 경우는 sync로 본다.
  return { mode: 'sync', targetSourceId: args[0] };
}

function main() {
  const { mode, targetSourceId } = parseArgs(process.argv.slice(2));
  const checkOnly = mode === 'check';

  console.log(`\n🔄 업스트림 소스 동기화 스크립트`);
  console.log(`모드: ${checkOnly ? 'CHECK (확인만)' : 'SYNC (동기화)'}\n`);

  const yamlPath = path.join(process.cwd(), 'sources.yaml');
  if (!fs.existsSync(yamlPath)) {
    throw new Error('sources.yaml 파일을 찾을 수 없습니다.');
  }

  const sources = parseYAML(fs.readFileSync(yamlPath, 'utf8'));

  let sourcesToProcess = sources;
  if (targetSourceId) {
    sourcesToProcess = sources.filter(s => s.id === targetSourceId);
    if (sourcesToProcess.length === 0) {
      throw new Error(`소스 ID '${targetSourceId}'를 찾을 수 없습니다.`);
    }
  }

  const results = [];
  for (const source of sourcesToProcess) {
    results.push(syncSource(source, checkOnly));
  }

  const changedSources = results.filter(r => r.hasChanges);

  console.log(`\n${'='.repeat(60)}`);
  console.log('요약');
  console.log(`${'='.repeat(60)}\n`);
  console.log(`처리된 소스: ${results.length}`);
  console.log(`변경된 소스: ${changedSources.length}`);
  console.log(`동기화된 소스: ${changedSources.length && !checkOnly ? changedSources.length : 0}\n`);

  if (changedSources.length === 0) {
    console.log('✓ 모든 소스가 최신 상태입니다.\n');
    return 0;
  }

  if (!checkOnly) {
    console.log('✓ 모든 변경사항이 동기화되었습니다.');
    console.log('  다음 단계: 변경된 파일들을 한국어 폴더에 번역하세요.\n');
    return 0;
  }

  console.log('⚠ 다음 소스들이 업데이트가 필요합니다:');
  changedSources.forEach(r => {
    console.log(`  - ${r.source.name}: ${r.totalChanges}개 변경사항`);
  });
  console.log(`\n동기화하려면: node scripts/sync.js sync\n`);

  // GitHub Actions가 읽는 JSON. 종료 전에 반드시 출력해야 한다.
  const output = {
    timestamp: new Date().toISOString(),
    changedSources: changedSources.map(r => ({
      id: r.source.id,
      name: r.source.name,
      currentSHA: r.currentSHA,
      latestSHA: r.latestSHA,
      changes: r.changes
    }))
  };
  console.log('\n--- JSON 출력 (GitHub Actions용) ---');
  console.log(JSON.stringify(output, null, 2));

  return EXIT_CHANGES;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    // 변경 감지(1)와 구분되도록 별도 종료 코드를 쓴다.
    console.error(`\n❌ 오류: ${error.message}`);
    process.exitCode = EXIT_ERROR;
  }
}

module.exports = { parseYAML, compareDirectories, getPreservedSet, diffUpstreamPath };
