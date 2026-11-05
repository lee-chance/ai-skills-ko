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
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function exec(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    if (options.allowError) return null;
    throw error;
  }
}

function getLatestCommitSHA(repoUrl, targetPath) {
  const tmpDir = `/tmp/sync-check-${Date.now()}`;
  try {
    exec(`git clone --depth 1 --no-checkout ${repoUrl} ${tmpDir}`, { stdio: 'ignore' });
    exec(`cd ${tmpDir} && git checkout HEAD -- ${targetPath === '.' ? '.' : targetPath}`, { stdio: 'ignore' });
    const sha = exec(`cd ${tmpDir} && git rev-parse HEAD`).trim();
    return sha;
  } finally {
    exec(`rm -rf ${tmpDir}`, { stdio: 'ignore' });
  }
}

function compareDirectories(dir1, dir2) {
  const changes = { added: [], modified: [], deleted: [] };
  
  if (!fs.existsSync(dir1)) {
    return changes;
  }
  
  const getFiles = (dir, base = '') => {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.git') continue;
      const fullPath = path.join(dir, item);
      const relativePath = path.join(base, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...getFiles(fullPath, relativePath));
      } else {
        results.push(relativePath);
      }
    }
    return results;
  };
  
  const files1 = new Set(getFiles(dir1));
  const files2 = new Set(getFiles(dir2));
  
  for (const file of files2) {
    const path1 = path.join(dir1, file);
    const path2 = path.join(dir2, file);
    
    if (!files1.has(file)) {
      changes.added.push(file);
    } else {
      const content1 = fs.readFileSync(path1);
      const content2 = fs.readFileSync(path2);
      if (!content1.equals(content2)) {
        changes.modified.push(file);
      }
    }
  }
  
  for (const file of files1) {
    if (!files2.has(file)) {
      changes.deleted.push(file);
    }
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
  
  const latestSHA = getLatestCommitSHA(source.upstream_repo, source.upstream_path);
  console.log(`최신 업스트림 SHA: ${latestSHA}`);
  
  if (currentSHA === latestSHA) {
    console.log('✓ 업스트림과 동기화 상태입니다.\n');
    return { hasChanges: false, source, currentSHA, latestSHA };
  }
  
  console.log(`\n⚠ 업스트림이 변경되었습니다!`);
  
  const tmpDir = `/tmp/sync-${source.id}-${Date.now()}`;
  const tmpClone = path.join(tmpDir, 'repo');
  
  try {
    fs.mkdirSync(tmpDir, { recursive: true });
    
    exec(`git clone --depth 1 ${source.upstream_repo} ${tmpClone}`, { stdio: 'ignore' });
    
    const sourcePath = source.upstream_path === '.' 
      ? tmpClone 
      : path.join(tmpClone, source.upstream_path);
    
    const targetDir = path.join(process.cwd(), source.local_original);
    
    const changes = compareDirectories(targetDir, sourcePath);
    const totalChanges = changes.added.length + changes.modified.length + changes.deleted.length;
    
    console.log(`\n변경사항: 추가 ${changes.added.length}, 수정 ${changes.modified.length}, 삭제 ${changes.deleted.length}`);
    
    if (changes.added.length > 0) {
      console.log('\n추가된 파일:');
      changes.added.slice(0, 10).forEach(f => console.log(`  + ${f}`));
      if (changes.added.length > 10) console.log(`  ... 외 ${changes.added.length - 10}개`);
    }
    
    if (changes.modified.length > 0) {
      console.log('\n수정된 파일:');
      changes.modified.slice(0, 10).forEach(f => console.log(`  ~ ${f}`));
      if (changes.modified.length > 10) console.log(`  ... 외 ${changes.modified.length - 10}개`);
    }
    
    if (changes.deleted.length > 0) {
      console.log('\n삭제된 파일:');
      changes.deleted.slice(0, 10).forEach(f => console.log(`  - ${f}`));
      if (changes.deleted.length > 10) console.log(`  ... 외 ${changes.deleted.length - 10}개`);
    }
    
    if (!checkOnly) {
      console.log(`\n동기화 중...`);
      
      if (fs.existsSync(targetDir)) {
        exec(`rm -rf ${targetDir}`);
      }
      fs.mkdirSync(targetDir, { recursive: true });
      
      if (source.upstream_path === '.') {
        const items = fs.readdirSync(sourcePath).filter(item => item !== '.git');
        for (const item of items) {
          exec(`cp -r ${path.join(sourcePath, item)} ${targetDir}/`);
        }
      } else {
        exec(`cp -r ${sourcePath}/* ${targetDir}/ 2>/dev/null || true`);
        exec(`cp -r ${sourcePath}/.[!.]* ${targetDir}/ 2>/dev/null || true`);
      }
      
      console.log('✓ 파일 동기화 완료');
      
      const yamlPath = path.join(process.cwd(), 'sources.yaml');
      let yamlContent = fs.readFileSync(yamlPath, 'utf8');
      yamlContent = yamlContent.replace(
        new RegExp(`(id: ${source.id}[\\s\\S]*?last_synced_sha:)\\s*\\S+`, 'm'),
        `$1 ${latestSHA}`
      );
      fs.writeFileSync(yamlPath, yamlContent);
      
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
    exec(`rm -rf ${tmpDir}`, { stdio: 'ignore' });
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] === 'check' ? 'check' : 'sync';
  const targetSourceId = args[1] || args[0] === 'check' ? args[1] : args[0];
  
  const checkOnly = mode === 'check';
  
  console.log(`\n🔄 업스트림 소스 동기화 스크립트`);
  console.log(`모드: ${checkOnly ? 'CHECK (확인만)' : 'SYNC (동기화)'}\n`);
  
  const yamlPath = path.join(process.cwd(), 'sources.yaml');
  if (!fs.existsSync(yamlPath)) {
    console.error('❌ sources.yaml 파일을 찾을 수 없습니다.');
    process.exit(1);
  }
  
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const sources = parseYAML(yamlContent);
  
  let sourcesToProcess = sources;
  if (targetSourceId) {
    sourcesToProcess = sources.filter(s => s.id === targetSourceId);
    if (sourcesToProcess.length === 0) {
      console.error(`❌ 소스 ID '${targetSourceId}'를 찾을 수 없습니다.`);
      process.exit(1);
    }
  }
  
  const results = [];
  for (const source of sourcesToProcess) {
    const result = syncSource(source, checkOnly);
    results.push(result);
  }
  
  const changedSources = results.filter(r => r.hasChanges);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('요약');
  console.log(`${'='.repeat(60)}\n`);
  console.log(`처리된 소스: ${results.length}`);
  console.log(`변경된 소스: ${changedSources.length}`);
  console.log(`동기화된 소스: ${changedSources.length && !checkOnly ? changedSources.length : 0}\n`);
  
  if (changedSources.length > 0) {
    if (checkOnly) {
      console.log('⚠ 다음 소스들이 업데이트가 필요합니다:');
      changedSources.forEach(r => {
        console.log(`  - ${r.source.name}: ${r.totalChanges}개 변경사항`);
      });
      console.log(`\n동기화하려면: node scripts/sync.js sync\n`);
      process.exit(1);
    } else {
      console.log('✓ 모든 변경사항이 동기화되었습니다.');
      console.log('  다음 단계: 변경된 파일들을 한국어 폴더에 번역하세요.\n');
    }
  } else {
    console.log('✓ 모든 소스가 최신 상태입니다.\n');
  }
  
  if (checkOnly && changedSources.length > 0) {
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
  }
}

if (require.main === module) {
  main();
}
