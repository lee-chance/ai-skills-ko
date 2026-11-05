# agent-skills 시작하기

agent-skills는 Markdown 지침을 받는 어떤 AI 코딩 에이전트에서든 동작합니다. 이 가이드는 도구에 공통인 방법을 다룹니다. 도구별 설정은 전용 가이드를 보세요.

자기 프로젝트를 설정하기 전에 따라 할 예제가 필요하신가요?
[대화형 튜토리얼](https://skills.addy.ie/tutorials/)에서는 그린필드 빌드, 브라운필드 기능, 안전한 자동화 루프를
Claude Code, Codex 또는 다른 에이전트에 복사해 넣을 수 있는 프롬프트와 함께 안내합니다.

## 스킬이 동작하는 방식

각 스킬은 특정 엔지니어링 워크플로우를 설명하는 Markdown 파일(`SKILL.md`)입니다. 에이전트의 컨텍스트에 로드되면, 에이전트는 검증 단계, 피해야 할 안티패턴, 종료 기준을 포함해 그 워크플로우를 따릅니다.

**스킬은 참조 문서가 아닙니다.** 에이전트가 따르는 단계별 프로세스입니다.

## 빠른 시작 (모든 에이전트)

### 1. 저장소 클론

```bash
git clone https://github.com/addyosmani/agent-skills.git
```

### 2. 스킬 선택

`skills/` 디렉터리를 살펴보세요. 각 하위 디렉터리의 `SKILL.md`에는 다음이 있습니다.

- **언제 사용하나**: 이 스킬이 적용된다는 트리거
- **프로세스**: 단계별 워크플로우
- **검증**: 작업이 끝났는지 확인하는 방법
- **흔한 합리화**: 에이전트가 단계를 건너뛰려고 쓸 수 있는 변명
- **레드 플래그**: 스킬이 위반되고 있다는 신호

### 3. 스킬을 에이전트에 로드

관련 `SKILL.md` 내용을 에이전트의 시스템 프롬프트, 규칙 파일, 또는 대화에 복사하세요. 가장 흔한 방법은 다음과 같습니다.

**시스템 프롬프트:** 세션을 시작할 때 스킬 내용을 붙여 넣으세요.

**규칙 파일:** 프로젝트 규칙 파일(CLAUDE.md, .cursorrules 등)에 스킬 내용을 추가하세요.

**대화:** 지시할 때 스킬을 언급하세요. "Follow the test-driven-development process for this change."(이 변경에는 test-driven-development 절차를 따르세요.)

### 4. 필요할 때 발견용 메타 스킬을 사용

에이전트가 스킬을 네이티브로 라우팅하지 않으면, `using-agent-skills` 스킬을 로드한 상태로 시작하세요. 작업 유형을 알맞은 스킬에 대응시키는 흐름도가 들어 있습니다.

호스트가 이미 description으로 스킬을 발견하고 활성화한다면, `using-agent-skills`를 항상 켜 둔 시스템 프롬프트나 규칙 파일에 함께 붙여 넣지 마세요. 같은 작업에 라우터가 둘이 됩니다. 개별 스킬을 설치하고, 호스트가 필요할 때 활성화하게 하세요.

### 기존 프로젝트는 마이그레이션이 필요 없습니다

기존 프로젝트의 루트에서, 사용 중인 에이전트의 일반적인 설정 경로로 팩을 설치한 다음 그 프로젝트에서 계속 작업하세요. 스킬은 맞는 작업에 대해 활성화됩니다. 새 저장소 레이아웃이나 기존 코드의 일회성 변환은 필요하지 않습니다.

이 저장소 루트의 `AGENTS.md`나 `CLAUDE.md`를 프로젝트에 복사하지 마세요.
그 파일들은 agent-skills 자체에 기여하는 사람을 위한 설정입니다. 에이전트가 보통 읽는 스킬과, 프로젝트에 한정된 지시만 추가하세요. 자리 잡은 코드베이스에서 점진적으로 롤아웃하려면 [도입 가이드](adoption-guide.md)를 따르세요.

## 권장 설정

실제 프로젝트에 롤아웃하시나요? **[도입 가이드](adoption-guide.md)**는 처음부터 끝까지의 경로 두 가지를 다룹니다. 그린필드 프로젝트를 첫날부터 전체 생애주기로 가는 경로와, 자리 잡은 코드베이스를 위한 점진적이고 검증 우선인 롤아웃입니다. 아래 설정은 빠른 버전입니다.

### 최소 (여기서 시작)

규칙 파일에 필수 스킬 세 개를 로드하세요.

1. **spec-driven-development**: 무엇을 만들지 정의할 때
2. **test-driven-development**: 동작함을 증명할 때
3. **code-review-and-quality**: 머지 전에 품질을 검증할 때

이 세 가지는 AI 보조 개발에서 가장 중요한 품질 공백을 다룹니다.

### 전체 생애주기

폭넓게 다루려면 단계별로 스킬을 로드하세요.

```
Starting a project:  spec-driven-development → planning-and-task-breakdown
During development:  incremental-implementation + test-driven-development
Before merge:        code-review-and-quality + security-and-hardening
Before deploy:       shipping-and-launch
```

### 상황에 맞는 로드

스킬을 한 번에 모두 로드하지 마세요. 컨텍스트를 낭비합니다. 현재 작업과 관련된 스킬을 로드하세요.

- UI를 다루고 있나요? `frontend-ui-engineering`을 로드하세요
- 디버깅 중인가요? `debugging-and-error-recovery`를 로드하세요
- CI를 설정 중인가요? `ci-cd-and-automation`을 로드하세요

## 스킬 구조

모든 스킬은 같은 구조를 따릅니다.

```
YAML frontmatter (name, description)
├── Overview — What this skill does
├── When to Use — Triggers and conditions
├── Core Process — Step-by-step workflow
├── Examples — Code samples and patterns
├── Common Rationalizations — Excuses and rebuttals
├── Red Flags — Signs the skill is being violated
└── Verification — Exit criteria checklist
```

전체 스펙은 [skill-anatomy.md](skill-anatomy.md)를 보세요.

## 에이전트 사용

`agents/` 디렉터리에는 미리 구성된 에이전트 페르소나가 있습니다.

| 에이전트 | 목적 |
|-------|---------|
| `code-reviewer.md` | 5축 코드 리뷰 |
| `test-engineer.md` | 테스트 전략과 작성 |
| `security-auditor.md` | 취약점 탐지 |
| `web-performance-auditor.md` | Core Web Vitals와 성능 감사 (`/webperf` 경유) |

전문 리뷰가 필요할 때 에이전트 정의를 로드하세요. 예를 들어 코딩 에이전트에게 "review this change using the code-reviewer agent persona"(이 변경을 code-reviewer 에이전트 페르소나로 리뷰하세요)라고 요청하고, 에이전트 정의를 함께 주세요.

## 커맨드 사용

`.claude/commands/` 디렉터리에는 Claude Code용 슬래시 커맨드가 있습니다.

| 커맨드 | 호출되는 스킬 |
|---------|---------------|
| `/spec` | spec-driven-development |
| `/constraints` | constraint-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation + test-driven-development |
| `/build auto` | planning-and-task-breakdown → incremental-implementation + test-driven-development (계획 전체, 승인 한 번) |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/code-simplify` | code-simplification |
| `/ship` | shipping-and-launch |
| `/webperf` | web-performance-auditor (전문 에이전트, 웹 앱만) |

> **참고:** Claude Code 플러그인으로 설치하면 다음과 같은 경고가 보일 수 있습니다.
> _"Default commands/ folder is ignored because the manifest sets 'commands'"_.
> 이것은 예상된 동작입니다. 루트 `commands/` 디렉터리는 Antigravity CLI 소유이고,
> `.claude/commands/`와 의도적으로 분리되어 있습니다. Claude Code 슬래시
> 커맨드는 모두 `.claude/commands/`에서 올바르게 로드됩니다. 경고는 외관상의 것입니다.

## 참조 사용

`references/` 디렉터리에는 보조 체크리스트가 있습니다.

| 참조 | 함께 사용 |
|-----------|----------|
| `testing-patterns.md` | test-driven-development |
| `performance-checklist.md` | performance-optimization |
| `security-checklist.md` | security-and-hardening |
| `accessibility-checklist.md` | frontend-ui-engineering |
| `definition-of-done.md` | 모든 스킬 / 모든 변경 |
| `observability-checklist.md` | observability-and-instrumentation |
| `orchestration-patterns.md` | doubt-driven-development |

스킬이 다루는 범위를 넘는 자세한 패턴이 필요할 때 참조를 로드하세요.

`npx skills add ... --skill <name>`으로 스킬 하나만 설치하면, 선택한
`skills/<name>/` 디렉터리만 복사됩니다. 스킬은 여전히 동작하지만, 저장소 수준의
`references/` 디렉터리에 있는 보조 체크리스트로 가는 경로는 사용할 수 없습니다.
저장소 전체 연동을 쓰거나, 저장소를 클론하거나, 필요한 체크리스트를 설치된 스킬
안의 `references/` 디렉터리로 복사하세요. 이 이식성 공백은
[addyosmani/agent-skills#361](https://github.com/addyosmani/agent-skills/issues/361)에서 추적합니다.

## 스펙과 작업 아티팩트

`/spec`과 `/plan` 커맨드는 작업 아티팩트(`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`)를 만듭니다. 작업이 진행되는 동안에는 **살아 있는 문서**로 다루세요.

- 개발 중에는 버전 관리에 두어서, 사람과 에이전트가 같은 기준을 공유하게 하세요.
- 범위나 결정이 바뀌면 업데이트하세요.
- 저장소가 이 파일을 장기적으로 두지 않으려면, 머지 전에 삭제하거나 폴더를 `.gitignore`에 추가하세요. 워크플로우가 이 파일을 영구히 요구하지는 않습니다.

<a id="working-across-sessions"></a>

### 세션을 넘나들며 작업하기

같은 아티팩트가 세션 사이의 핸드오프입니다. 작은 작업은 한 세션에서 생애주기 전체를 실행하세요. 사소하지 않은 작업은 단계마다 새 세션(spec → plan → build → review)을 쓰면 컨텍스트가 그 단계에 모입니다. 작업을 앞으로 옮기는 것은 대화가 아니라 승인된 파일입니다.

- 스펙: `SPEC.md`, 또는 스펙이 실제로 있는 곳
- `tasks/plan.md`와 `tasks/todo.md`. 계획을 외부 트래커로 식별했다면, 그 트래커

**전환하기 전에**, 그 파일이 아직 유효한 결정, 승인한 범위, 아직 열린 질문, 다음 작업, 현재 검증 상태(어떤 테스트를 무엇에 대해 실행했는지)를 반영하는지 확인하세요.

**새 세션에서는** 무엇을 하기 전에 실제 파일을 읽고 `git status`를 보세요. 아티팩트에서 보이지 않는 승인은 가정하지 마세요. 기록된 "tests pass"(테스트 통과)는 특정 기준선에 대한 주장으로 다루세요. 그 이후 코드가 움직였거나, 무엇을 무엇에 대해 실행했는지 적혀 있지 않거나, 그 검사가 커버한 영역을 곧 건드릴 참이면, 그 검사가 커버하는 항목을 다시 실행하세요. 기준선이 여전히 유효하면 그것을 받아들이고 다음 작업으로 넘어가세요. 핵심은 매 핸드오프마다 전체 스위트가 아니라, 바뀐 것에 비례하는 확인입니다.

#### 작업 경계 재시작과 Ralph loop

`/build auto`는 승인된 계획 전체를 한 세션에서 실행할 수 있습니다. 작업마다 새 프로세스를 요구하거나 수행하지는 않습니다. 작업별 상태 업데이트, 검증 결과, 커밋이 완료된 각 작업을 다시 시작할 수 있는 경계로 만듭니다. 그래서 능력 있는 외부 하네스는 채팅 기록에 의존하지 않고 거기서 종료했다가 재개할 수 있습니다.

셸 수준의 "Ralph loop"는 하네스 동작이지, 별도의 스킬 워크플로우가 아닙니다. 하나를 쓴다면, 현재 작업이 기록된 경계에 도달한 뒤에만 다시 시작하세요. 다시 들어올 때는 오래 남는 아티팩트와 저장소 상태를 읽은 다음 대기 중인 다음 작업을 고르세요. 프로세스 종료는 작업이 통과했다는 증거가 아니고, 재시작이 승인 게이트를 우회해서는 안 됩니다. 핸드오프 체크리스트는 `context-engineering` 스킬의 **재시작할 수 있는 세션 경계** 절을 보세요.

여기에는 `/spec`과 `/plan` 래퍼가 필요 없습니다. 평범한 요청은 스킬만 있는 `npx skills add` 설치를 포함해 어떤 에이전트에서든 동작합니다.

> SPEC.md를 읽은 다음, 인수 기준과 의존 순서가 있는 작고 검증 가능한 작업으로 나누세요. `tasks/plan.md`와 `tasks/todo.md`에 저장하세요. 제품 코드는 아직 작성하지 말고, 먼저 계획을 보여 주세요.

> SPEC.md, tasks/plan.md, tasks/todo.md를 읽은 다음 실제 상태를 확인하세요. `git status`를 보고, 기록된 검증 상태가 더 이상 커버하지 않는 검사를 다시 실행하세요. 아직 체크하지 않은 다음 작업과 아직 열린 항목을 말한 뒤 멈추세요. 시작하기 전에 제가 범위를 확인하겠습니다. 계획이 불완전해 보이면 다시 쓰지 말고 무엇이 빠졌는지 말하세요.

이 두 요청은 에이전트에 그대로 붙여 넣을 수 있습니다.

## 팁

1. 사소하지 않은 작업은 **spec-driven-development**로 시작하세요
2. 코드를 작성할 때는 **test-driven-development**를 항상 로드하세요
3. **검증 단계를 건너뛰지 마세요.** 그것이 핵심입니다
4. **스킬은 골라서 로드하세요.** 컨텍스트가 더 많다고 항상 더 좋은 것은 아닙니다
5. **리뷰에는 에이전트를 사용하세요.** 관점이 다르면 잡히는 문제도 다릅니다
