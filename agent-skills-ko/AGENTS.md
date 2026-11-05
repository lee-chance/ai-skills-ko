# AGENTS.md

이 파일은 이 저장소의 코드를 작업할 때 AI 코딩 에이전트(Claude Code, Cursor, Copilot, Antigravity 등)에 안내를 제공합니다.

> **범위:** 이 파일은 [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) 저장소 자체를 작업하는 에이전트를 설정합니다. 다른 프로젝트나 전역 에이전트 설정으로 복사하기 위한 파일이 아닙니다. 재사용할 수 있는 자산은 이 파일이 아니라 `skills/`의 스킬입니다.

## 저장소 개요

시니어 소프트웨어 엔지니어를 위한, Claude.ai와 Claude Code용 스킬 모음입니다. 스킬은 Claude와 코딩 에이전트의 능력을 확장하는, 패키징된 지시와 스크립트입니다.

## OpenCode 통합

OpenCode는 `skill` 도구와 이 저장소의 `/skills` 디렉터리가 이끄는 **스킬 주도 실행 모델**을 사용합니다.

### 핵심 규칙

- 작업이 스킬과 맞으면 반드시 그 스킬을 호출하세요
- 스킬은 `skills/<skill-name>/SKILL.md`에 있습니다
- 적용되는 스킬이 있으면 직접 구현하지 마세요
- 스킬 지시를 정확히 따르세요. 일부만 적용하지 마세요

### 의도에서 스킬로 매핑

에이전트는 사용자 의도를 스킬에 자동으로 매핑해야 합니다.

- 기능 / 새 기능 → `spec-driven-development`, 그다음 `incremental-implementation`, `test-driven-development`
- 계획 / 분해 → `planning-and-task-breakdown`
- 버그 / 실패 / 예상 밖의 동작 → `debugging-and-error-recovery`
- 코드 리뷰 → `code-review-and-quality`
- 리팩터 / 단순화 → `code-simplification`
- API 또는 인터페이스 설계 → `api-and-interface-design`
- UI 작업 → `frontend-ui-engineering`

### 생명주기 매핑 (암시적 커맨드)

OpenCode는 `/spec`이나 `/plan` 같은 슬래시 커맨드를 지원하지 않습니다.

그 대신 에이전트는 내부적으로 이 생명주기를 따라야 합니다.

- 정의 (DEFINE) → `spec-driven-development`
- 계획 (PLAN) → `planning-and-task-breakdown`
- 구현 (BUILD) → `incremental-implementation` + `test-driven-development`
- 검증 (VERIFY) → `debugging-and-error-recovery`
- 리뷰 (REVIEW) → `code-review-and-quality`
- 출시 (SHIP) → `shipping-and-launch`

### 실행 모델

모든 요청에 대해:

1. 스킬이 적용되는지 판단하세요 (가능성이 1%라도)
2. `skill` 도구로 알맞은 스킬을 호출하세요
3. 스킬 워크플로우를 엄격히 따르세요
4. 필요한 단계(스펙, 계획 등)가 끝난 뒤에만 구현으로 넘어가세요

### 합리화 방지

다음 생각은 틀렸으므로 무시해야 합니다.

- "이건 스킬을 쓰기엔 너무 작아"
- "그냥 빨리 구현하면 돼"
- "일단 컨텍스트부터 모을게"

올바른 행동:

- 항상 스킬이 있는지 먼저 확인하고 사용하세요

이렇게 하면 OpenCode가 워크플로우를 완전히 강제하는 Claude Code와 비슷하게 동작합니다.

## 오케스트레이션: 페르소나, 스킬, 커맨드

이 저장소에는 조합 가능한 세 계층이 있습니다. 하는 일이 다르므로 섞지 마세요.

- **스킬** (`skills/<name>/SKILL.md`): 단계와 종료 기준이 있는 워크플로우입니다. *방법*입니다. 의도가 맞으면 반드시 거치는 단계입니다.
- **페르소나** (`agents/<role>.md`): 관점과 출력 형식이 있는 역할입니다. *주체*입니다.
- **슬래시 커맨드** (`.claude/commands/*.md`): 사용자에게 보이는 진입점입니다. *시점*입니다. 오케스트레이션 계층입니다.

구성 규칙: **오케스트레이터는 사용자(또는 슬래시 커맨드)입니다. 페르소나는 다른 페르소나를 호출하지 않습니다.** 페르소나는 스킬을 호출할 수 있습니다.

이 저장소가 인정하는 다중 페르소나 오케스트레이션 패턴은 **병합 단계가 있는 병렬 팬아웃**뿐입니다. `/ship`이 `code-reviewer`, `security-auditor`, `test-engineer`를 동시에 실행하고 보고서를 종합할 때 씁니다. 어떤 다른 페르소나를 호출할지 정하는 "라우터" 페르소나는 만들지 마세요. 그 일은 슬래시 커맨드와 의도 매핑이 합니다.

의사결정 매트릭스는 [docs/agents.md](docs/agents.md), 전체 패턴 목록은 [references/orchestration-patterns.md](references/orchestration-patterns.md)를 보세요.

**Claude Code 상호 운용:** `agents/`의 페르소나는 Claude Code 서브에이전트(이 플러그인의 `agents/` 디렉터리에서 자동 발견)로도, Agent Teams 팀원(생성할 때 이름으로 참조)으로도 동작합니다. 플랫폼 제약 두 가지가 우리 규칙과 맞습니다. 서브에이전트는 다른 서브에이전트를 생성할 수 없고, 팀은 중첩할 수 없습니다. 플러그인 에이전트는 `hooks`, `mcpServers`, `permissionMode` frontmatter 필드를 조용히 무시합니다.

## 새 스킬 만들기

> **시작하기 전에:** [CONTRIBUTING.md](CONTRIBUTING.md#before-proposing-a-new-skill)의 사전 점검을 실행하고, 카탈로그를 검색하고, 열린 풀 리퀘스트를 확인하며 (`gh pr list --state open`), 아이디어가 [docs/skill-anatomy.md](docs/skill-anatomy.md)에 맞는지 확인하고, 풀 리퀘스트 설명에서 공백을 정당화하세요. 새 스킬 아이디어의 대부분은 기존 스킬이나 열린 풀 리퀘스트와 겹칩니다. 거의 중복을 추가하기보다 기존 스킬을 확장하세요. 이 워크플로우의 단일 기준은 CONTRIBUTING.md입니다.

이 저장소의 스킬은 마크다운이 우선입니다. 각각 `skills/<kebab-case-name>/SKILL.md`에 있고, YAML frontmatter(`name`, `description`)를 쓰며, 섹션 구조(Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification)를 따릅니다. 스킬이 실행 가능한 도우미를 포함할 때만 `scripts/` 디렉터리를 추가하세요. 대부분의 스킬은 마크다운뿐이고, 스킬별 zip 패키지는 없습니다.

전체 형식, 이름 규칙, frontmatter 규칙, 보조 파일 기준, 작성 원칙은 스킬 구조의 단일 기준인 [docs/skill-anatomy.md](docs/skill-anatomy.md)를 보세요. 그 안내를 여기에 다시 적지 말고, 링크로 연결하세요.
