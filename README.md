# AI Skills 한국어 번역 저장소

AI 에이전트를 위한 스킬 모음의 원본과 한국어 번역을 제공하는 저장소입니다.

## 📁 포함된 콘텐츠

### 1. pstack
- **원본**: `pstack/`
- **한국어**: `pstack-ko/`
- **출처**: [cursor/plugins](https://github.com/cursor/plugins)
- **커밋**: `bb68f2365eceafa0cb2d253112f675acf5f144cc`
- **설명**: Cursor의 공식 pstack 플러그인

pstack-ko의 한국어 번역은 이 저장소에서 유지합니다.

### 2. matt-pocock-skills
- **원본**: `matt-pocock-skills/`
- **한국어**: `matt-pocock-skills-ko/`
- **출처**: [mattpocock/skills](https://github.com/mattpocock/skills)
- **커밋**: `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`
- **설명**: Matt Pocock의 AI 코딩 스킬 모음.

### 3. benjitaylor-skills
- **원본**: `benjitaylor-skills/`
- **한국어**: `benjitaylor-skills-ko/`
- **출처**: [benjitaylor/skills](https://github.com/benjitaylor/skills)
- **커밋**: `299140fafd08df55a9c234e610c3f64af3f45531`
- **설명**: Benji Taylor의 디자인·모션 스킬 모음. Stageshow로 실제 제품처럼 보이는 가짜 제품 UI를 만듭니다.

## 🚀 사용 방법

### 한국어 버전 사용하기

한국어로 번역된 스킬을 사용하려면 번역 폴더(`pstack-ko/`, `matt-pocock-skills-ko/`, `benjitaylor-skills-ko/`)를 여러분의 AI 에이전트 환경에 설치하세요.

#### Cursor (Claude Code)
```bash
# pstack-ko 설치
claude plugin install pstack-ko --local /path/to/this/repo/pstack-ko

# matt-pocock-skills-ko 설치
claude plugin install matt-pocock-skills-ko --local /path/to/this/repo/matt-pocock-skills-ko

# benjitaylor-skills-ko의 Stageshow 설치
npx skills add /path/to/this/repo/benjitaylor-skills-ko --skill stageshow
```

#### 수동 설치
번역 폴더를 에이전트의 스킬 디렉토리에 복사하세요:
```bash
cp -r pstack-ko ~/.claude/skills/pstack-ko
cp -r matt-pocock-skills-ko ~/.agents/skills/matt-pocock-skills-ko
cp -r benjitaylor-skills-ko/stageshow ~/.agents/skills/stageshow
```

### 원본과 비교하기

원본 폴더(`pstack/`, `matt-pocock-skills/`, `benjitaylor-skills/`)를 참조하여 번역과 비교할 수 있습니다. 원본은 업스트림 파일에 출처를 적는 `SOURCE.md`를 더한 상태로 유지됩니다.

## 🔄 업스트림 동기화

이 저장소는 업스트림 소스의 변경사항을 추적하고 동기화할 수 있도록 설계되었습니다.

### 변경사항 확인
```bash
npm run sync:check
```

### 동기화 실행
```bash
npm run sync
```

동기화 후 변경된 파일을 한국어로 번역해야 합니다. 자세한 내용은 `AGENTS.md`를 참조하세요.

### 자동 체크
GitHub Actions가 매주 월요일 자동으로 업스트림 변경사항을 체크하고, 변경사항이 있으면 Issue를 생성합니다.

## 📝 새로운 소스 추가하기

새로운 스킬 모음을 추가하려면:

1. **`sources.yaml`에 등록**
   ```yaml
   - id: new-collection
     name: New Collection
     upstream_repo: https://github.com/user/repo
     upstream_path: .
     local_original: new-collection
     local_korean: new-collection-ko
     last_synced_sha: ""
     description: 설명
   ```

2. **동기화 실행**
   ```bash
   npm run sync new-collection
   ```

3. **한국어 번역 생성**
   ```bash
   cp -r new-collection new-collection-ko
   # TRANSLATION_GUIDE.md를 참조하여 번역
   ```

4. **커밋 및 푸시**
   ```bash
   git add .
   git commit -m "Add new-collection and Korean translation"
   git push
   ```

자세한 단계는 `AGENTS.md`를 참조하세요.

## 📖 문서

- **[TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md)** - 번역 규칙, 용어집, 스타일 가이드
- **[AGENTS.md](./AGENTS.md)** - AI 에이전트를 위한 유지보수 가이드
- **[sources.yaml](./sources.yaml)** - 소스 레지스트리
- **각 폴더의 SOURCE.md** - 해당 폴더의 출처

## 🔧 시스템 구조

```
ai-skills-ko/
├── sources.yaml              # 소스 레지스트리
├── package.json              # npm 스크립트
├── scripts/
│   └── sync.js               # 동기화 스크립트
├── .github/workflows/
│   └── check-upstream.yml    # 주간 업스트림 체크
│
├── pstack/                   # 원본 (변경 금지)
├── pstack-ko/                # 한국어 번역
│   ├── SOURCE.md             # 출처 정보
│   └── ...
│
├── matt-pocock-skills/       # 원본 (변경 금지)
├── matt-pocock-skills-ko/    # 한국어 번역
│   ├── SOURCE.md             # 출처 정보
│   └── ...
│
├── benjitaylor-skills/       # 원본 (변경 금지)
├── benjitaylor-skills-ko/    # 한국어 번역
│   ├── SOURCE.md             # 출처 정보
│   └── ...
│
├── TRANSLATION_GUIDE.md      # 번역 가이드
├── AGENTS.md                 # 유지보수 가이드
└── README.md                 # 이 파일
```

## 🤝 기여하기

번역에 기여하고 싶으시다면:

1. 이 저장소를 포크하세요
2. `TRANSLATION_GUIDE.md`를 읽어 번역 규칙을 숙지하세요
3. 해당 `-ko` 폴더에서 번역을 수정하세요
4. 일관된 스타일로 번역하세요
5. 풀 리퀘스트를 제출하세요

## ⚖️ 라이선스

- **이 저장소**: MIT License
- **pstack**: MIT License (Cursor)
- **matt-pocock-skills**: MIT License (Matt Pocock)
- **benjitaylor-skills**: MIT License (Benji Taylor, `stageshow/LICENSE`)

각 원본 폴더에 해당 라이선스 파일이 포함되어 있습니다.

## 🔗 링크

- **업스트림 소스**:
  - [cursor/plugins](https://github.com/cursor/plugins) - pstack
  - [mattpocock/skills](https://github.com/mattpocock/skills) - Matt Pocock Skills
  - [benjitaylor/skills](https://github.com/benjitaylor/skills) - Benji Taylor Skills
- **관련 문서**:
  - [Cursor Documentation](https://docs.cursor.com/)
  - [Matt Pocock's Newsletter](https://www.aihero.dev/s/skills-newsletter)

## 💡 원칙

1. **원본 보존**: 원본 폴더는 업스트림과 동일하게 유지되며 수정하지 않습니다
2. **번역 일관성**: 모든 번역은 `TRANSLATION_GUIDE.md`의 규칙을 따릅니다
3. **동기화 가능**: 업스트림 변경사항을 추적하고 쉽게 동기화할 수 있습니다
4. **확장 가능**: 새로운 소스를 `sources.yaml`에 추가하면 됩니다
5. **자동화**: GitHub Actions가 업스트림 변경을 자동으로 체크합니다

---

**문의**: 이슈나 질문이 있으시면 [GitHub Issues](https://github.com/lee-chance/ai-skills-ko/issues)를 이용해 주세요.
