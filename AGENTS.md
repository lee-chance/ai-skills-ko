# AI 에이전트 가이드

이 문서는 AI 에이전트가 이 저장소를 유지보수하고 업데이트하는 방법을 설명합니다.

## 개요

이 저장소는 AI 스킬과 플러그인의 원본과 한국어 번역을 관리합니다. 시스템은 다음과 같이 구성됩니다:

- **`sources.yaml`**: 모든 업스트림 소스의 레지스트리
- **`scripts/sync.js`**: 업스트림과 동기화하는 자동화 스크립트
- **원본 폴더**: 업스트림에서 가져온 원본 파일 (예: `pstack`, `matt-pocock-skills`)
- **번역 폴더**: 한국어 번역 파일 (예: `pstack-ko`, `matt-pocock-skills-ko`)

## 새로운 소스 추가하기

새로운 스킬 모음이나 플러그인을 이 저장소에 추가하려면 다음 단계를 따르세요.

### 1단계: sources.yaml에 등록

`sources.yaml` 파일을 열고 새 항목을 추가합니다:

```yaml
sources:
  # 기존 항목들...
  
  - id: new-skill-collection
    name: New Skill Collection
    upstream_repo: https://github.com/username/repo
    upstream_path: .                    # 또는 "skills", "plugins" 등
    local_original: new-skill-collection
    local_korean: new-skill-collection-ko
    last_synced_sha: ""                 # 초기에는 비워둠
    description: 이 스킬 모음에 대한 한국어 설명
```

**필드 설명:**
- `id`: 고유 식별자 (영문 소문자, 하이픈 사용)
- `name`: 사람이 읽을 수 있는 이름
- `upstream_repo`: 원본 GitHub 저장소 URL
- `upstream_path`: 저장소 내 대상 경로 (루트면 `.`)
- `local_original`: 원본을 저장할 로컬 폴더명
- `local_korean`: 번역을 저장할 로컬 폴더명 (관례상 `-ko` 접미사)
- `last_synced_sha`: 마지막 동기화된 커밋 SHA (초기에는 비워둠)
- `description`: 소스에 대한 한국어 설명

### 2단계: 첫 동기화 실행

```bash
# 특정 소스만 동기화
node scripts/sync.js sync new-skill-collection

# 또는 npm 스크립트 사용
npm run sync new-skill-collection
```

이렇게 하면:
1. 업스트림 저장소를 클론
2. 지정된 경로를 `local_original` 폴더에 복사
3. `sources.yaml`의 `last_synced_sha`를 최신 커밋 SHA로 업데이트

### 3단계: LICENSE와 SOURCE.md 추가

원본 폴더에 메타데이터를 추가합니다:

```bash
# SOURCE.md 생성 (예시)
cat > new-skill-collection/SOURCE.md << 'EOF'
# 출처

이 폴더의 내용은 다음 저장소에서 가져왔습니다:

- **저장소**: https://github.com/username/repo
- **커밋 SHA**: abc123def456...
- **동기화 날짜**: 2026-11-05
- **라이선스**: MIT (LICENSE 파일 참조)

원본은 수정하지 않고 그대로 유지합니다.
EOF

# LICENSE 파일은 upstream에서 복사되었을 것입니다
# 없다면 upstream의 LICENSE를 복사하세요
```

### 4단계: 한국어 번역 생성

이제 번역 폴더를 만들고 번역을 시작합니다:

```bash
# 폴더 구조 복사
cp -r new-skill-collection new-skill-collection-ko

# 번역 작업 수행
# TRANSLATION_GUIDE.md를 참조하여 파일들을 번역하세요
```

**번역 시 주의사항:**
1. **반드시 `TRANSLATION_GUIDE.md`를 먼저 읽으세요**
2. 기존 번역(`pstack-ko`)의 스타일을 참고하세요
3. 용어집을 준수하여 일관성을 유지하세요
4. 코드, 명령어, 파일 경로는 변경하지 마세요

