# Cursor에서 agent-skills 사용하기

현재 지원되는 프로젝트 컨텍스트로 [agent-skills](../README.md)를 **Cursor**에 연결하는 방법입니다. 레거시 단일 파일이나 Kaizen 전용 레이아웃은 쓰지 않습니다.

이 가이드의 모든 `.cursor/` 경로는 **여러분의** 프로젝트에 있습니다(사용자 범위이면 `~/.cursor/` 아래). 이 저장소는 `.cursor/` 디렉터리를 제공하지 않습니다. 여러분이 만들고, 그 안으로 스킬을 동기화합니다. [1단계](#1-install-skills-into-cursorskills)가 하는 일이 그것입니다.

---

## 오늘 Cursor가 지원하는 것

Cursor는 **규칙**(짧은 정책)과 **스킬**(전체 워크플로우)을 함께 씁니다.

| 층 | 경로 | 역할 |
|-------|------|------|
| **프로젝트 규칙** | `.cursor/rules/*.mdc` | 항상 적용되거나 파일 범위인 지시(`alwaysApply`, `globs`) |
| **프로젝트 스킬** | `.cursor/skills/<skill-name>/SKILL.md` | 에이전트가 발견하는 워크플로우. 작업이 스킬 `description`과 맞을 때 읽습니다 |
| **사용자 규칙** | Cursor Settings → Rules | 계정 전체 정책 |
| **사용자 스킬**(선택) | `~/.cursor/skills/` | 모든 워크스페이스에서 쓸 수 있는 전역 스킬 |

문서: [규칙](https://cursor.com/docs/rules) · [스킬](https://cursor.com/docs/skills).

### 규칙과 스킬

- **규칙:** 짧고 안정적입니다("컨벤셔널 커밋을 사용", "공개 Python API에 타입 어노테이션"). 파일당 관심사 하나를 두세요. 큰 가이드를 붙여 넣지 마세요.
- **스킬:** 이 저장소의 단계별 절차입니다(`test-driven-development`, `code-review-and-quality` 등). `SKILL.md` 본문 전체를 규칙에 복사하지 **마세요**. `.cursor/skills/`와 중복되고 컨텍스트를 낭비합니다.

### 레거시(새 설정에서는 피하세요)

| 레거시 | 대신 쓸 것 |
|--------|--------|
| 루트 `.cursorrules` | `.cursor/rules/*.mdc` |
| `SKILL.md`를 `.cursor/rules/`로 복사 | `.cursor/skills/<name>/SKILL.md` |
| "스킬 10개를 항상 적용 규칙으로 로드" | 얇은 `alwaysApply` 규칙 1~2개와, 필요할 때의 스킬 |

---

## 권장 프로젝트 레이아웃

```text
your-project/
├── .cursor/
│   ├── rules/                    # Short .mdc policies (yours)
│   │   └── agent-skills.mdc      # Optional: “use project skills” pointer
│   └── skills/                   # What Cursor Agent loads
│       ├── using-agent-skills/
│       ├── test-driven-development/
│       ├── code-review-and-quality/
│       └── …                     # Synced from agent-skills + your own skills
└── agent-skills/                 # Optional: git submodule or vendor clone
    └── skills/                   # Upstream source only
```

**에이전트의 진실 공급원:** `.cursor/skills/`.
`agent-skills/skills/`(또는 클론한 [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills))는 **업스트림**으로 다루세요. `.cursor/skills/`로 동기화하세요. 업스트림만 고치고 Cursor가 그것을 볼 것이라고 기대하지 마세요.

---

## 설정(어떤 저장소든)

<a id="1-install-skills-into-cursorskills"></a>

### 1. `.cursor/skills/`에 스킬 설치

**agent-skills의 로컬 클론에서**(프로젝트 루트이거나 다른 곳이거나):

```bash
mkdir -p .cursor/skills
rsync -a /path/to/agent-skills/skills/ .cursor/skills/
```

**커스텀 스킬을 덮어쓰지 않는 첫 복사:**

```bash
rsync -a --ignore-existing /path/to/agent-skills/skills/ .cursor/skills/
```

**업스트림 업데이트 이후:**

```bash
rsync -a /path/to/agent-skills/skills/ .cursor/skills/
```

각 스킬 폴더에는 최소한 다음 YAML frontmatter가 있는 `SKILL.md`가 있어야 합니다.

```yaml
---
name: test-driven-development
description: Drives development with tests. Use when implementing logic, fixing bugs, or changing behavior.
---
```

Cursor는 스킬을 언제 적용할지 정할 때 `description`(과 관련 메타데이터)을 씁니다.

### 2. 최소한의 프로젝트 규칙 추가(선택이지만 유용합니다)

`.cursor/rules/agent-skills.mdc`를 만드세요.

```markdown
---
description: Use agent-skills workflows from .cursor/skills
alwaysApply: true
---

Before non-trivial technical work:

1. Route via `.cursor/skills/using-agent-skills/SKILL.md`.
2. Read and follow the matching skill under `.cursor/skills/<name>/SKILL.md`.
3. Open `reference.md` in that folder when the skill links to it.
4. Prefer project skills over guessing; user does not need to say "read skill" each time.
```

저장소별 표준(스타일, 언어, 스택)은 **별도의** `.mdc` 파일로 추가하고, 각 파일은 한 가지에 초점 두세요.

**규칙 파일 형식:**

```markdown
---
description: Shown in Cursor rule UI
alwaysApply: false
globs: "**/*.{ts,tsx}"
---

# Your rule content
```

| 필드 | 용도 |
|-------|-----|
| `alwaysApply: true` | 이 프로젝트의 모든 채팅 |
| `globs` | 일치하는 파일이 컨텍스트에 있을 때 |
| `alwaysApply: false` + `globs` 없음 | Agent-request / 수동 규칙(Cursor UI) |

### 3. 사용자 수준 스킬(선택)

어디서나 쓰고 싶은 스킬은 `~/.cursor/skills/` 아래에 복사하거나 설치하세요. agent-skills에 속하지 않는, 스택 전반의 가이드(예: 언어 패턴)에 쓰세요.

`.cursor/skills/`의 프로젝트 스킬이 **이** 저장소의 워크플로우에서 우선합니다.

### 4. 확인

1. **Settings → Rules:** 프로젝트 `.mdc` 파일이 나열되는지 보세요.
2. **에이전트 채팅:** `.cursor/skills/`의 스킬이 스킬 목록에 나타나는지 보세요(사용 중인 Cursor 빌드가 목록을 보여줄 때).
3. 파일 이름을 대지 않고, 스킬에 맞는 작업을 실행하세요(예: "테스트를 먼저 두고 기능을 추가"). 라우팅이 되면 에이전트가 `test-driven-development`를 열어야 합니다.

---

## 에이전트가 스킬을 쓰는 방법

1. **발견:** `using-agent-skills`가 작업 단계를 스킬 이름으로 매핑합니다.
2. **읽기:** `.cursor/skills/<name>/SKILL.md`의 전체 절차를 읽습니다.
3. **깊이 보기:** 스킬이 그렇게 말하면 `reference.md`, `references/*.md`, 또는 연결된 체크리스트를 봅니다.
4. **조합:** 예를 들어 API 슬라이스에는 `incremental-implementation`과 `api-and-interface-design`을 함께 씁니다.

에이전트가 벗어나면, 명시적인 사용자 문구가 여전히 도움이 됩니다. 예: "follow TDD"(TDD를 따르라), "use code-review-and-quality"(code-review-and-quality를 사용하라).

### 단계 → 스킬(빠른 표)

| 하는 일 | 스킬 |
|----------|--------|
| 요구사항을 명확히 할 때 | `interview-me`, `idea-refine`, `spec-driven-development` |
| 작업을 계획할 때 | `planning-and-task-breakdown` |
| 구현할 때 | `incremental-implementation`, `frontend-ui-engineering`, `api-and-interface-design` |
| 테스트할 때 | `test-driven-development`, `browser-testing-with-devtools` |
| 디버깅할 때 | `debugging-and-error-recovery` |
| 리뷰할 때 | `code-review-and-quality`, `code-simplification` |
| 보안 / 성능 | `security-and-hardening`, `performance-optimization` |
| Git / CI / 출시 | `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch` |

전체 트리: 저장소의 `skills/using-agent-skills/SKILL.md`.

---

## 하지 말 것

| 피하세요 | 대신 하세요 |
|-------|------------|
| 모든 스킬을 규칙 하나에 붙여 넣기 | `.cursor/skills/`로 동기화 |
| 서로 어긋나는 사본 두 개를 유지 | 업스트림에서 `rsync`하고, `.cursor/skills/`를 커밋 |
| `alwaysApply: true` 규칙을 많이 두기 | 라우팅 규칙 하나와, 초점 있는 globs 규칙 |
| `.cursorrules`에만 의존 | `.mdc`와 스킬로 마이그레이션 |
| `agent-skills/agents/*.md`가 자동으로 로드되리라 기대 | 채팅에 붙여 넣거나, 짧은 규칙으로 압축 |

---

## 컨텍스트 팁

- **항상 켜 둔** 규칙은 작게 유지하세요(라우팅과 양보할 수 없는 항목 1~2개).
- 긴 체크리스트와 합리화 표는 **스킬**이 담게 하세요.
- 단계별 **globs** 규칙은 필요할 때만 추가하세요(예: `**/*.py`, `**/components/**`).
- 검증 단계가 빠지면 스킬 이름으로 집어서 알려 주세요.

---

## `agents/` 디렉터리

`agent-skills/agents/` 아래 파일(예: 코드 리뷰어 페르소나)은 Cursor가 **자동으로 로드하지 않습니다.** 선택지:

- 대응하는 스킬을 참조하세요(`code-review-and-quality`).
- 한 번의 리뷰를 위해 에이전트 마크다운을 채팅에 붙여 넣으세요.
- **짧은** 체크리스트를 `.mdc` 규칙으로 빼내세요.

---

## 문제 해결

| 증상 | 확인할 것 |
|---------|--------|
| 스킬이 쓰이지 않음 | `.cursor/skills/<name>/` 아래에 `SKILL.md`가 있는지, frontmatter `description`이 유효한지 |
| 규칙이 무시됨 | 확장자가 `.mdc`인지, `alwaysApply` / `globs`가 맞는지 |
| 오래된 워크플로우 | `agent-skills/skills/`에서 다시 `rsync` |
| 지시가 중복됨 | 규칙에서 스킬 내용을 제거하고, 출처는 하나로 유지 |
| 잘못된 스킬이 선택됨 | 커스텀 스킬의 `description`을 좁히고, 채팅에서 집어서 알려 주세요 |
| `/`로 스킬을 첨부한 직후 "An unexpected error occurred on our servers"가 나오고, 그 채팅의 이후 메시지도 모두 실패함 | Cursor 쪽의 알려진 문제이며, [#494](https://github.com/addyosmani/agent-skills/issues/494)에서 추적 중입니다. Cursor가 첨부된 `SKILL.md`를 요청에 넣고, 실패는 스킬이 아니라 Cursor 쪽에서 일어납니다. 새 채팅을 시작하고, 스킬을 첨부하는 대신 일반 텍스트로 이름을 적으세요("Use the test-driven-development skill to …", 즉 test-driven-development 스킬을 써서 …하라고). |

---

## 체크리스트(새 프로젝트)

- [ ] `mkdir -p .cursor/skills`를 실행하고 `agent-skills/skills/`에서 동기화하세요
- [ ] 선택: 라우팅 힌트가 있는 `.cursor/rules/agent-skills.mdc`
- [ ] 저장소별 규칙을 작고 별도의 `.mdc` 파일로 추가하세요
- [ ] `.cursor/skills/`와 `.cursor/rules/`를 커밋하세요(팀이 동작을 공유합니다)
- [ ] 레거시 도구가 요구하지 않으면 거대한 `.cursorrules`는 두지 마세요

---

## 함께 보기

- [getting-started.md](getting-started.md)
- [../README.md](../README.md): Cursor용 짧은 소개
- 업스트림: [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
