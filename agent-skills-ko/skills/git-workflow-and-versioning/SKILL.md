---
name: git-workflow-and-versioning
description: Git 워크플로우 관행을 구조화합니다. 코드 변경을 할 때마다 사용하세요. 커밋, 브랜치, 충돌 해결, 어수선한 워킹 트리의 커밋되지 않은 작업을 깨끗한 원자적 커밋으로 나누기, 풀 리퀘스트를 열거나 리뷰하기, 리모트에 푸시하기, 여러 병렬 흐름에 걸쳐 작업을 정리할 때 사용하세요. 릴리스를 내거나, 시맨틱 버전 범프를 고르거나, 태그를 달거나, 변경 이력을 쓸 때 사용하세요. 변경의 커밋 메시지 또는 변경 이력 항목을 작성해 달라고 하거나 변경을 커밋으로 나누라고 할 때도 사용하세요. diff가 인라인으로 붙여넣어져 있고 그 diff만으로 메시지가 쉬워 보여도 마찬가지입니다.
---

# Git Workflow and Versioning

## 개요

Git은 안전망입니다. 커밋은 저장 지점으로, 브랜치는 샌드박스로, 이력은 문서로 다루세요. AI 에이전트가 빠른 속도로 코드를 생성하는 상황에서, 규율 있는 버전 관리는 변경을 관리할 수 있고, 리뷰할 수 있고, 되돌릴 수 있게 유지하는 메커니즘입니다.

## 언제 사용하나

항상입니다. 모든 코드 변경은 Git을 거칩니다.

## 핵심 원칙

### 트렁크 기반 개발 (Trunk-Based Development)

`main`은 항상 배포 가능한 상태로 유지하세요. 1~3일 안에 다시 머지되는 짧은 수명의 기능 브랜치에서 작업하세요. 오래 사는 개발 브랜치는 숨은 비용입니다. 갈라지고, 머지 충돌을 만들고, 통합을 늦춥니다. DORA 연구는 트렁크 기반 개발이 고성과 엔지니어링 팀과 상관관계가 있음을 일관되게 보여 줍니다.

```
main ──●──●──●──●──●──●──●──●──●──  (always deployable)
        ╲      ╱  ╲    ╱
         ●──●─╱    ●──╱    ← short-lived feature branches (1-3 days)
```

이것이 권장 기본값입니다. gitflow나 오래 사는 브랜치를 쓰는 팀은 그 원칙(원자적 커밋, 작은 변경, 설명적인 메시지)을 자기 브랜치 모델에 맞게 적용할 수 있습니다. 구체적인 브랜치 전략보다 커밋 규율이 더 중요합니다.

- **개발 브랜치는 비용입니다.** 브랜치가 살아 있는 하루마다 머지 위험이 쌓입니다.
- **릴리스 브랜치는 허용됩니다.** main이 앞으로 나아가는 동안 릴리스를 안정화해야 할 때입니다.
- **긴 브랜치보다 피처 플래그.** 미완성 작업을 몇 주간 브랜치에 두기보다, 플래그 뒤에 두고 배포하는 쪽을 선호하세요.

### 1. 일찍, 자주 커밋하세요

성공한 각 증분은 자기 커밋을 갖습니다. 커밋되지 않은 큰 변경을 쌓아 두지 마세요.

```
Work pattern:
  Implement slice → Test → Verify → Commit → Next slice

Not this:
  Implement everything → Hope it works → Giant commit
```

커밋은 저장 지점입니다. 다음 변경이 무언가를 깨뜨리면, 마지막으로 알려진 정상 상태로 즉시 되돌릴 수 있습니다.

### 2. 원자적 커밋

각 커밋은 논리적으로 한 가지 일을 합니다.

```
# Good: Each commit is self-contained
git log --oneline
a1b2c3d Add task creation endpoint with validation
d4e5f6g Add task creation form component
h7i8j9k Connect form to API and add loading state
m1n2o3p Add task creation tests (unit + integration)

# Bad: Everything mixed together
git log --oneline
x1y2z3a Add task feature, fix sidebar, update deps, refactor utils
```

### 3. 설명적인 메시지

커밋 메시지는 *무엇*을 넘어 *왜*를 설명합니다.

```
# Good: Explains intent
feat: add email validation to registration endpoint

Prevents invalid email formats from reaching the database.
Uses Zod schema validation at the route handler level,
consistent with existing validation patterns in auth.ts.

# Bad: Describes what's obvious from the diff
update auth.ts
```