### 5단계: 커밋 및 푸시

```bash
git add sources.yaml new-skill-collection/ new-skill-collection-ko/
git commit -m "Add new-skill-collection and Korean translation"
git push
```

### 6단계: README 업데이트

`README.md`에 새 소스에 대한 정보를 추가합니다:

```markdown
## 📁 포함된 콘텐츠

### 3. new-skill-collection
- **원본**: `new-skill-collection/`
- **한국어**: `new-skill-collection-ko/`
- **출처**: [username/repo](https://github.com/username/repo)
- **커밋**: `abc123d...`
- **설명**: 이 스킬 모음에 대한 설명
```

## 업스트림 동기화하기

업스트림이 업데이트되었을 때 동기화하는 방법입니다.

### 변경사항 확인

```bash
# 모든 소스 확인
npm run sync:check

# 특정 소스만 확인
node scripts/sync.js check pstack
```

스크립트는 다음을 보고합니다:
- 현재 기록된 SHA
- 최신 업스트림 SHA
- 추가/수정/삭제된 파일 목록

### 동기화 실행

```bash
# 모든 소스 동기화
npm run sync

# 특정 소스만 동기화
npm run sync pstack
```

동기화 후:
1. 원본 폴더가 최신 상태로 업데이트됨
2. `sources.yaml`의 SHA가 자동 업데이트됨
3. **번역은 자동으로 업데이트되지 않음**

### 번역 업데이트

동기화 후 변경된 파일을 번역해야 합니다:

1. **변경사항 확인**
   - 스크립트가 출력한 추가/수정/삭제 파일 목록 확인

2. **추가된 파일 번역**
   ```bash
   # 원본 폴더에 새 파일이 있으면
   # 같은 경로에 한국어 번역 생성
   ```

3. **수정된 파일 재번역**
   ```bash
   # git diff로 정확한 변경사항 확인
   git diff <old-sha> <new-sha> -- pstack/skills/example/SKILL.md
   
   # 변경된 부분만 번역 업데이트
   ```

4. **삭제된 파일 제거**
   ```bash
   # 원본에서 삭제된 파일은 번역에서도 삭제
   rm pstack-ko/path/to/deleted/file.md
   ```

5. **SOURCE.md 업데이트**
   ```bash
   # 각 원본 폴더의 SOURCE.md에서 커밋 SHA와 날짜 업데이트
   ```

6. **커밋**
   ```bash
   git add .
   git commit -m "Sync with upstream: update pstack to <new-sha>"
   git push
   ```

## 동기화 스크립트 사용법

### 기본 명령어

```bash
# 변경사항 확인만 (파일 수정 안 함)
node scripts/sync.js check [source-id]

# 실제 동기화 수행
node scripts/sync.js sync [source-id]

# npm 스크립트로 실행
npm run sync:check        # 모든 소스 확인
npm run sync              # 모든 소스 동기화
```

### 출력 해석

```
==============================================================
소스: pstack (pstack)
업스트림: https://github.com/cursor/plugins
==============================================================

현재 기록된 SHA: abc123...
최신 업스트림 SHA: def456...

⚠ 업스트림이 변경되었습니다!

변경사항: 추가 2, 수정 3, 삭제 1

추가된 파일:
  + skills/new-skill/SKILL.md
  + skills/new-skill/README.md

수정된 파일:
  ~ skills/architect/SKILL.md
  ~ README.md
  ~ plugin.json

삭제된 파일:
  - skills/old-skill/SKILL.md
```

## GitHub Actions 워크플로우

저장소에는 주간 업스트림 체크를 수행하는 자동화 워크플로우가 있습니다.

### 작동 방식

1. **스케줄**: 매주 월요일 오전 9시 (UTC) 자동 실행
2. **수동 실행**: Actions 탭에서 "Run workflow" 클릭
3. **동작**:
   - `npm run sync:check` 실행
   - 변경사항이 있으면 GitHub Issue 생성/업데이트
   - Issue에는 변경된 파일 목록이 포함됨

