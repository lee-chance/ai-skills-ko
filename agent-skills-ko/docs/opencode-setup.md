# OpenCode 설정

이 가이드는 OpenCode에서 Agent Skills를 사용하는 방법을 설명합니다. 재사용 가능한 자산은 `skills/` 디렉터리의 마크다운 스킬입니다. 이 저장소 루트의 `AGENTS.md`는 이 저장소 전용이며, 다른 프로젝트로 복사하면 안 됩니다.

## 개요

OpenCode는 여러 위치에서 스킬을 탐색합니다. Agent Skills는 두 가지 선택적 사용 방식을 제공합니다.

- **에이전트 주도 워크플로우:** 내장 `skill` 도구와, 자신의 저장소용으로 작성하는 프로젝트 로컬 `AGENTS.md`를 통해 스킬이 자동으로 선택됩니다.
- **커맨드 주도 워크플로우:** `.opencode/commands/`로 라이프사이클 커맨드를 수동 호출합니다(선택 사항).

## 설치

스킬을 프로젝트에 넣는 방법은 두 가지입니다.

1. `skills` CLI로 설치합니다(가장 빠릅니다).
2. 이 저장소를 클론하고 스킬 디렉터리를 수동으로 복사합니다.

어느 쪽이든 끝난 뒤, 프로젝트 로컬 `AGENTS.md`를 직접 만드세요. 필요하면 `.opencode/commands/*.md` 파일도 복사합니다.

### 방법 1: `npx skills`로 설치