**형식:**

```
<type>: <short description>

<optional body explaining why, not what>
```

**타입:**

- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 버그를 고치지도 않고 기능을 추가하지도 않는 코드 변경
- `test`: 테스트 추가 또는 업데이트
- `docs`: 문서만 해당
- `chore`: 도구, 의존성, 설정

### 4. 관심사를 분리하세요

포맷 변경과 동작 변경을 한 커밋에 넣지 마세요. 리팩터와 기능을 한 커밋에 넣지 마세요. 각 종류의 변경은 별도의 커밋이어야 하고, 이상적으로는 별도의 풀 리퀘스트여야 합니다.

```
# Good: Separate concerns
git commit -m "refactor: extract validation logic to shared utility"
git commit -m "feat: add phone number validation to registration"

# Bad: Mixed concerns
git commit -m "refactor validation and add phone number field"
```

**리팩터를 기능 작업과 분리하세요.** 리팩터 변경과 기능 변경은 서로 다른 변경입니다. 따로 제출하세요. 그러면 각 변경을 리뷰하고, 되돌리고, 이력에서 이해하기가 쉬워집니다. 작은 정리(변수 이름 바꾸기)는 리뷰어 재량으로 기능 커밋에 넣을 수 있습니다.

### 5. 변경 크기를 맞추세요

커밋/풀 리퀘스트당 약 100줄을 목표로 하세요. 약 1000줄을 넘는 변경은 나누세요. 큰 변경을 쪼개는 방법은 `code-review-and-quality`의 분할 전략을 보세요.

```
~100 lines  → Easy to review, easy to revert
~300 lines  → Acceptable for a single logical change
~1000 lines → Split into smaller changes
```

## 브랜치 전략

### 기능 브랜치

```
main (always deployable)
  │
  ├── feature/task-creation    ← One feature per branch
  ├── feature/user-settings    ← Parallel work
  └── fix/duplicate-tasks      ← Bug fixes
```

- `main`(또는 팀의 기본 브랜치)에서 브랜치를 만드세요
- 브랜치를 짧게 유지하세요 (1~3일 안에 머지). 오래 사는 브랜치는 숨은 비용입니다
- 머지한 뒤 브랜치를 삭제하세요
- 미완성 기능에는 오래 사는 브랜치보다 피처 플래그를 선호하세요

### 브랜치 이름

```
feature/<short-description>   → feature/task-creation
fix/<short-description>       → fix/duplicate-tasks
chore/<short-description>     → chore/update-deps
refactor/<short-description>  → refactor/auth-module
```

## 워크트리로 작업하기

병렬 AI 에이전트 작업에는 git worktree로 여러 브랜치를 동시에 실행하세요.

```bash
# Create a worktree for a feature branch
git worktree add ../project-feature-a feature/task-creation
git worktree add ../project-feature-b feature/user-settings

# Each worktree is a separate directory with its own branch
# Agents can work in parallel without interfering
ls ../
  project/              ← main branch
  project-feature-a/    ← task-creation branch
  project-feature-b/    ← user-settings branch

# When done, merge and clean up
git worktree remove ../project-feature-a
```

이점:

- 여러 에이전트가 서로 다른 기능을 동시에 작업할 수 있습니다
- 브랜치를 전환할 필요가 없습니다 (각 디렉터리에 자기 브랜치가 있습니다)
- 실험이 실패하면 그 워크트리를 삭제하세요. 나머지 작업은 그대로 남습니다
- 명시적으로 머지하기 전까지 변경은 격리됩니다

## 저장 지점 패턴

```
Agent starts work
    │
    ├── Makes a change
    │   ├── Test passes? → Commit → Continue
    │   └── Test fails? → Revert to last commit → Investigate
    │
    ├── Makes another change
    │   ├── Test passes? → Commit → Continue
    │   └── Test fails? → Revert to last commit → Investigate
    │
    └── Feature complete → All commits form a clean history
```

잃을 수 있는 작업은 최대 한 증분입니다. 에이전트가 궤도를 벗어나면 `git reset --hard HEAD`로 마지막 성공 상태로 돌아갑니다.

## 변경 요약

어떤 수정 뒤에든 구조화된 요약을 제공하세요. 리뷰가 쉬워지고, 범위 규율이 문서화되며, 의도하지 않은 변경이 드러납니다.