### Issue 처리

`upstream-sync` 라벨이 붙은 Issue가 생성되면:

1. **Issue 내용 확인**
   - 어떤 소스가 업데이트되었는지
   - 어떤 파일들이 변경되었는지

2. **동기화 수행**
   ```bash
   git checkout -b sync-upstream-YYYY-MM-DD
   npm run sync
   ```

3. **번역 업데이트**
   - 변경된 파일들을 번역
   - `TRANSLATION_GUIDE.md` 준수

4. **PR 생성**
   ```bash
   git add .
   git commit -m "Sync with upstream and update translations"
   git push origin sync-upstream-YYYY-MM-DD
   # PR 생성
   ```

5. **Issue 닫기**
   - PR이 머지되면 Issue 닫기

## 모범 사례

### 번역 일관성 유지

1. **용어집 준수**
   - `TRANSLATION_GUIDE.md`의 용어집을 항상 참조
   - 새로운 용어가 나오면 용어집에 추가

2. **스타일 일관성**
   - 기존 번역을 참고하여 같은 톤 유지
   - 존댓말 사용 (`~하세요`, `~합니다`)

3. **검토**
   - 번역 후 원본과 비교하여 의미가 정확한지 확인
   - 마크다운 문법과 링크가 올바른지 확인

### 커밋 메시지

명확하고 일관된 커밋 메시지를 작성하세요:

```bash
# 새 소스 추가
git commit -m "Add awesome-skills and Korean translation"

# 업스트림 동기화
git commit -m "Sync pstack with upstream (bb68f23 -> abc1234)"

# 번역만 수정
git commit -m "Update Korean translation for pstack/skills/architect"

# 문서 업데이트
git commit -m "docs: Update README with usage instructions"
```

### 파일 구조

각 소스는 다음 구조를 유지해야 합니다:

```
source-name/
├── LICENSE           # 업스트림 라이선스
├── SOURCE.md         # 출처 정보
└── (원본 파일들...)

source-name-ko/
├── LICENSE           # 동일한 라이선스
├── SOURCE.md         # 번역 정보
└── (번역된 파일들...)
```

## 트러블슈팅

### 동기화 스크립트 실패

```bash
# 임시 파일 정리
rm -rf /tmp/sync-*

# Git credentials 확인
git config --list | grep credential

# 다시 시도
npm run sync:check
```

### 번역 누락 확인

```bash
# 원본과 번역 폴더의 파일 수 비교
find pstack -type f -name "*.md" | wc -l
find pstack-ko -type f -name "*.md" | wc -l

# 차이 찾기
diff <(cd pstack && find . -type f | sort) \
     <(cd pstack-ko && find . -type f | sort)
```

### GitHub Actions 실패

1. Actions 탭에서 로그 확인
2. Node.js 버전 호환성 확인
3. 권한 문제면 repository settings에서 Actions 권한 확인

## 체크리스트

### 새 소스 추가 시

- [ ] `sources.yaml`에 등록
- [ ] `npm run sync <source-id>` 실행
- [ ] LICENSE와 SOURCE.md 추가
- [ ] 한국어 번역 완료
- [ ] README.md 업데이트
- [ ] 커밋 및 푸시

### 업스트림 동기화 시

- [ ] `npm run sync:check` 실행
- [ ] 변경사항 확인
- [ ] `npm run sync` 실행
- [ ] 변경된 파일 번역 업데이트
- [ ] 삭제된 파일 제거
- [ ] SOURCE.md 업데이트
- [ ] 커밋 및 푸시

## 참고 자료

- **TRANSLATION_GUIDE.md**: 번역 규칙과 용어집
- **sources.yaml**: 소스 레지스트리
- **scripts/sync.js**: 동기화 스크립트 소스 코드
- **.github/workflows/**: GitHub Actions 워크플로우