가장 빠른 길은 공개된 [`skills` CLI](https://github.com/vercel-labs/skills)입니다.

```bash
npx skills add addyosmani/agent-skills            # install selected skills
npx skills add addyosmani/agent-skills --list     # browse before installing
```

스킬 하나만 설치합니다.

```bash
npx skills add addyosmani/agent-skills --skill spec-driven-development
```

기본적으로 `npx skills`는 도구별 디렉터리(흔히 `.claude/skills/` 또는 공유 위치)에 설치합니다. OpenCode는 `.claude/skills/<name>/SKILL.md`와 일반적인 `.agents/skills/<name>/SKILL.md` 경로를 읽으므로, 그곳에 둔 스킬을 탐색합니다.

스킬이 OpenCode가 살펴보지 않는 곳에 설치되면, 아래 탐색 경로 중 하나로 복사하거나 심볼릭 링크를 만드세요. 예를 들면 다음과 같습니다.

```bash
mkdir -p .opencode/skills
cp -r .claude/skills/<skill-name> .opencode/skills/
```

> **참고:** 스킬 단위 설치는 스킬 디렉터리 자체만 복사합니다. 스킬이 `references/` 아래의 공유 파일을 참조한다면, 그 파일을 설치된 스킬 디렉터리로 복사하거나 팩 전체를 설치하세요. 배경은 [#361](https://github.com/addyosmani/agent-skills/issues/361)을 보세요.

### 방법 2: 이 저장소 클론

1. 저장소를 클론합니다.

```bash
git clone https://github.com/addyosmani/agent-skills.git
```

2. 원하는 스킬을 OpenCode 스킬 탐색 경로 중 하나로 복사합니다.

#### 프로젝트 로컬 설치

```bash
mkdir -p .opencode/skills
cp -r /path/to/agent-skills/skills/<skill-name> .opencode/skills/
```

예를 들어 `spec-driven-development`와 `incremental-implementation`을 설치하려면 다음과 같습니다.

```bash
mkdir -p .opencode/skills
cp -r /path/to/agent-skills/skills/spec-driven-development .opencode/skills/
cp -r /path/to/agent-skills/skills/incremental-implementation .opencode/skills/
```

#### 전역 설치

```bash
mkdir -p ~/.config/opencode/skills
cp -r /path/to/agent-skills/skills/<skill-name> ~/.config/opencode/skills/
```

#### 상호 호환 경로

OpenCode는 Claude 호환 경로나 일반적인 에이전트 경로에 둔 스킬도 탐색합니다.

- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

이미 Claude Code와 OpenCode 사이에서 스킬을 공유하고 있다면, 이 위치 중 어디든 동작합니다.

### 복사할 것

`skills/` 아래의 디렉터리를 복사하세요(예: `skills/spec-driven-development/`). 각 디렉터리에는 `SKILL.md` 파일이 있어야 합니다. 저장소 루트의 `AGENTS.md`나 `CLAUDE.md`는 복사하지 마세요. 그 파일들은 이 저장소 자체의 개발을 구성합니다.

## 프로젝트 `AGENTS.md`

**자신의 프로젝트** 루트에 `AGENTS.md`를 만드세요. 이것은 설치된 스킬을 언제, 어떻게 호출할지 OpenCode에 알려 주는 시스템 프롬프트입니다. `addyosmani/agent-skills`의 저장소 범위 `AGENTS.md`와 달리, 이 파일은 자신의 프로젝트에 속하며 사용하는 스택에 맞게 고쳐야 합니다.

아래에 프로젝트의 `AGENTS.md`에 붙여 넣을 수 있는 템플릿이 있습니다.

```markdown
# Agent Skills (OpenCode)

이 프로젝트는 `.opencode/skills/`(또는 호환 경로) 아래에 설치된 스킬을 사용합니다.

## 핵심 규칙

- 작업이 스킬과 맞으면, 행동하기 전에 `skill` 도구로 호출합니다.
- 스킬은 `.opencode/skills/<skill-name>/SKILL.md`에 있습니다.
- 스킬 워크플로우를 엄격히 따르고, 일부만 적용하지 않습니다.
- 스킬이 스펙, 계획, 테스트를 요구하면 그 필수 단계를 건너뛰지 않습니다.

## 의도 → 스킬 대응

사용자의 의도를 맞는 스킬에 자동으로 대응시킵니다.

- 기능 / 새 기능 → `spec-driven-development`, 그다음 `incremental-implementation`과 `test-driven-development`
- 계획 / 분해 → `planning-and-task-breakdown`
- 버그 / 실패 / 예상 밖 동작 → `debugging-and-error-recovery`
- 코드 리뷰 → `code-review-and-quality`
- 리팩터링 / 단순화 → `code-simplification`
- API 또는 인터페이스 설계 → `api-and-interface-design`
- UI 작업 → `frontend-ui-engineering`

## 실행 모델

모든 요청에 대해:

1. 적용되는 스킬이 있는지 판단합니다(가능성이 작아도).
2. `skill({ name: "<skill-name>" })`로 스킬을 로드합니다.
3. 스킬 워크플로우를 그대로 따릅니다.
4. 필수 단계가 끝난 뒤에만 구현으로 진행합니다.
```

프로젝트 루트에 `AGENTS.md`로 저장하세요. OpenCode가 자동으로 불러옵니다.

> **참고:** `addyosmani/agent-skills` 저장소 루트의 `AGENTS.md`는 이 저장소에서 작업하는 기여자를 위한 파일이며, 다른 프로젝트로 복사하면 안 됩니다. [CONTRIBUTING.md](../CONTRIBUTING.md#repo-scoped-files)를 보세요.

## 동작 방식

### 1. 스킬 탐색

OpenCode는 다음 경로를 순서대로 살펴봅니다. 프로젝트 로컬이 먼저이고, 그다음이 전역입니다.

- `.opencode/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

각 스킬에는 프론트매터에 유효한 `name`과 `description`이 있는 `SKILL.md` 파일이 있어야 합니다.

### 2. 자동 스킬 호출

프로젝트의 `AGENTS.md`가 에이전트에게 스킬을 쓰라고 지시하면, 에이전트는 모든 요청을 평가하고 알맞은 스킬에 매핑합니다.

예:

- "build a feature"(기능 만들기) → `incremental-implementation` + `test-driven-development`
- "design a system"(시스템 설계) → `spec-driven-development`
- "fix a bug"(버그 수정) → `debugging-and-error-recovery`
- "review this code"(이 코드 리뷰) → `code-review-and-quality`

### 3. 라이프사이클 매핑 (암시적 커맨드)

OpenCode는 슬래시 커맨드를 요구하지 않습니다. 슬래시 커맨드를 선호하면 다음 절을 보세요. 에이전트 주도 모드에서는 라이프사이클이 암시적으로 매핑됩니다.

- 정의 (DEFINE) → `spec-driven-development`
- 계획 (PLAN) → `planning-and-task-breakdown`
- 빌드 (BUILD) → `incremental-implementation` + `test-driven-development`
- 검증 (VERIFY) → `debugging-and-error-recovery`
- 리뷰 (REVIEW) → `code-review-and-quality`
- 출시 (SHIP) → `shipping-and-launch`

### 선택적 슬래시 커맨드 복사

명시적 커맨드를 선호하면, 이 저장소의 예시 커맨드 파일을 프로젝트로 복사하고 설치한 스킬을 호출하도록 고치세요.

```bash
mkdir -p .opencode/commands
cp /path/to/agent-skills/.opencode/commands/*.md .opencode/commands/
```

> **참고:** 현재 저장소의 `main`에는 `.opencode/commands/*.md`가 없습니다. 커맨드 파일을 직접 만들거나, 추가를 제안하는 풀 리퀘스트 #200을 지켜보세요. 파일이 생기면 위의 패턴을 적용하면 됩니다.

일반적인 커맨드 파일은 다음과 같습니다.

```markdown
---
description: 작업을 작고 검증 가능한 작업으로 나눕니다
---

planning-and-task-breakdown 스킬을 호출하세요. 스펙을 읽고 인수 기준이 있는 작업을 만드세요.
```

`.opencode/commands/plan.md`로 저장하면 OpenCode에서 `/plan`을 쓸 수 있습니다.

## 사용 예

### 예 1: 기능 개발

사용자:
```
Add authentication to this app
```

에이전트 동작:
- 기능 작업임을 감지합니다
- `spec-driven-development`를 호출합니다
- 코드를 작성하기 전에 스펙을 만듭니다
- 이어서 계획과 구현 스킬로 넘어갑니다

### 예 2: 버그 수정

사용자:
```
This endpoint is returning 500 errors
```

에이전트 동작:
- `debugging-and-error-recovery`를 호출합니다
- 재현하고, 위치를 좁히고, 고친 뒤, 가드를 추가합니다

### 예 3: 코드 리뷰

사용자:
```
Review this PR
```

에이전트 동작:
- `code-review-and-quality`를 호출합니다
- 구조화된 리뷰(정확성, 설계, 가독성 등)를 적용합니다

## 에이전트에 기대하는 동작

OpenCode가 올바르게 동작하려면 에이전트는 다음을 해야 합니다.

- 행동하기 전에 적용되는 스킬이 있는지 항상 확인합니다
- 적용되면 `skill` 도구로 스킬을 불러옵니다
- 필요한 워크플로우(스펙, 계획, 테스트 등)를 건너뛰지 않습니다
- 구현으로 바로 건너뛰지 않습니다

이 규칙은 스킬 사본이 아니라 프로젝트의 `AGENTS.md`가 강제합니다.

## 제한 사항

- 스킬 호출은 모델이 지시를 따르는지에 달려 있습니다.
- OpenCode는 스킬을 자동으로 설치하지 않습니다. 필요한 디렉터리를 복사하거나 설치하세요.
- 스킬이 `references/` 아래 파일을 참조한다면, 수동 설치 시 그 파일도 복사해야 할 수 있습니다.

## 요약

1. 필요한 스킬을 설치하세요. `npx skills add addyosmani/agent-skills`를 쓰거나, 이 저장소 클론에서 `.opencode/skills/`(프로젝트), `~/.config/opencode/skills/`(전역), 또는 `.claude/skills/` / `.agents/skills/` 같은 상호 호환 경로로 복사합니다.
2. 위의 규칙과 의도 매핑이 담긴 프로젝트 로컬 `AGENTS.md`를 직접 만드세요.
3. OpenCode가 스킬을 탐색하고, `AGENTS.md`가 에이전트에게 스킬을 호출하도록 안내합니다.
4. 명시적 슬래시 커맨드가 필요하면 `.opencode/commands/*.md`를 추가하세요.

이렇게 하면 재사용 가능한 자산(스킬)과 저장소별 구성(`addyosmani/agent-skills` 루트의 `AGENTS.md`)이 분리됩니다.