```
CHANGES MADE:
- src/routes/tasks.ts: Added validation middleware to POST endpoint
- src/lib/validation.ts: Added TaskCreateSchema using Zod

THINGS I DIDN'T TOUCH (intentionally):
- src/routes/auth.ts: Has similar validation gap but out of scope
- src/middleware/error.ts: Error format could be improved (separate task)

POTENTIAL CONCERNS:
- The Zod schema is strict — rejects extra fields. Confirm this is desired.
- Added zod as a dependency (72KB gzipped) — already in package.json
```

이 패턴은 잘못된 가정을 일찍 잡고, 리뷰어에게 변경의 명확한 지도를 줍니다. "DIDN'T TOUCH" 섹션이 특히 중요합니다. 범위 규율을 지켰고, 요청받지 않은 개편으로 번지지 않았음을 보여 줍니다.

## 커밋 전 위생

모든 커밋 전에:

```bash
# 1. Check what you're about to commit
git diff --staged

# 2. Ensure no secrets (lists matching file names only — any output means review them)
git diff --staged -i -G'password|secret|api_key|token' --name-only

# 3. Run tests
npm test

# 4. Run linting
npm run lint

# 5. Run type checking
npx tsc --noEmit
```

git 훅으로 이것을 자동화하세요.

```json
// package.json (using lint-staged + husky)
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## 생성된 파일 다루기

- **생성된 파일은**, 프로젝트가 그것을 기대할 때만 커밋하세요 (예: `package-lock.json`, Prisma 마이그레이션)
- 빌드 산출물(`dist/`, `.next/`), 환경 파일(`.env`), IDE 설정(공유하지 않는 한 `.vscode/settings.json`)은 커밋하지 마세요
- `node_modules/`, `dist/`, `.env`, `.env.local`, `*.pem`을 다루는 `.gitignore`를 두세요

## 디버깅에 Git 사용하기

```bash
# Find which commit introduced a bug
git bisect start
git bisect bad HEAD
git bisect good <known-good-commit>
# Git checkouts midpoints; run your test at each to narrow down

# View what changed recently
git log --oneline -20
git diff HEAD~5..HEAD -- src/

# Find who last changed a specific line
git blame src/services/task.ts

# Search commit messages for a keyword
git log --grep="validation" --oneline
```

## 릴리스와 버저닝

커밋은 *여러분*이 변경을 추적하는 방법이고, **버전**은 *소비자*가 그것을 추적하는 방법입니다. 다른 무언가가 코드에 의존하는 순간(다른 팀, 게시된 패키지, 배포된 클라이언트)부터, "main의 최신"은 "지금 무엇을 실행 중이고, 업그레이드해도 안전한가?"에 충분한 답이 되지 않습니다. 버전 번호와 변경 이력이 그 질문에 답하는 계약입니다.

### 시맨틱 버저닝

소비자가 있는 것은 모두 `MAJOR.MINOR.PATCH`로 버전을 매기고, 숫자가 의미를 지니게 하세요.

```
  MAJOR  breaking change — consumers must change their code to upgrade
  MINOR  new functionality, backward-compatible — safe to upgrade
  PATCH  bug fix, backward-compatible — safe to upgrade
```

숫자는 약속이므로 코드가 그 숫자와 맞게 하세요. 소비자가 의존하던 동작을 바꾸는 "patch"는 위장한 major입니다 (하이럼의 법칙. `api-and-interface-design` 스킬을 보세요). 변경이 호환성을 깨는지 확실하지 않으면 깨진다고 가정하세요. 예상 밖의 major는 깨진 소비자보다 훨씬 비용이 적습니다.

### 릴리스에 태그를 달고, 태그를 기준으로 삼으세요

릴리스는 움직이는 브랜치가 아니라 역사 위의 불변한 지점입니다. 언제든 재현할 수 있도록 태그를 다세요.

```bash
git tag -a v1.4.0 -m "Release 1.4.0"
git push origin v1.4.0
```

흩어진 파일에서 손으로 고치는 대신 태그에서 버전을 도출하세요. 그러면 아티팩트, 태그, 변경 이력이 서로 어긋나지 않습니다.

### 사람을 위해 쓴 변경 이력을 유지하세요

변경 이력은 `git log`가 아닙니다. "무엇이 바뀌었고, 내가 신경 써야 하나?"에 대한, 소비자를 향한 큐레이션된 답입니다. `Added / Changed / Fixed / Deprecated / Removed / Security`로 묶고, 최신이 위에 오며, 각 항목은 내부 구현이 아니라 사용자 영향 중심으로 씁니다.

```markdown
## [1.4.0] - 2025-06-12
### Added
- Bulk task import via CSV
### Fixed
- Timezone drift in recurring task due dates
### Deprecated
- `GET /v1/tasks/all` — use the paginated `GET /v1/tasks` (removal in 2.0)
```

영향이 생생할 때, 그 변경을 만드는 바로 그 변경 안에서 항목을 작성하세요. 릴리스 시점에 커밋을 파헤쳐 재구성하지 마세요. 호환성을 깨는 변경에는 마이그레이션 노트와 지원 종료 기간을 둡니다 (`deprecation-and-migration` 스킬을 따르세요). 실제 릴리스 출시는 `shipping-and-launch` 스킬의 일입니다. 이 섹션은 그 스킬에 넘기는 버저닝 계약입니다.

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "기능이 끝나면 커밋하겠습니다" | 거대한 커밋 하나는 리뷰할 수도, 디버그할 수도, 되돌릴 수도 없습니다. 각 조각마다 커밋하세요. |
| "메시지는 중요하지 않습니다" | 메시지는 문서입니다. 미래의 여러분과 미래의 에이전트는 무엇이 왜 바뀌었는지 이해해야 합니다. |
| "나중에 전부 스쿼시하면 됩니다" | 스쿼시는 개발의 서사를 없앱니다. 처음부터 깨끗한 점진적 커밋을 선호하세요. |
| "브랜치는 오버헤드를 더합니다" | 짧게 사는 브랜치는 비용이 없고, 서로 충돌하는 작업이 부딪히지 않게 합니다. 문제는 오래 사는 브랜치입니다. 1~3일 안에 머지하세요. |
| "이 변경은 나중에 나누겠습니다" | 큰 변경은 리뷰하기 어렵고, 배포 위험이 크며, 되돌리기도 어렵습니다. 제출한 뒤가 아니라 제출하기 전에 나누세요. |
| ".gitignore는 필요 없습니다" | 프로덕션 시크릿이 든 `.env`가 커밋될 때까지입니다. 즉시 설정하세요. |
| "작은 수정이니 patch만 올리면 됩니다" | 소비자가 관찰할 수 있는 것을 확인하세요. 그들이 의존하던 동작이 바뀌면 diff 크기와 관계없이 major입니다. |
| "변경 이력은 그냥 커밋 로그입니다" | 커밋은 여러분을 위한 것이고, 변경 이력은 소비자를 위한 것이며 영향 기준으로 큐레이션됩니다. 날것의 커밋으로 만들면 중요한 내용이 묻힙니다. |
| "변경 이력은 릴리스 때 쓰면 됩니다" | 그때가 되면 영향은 기억으로 재구성되고, 절반은 빠집니다. 변경과 함께 항목을 작성하세요. |

## 레드 플래그

- 쌓여 가는 큰 미커밋 변경
- "fix", "update", "misc" 같은 커밋 메시지
- 동작 변경과 섞인 포맷 변경
- 프로젝트에 `.gitignore`가 없음
- `node_modules/`, `.env`, 또는 빌드 아티팩트를 커밋함
- main과 크게 갈라진 오래 사는 브랜치
- 공유 브랜치에 포스 푸시
- minor 또는 patch 버전 범프로 출시된 호환성 깨짐 변경
- 태그가 없는 릴리스, 또는 태그와 어긋나게 손으로 고친 버전 번호
- 변경 이력 항목이 없는 사용자 대상 릴리스, 또는 커밋 메시지를 그대로 쏟아 넣은 변경 이력

## 검증

모든 커밋에 대해:

- [ ] 커밋이 논리적으로 한 가지 일을 합니다
- [ ] 메시지가 이유를 설명하고, 타입 관례를 따릅니다
- [ ] 커밋 전에 테스트가 통과합니다
- [ ] diff에 시크릿이 없습니다
- [ ] 동작 변경에 포맷만 바꾼 변경이 섞여 있지 않습니다
- [ ] `.gitignore`가 표준 제외 항목을 다룹니다

소비자가 있는 모든 릴리스에 대해:

- [ ] 버전 범프가 변경과 맞습니다. 호환성 깨짐은 major, 추가는 minor, 수정은 patch입니다
- [ ] 릴리스에 태그가 달려 있고, 버전은 태그와 어긋나게 손으로 고친 것이 아니라 태그에서 도출됩니다
- [ ] 변경 이력에 이 버전에 대해 영향별로 묶인, 사람이 읽을 수 있게 큐레이션된 항목이 있습니다
