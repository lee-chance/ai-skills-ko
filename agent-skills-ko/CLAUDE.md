# agent-skills

이것은 agent-skills 프로젝트입니다. AI 코딩 에이전트를 위한 프로덕션 수준의 엔지니어링 스킬 모음입니다.

> **범위:** 이 파일은 [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) 저장소 자체를 작업하는 에이전트를 설정합니다. 다른 프로젝트를 위한 파일이 아닙니다. 다른 프로젝트나 전역 에이전트 설정으로 복사하지 마세요. 재사용할 수 있는 자산은 `skills/`의 스킬입니다.

## 프로젝트 구조

```
skills/       → 핵심 스킬 (디렉터리마다 SKILL.md)
agents/       → 재사용 가능한 에이전트 페르소나 (code-reviewer, test-engineer, security-auditor, web-performance-auditor)
hooks/        → 세션 생명주기 훅
.claude/commands/ → 슬래시 커맨드 (/spec, /plan, /build, /test, /review, /code-simplify, /ship, 그리고 전문 감사 /webperf)
references/   → 보충 체크리스트 (테스트, 성능, 보안, 접근성, 옵저버빌리티)
evals/        → 스킬 평가 케이스와 프레임워크 (evals/README.md 참고)
docs/         → 도구별 설정 가이드
```

## 단계별 스킬

**정의 (Define):** interview-me, idea-refine, spec-driven-development
**계획 (Plan):** planning-and-task-breakdown
**구현 (Build):** incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design
**검증 (Verify):** browser-testing-with-devtools, debugging-and-error-recovery
**리뷰 (Review):** code-review-and-quality, code-simplification, security-and-hardening, performance-optimization
**출시 (Ship):** git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, observability-and-instrumentation, shipping-and-launch

## 관례

- 모든 스킬은 `skills/<name>/SKILL.md`에 있습니다
- YAML frontmatter에 `name`과 `description` 필드가 있습니다
- description은 스킬이 하는 일(3인칭)로 시작하고, 이어서 트리거 조건("Use when...")이 옵니다
- 모든 스킬에는 Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification이 있습니다
- 공유 참조는 루트 `references/` 디렉터리에 있습니다. 자체 포함되어 배포 가능한 스킬을 위한, 자리 잡는 관례는 스킬 자신의 참조를 `skills/<name>/references/` 안에 둡니다
- 보조 파일은 내용이 100줄을 넘을 때만 만듭니다

## 기여

새 스킬을 추가하거나 기존 스킬을 크게 고치기 전에 [CONTRIBUTING.md](CONTRIBUTING.md#before-proposing-a-new-skill)의 사전 점검을 실행하세요. 카탈로그를 검색하고, 열린 풀 리퀘스트를 확인하고, 아이디어가 [docs/skill-anatomy.md](docs/skill-anatomy.md)에 맞는지 확인하고, 공백을 정당화하세요. 거의 중복을 추가하기보다 기존 스킬을 확장하세요. 이 워크플로우의 단일 기준은 CONTRIBUTING.md입니다. 그 체크리스트를 여기나 다른 곳에 다시 적지 말고, 링크로 연결하세요.

## 커맨드

- `npm test`: 해당 없음 (문서 프로젝트입니다)
- 검증: 모든 SKILL.md에 `name`과 `description`이 있는 유효한 YAML frontmatter가 있는지 확인하세요
- 평가: `node scripts/run-evals.js`. 모든 스킬의 트리거/라우팅 평가입니다 (CI). 채점 실행은 `--behavioral <skill>`입니다

## 풀 리퀘스트

풀 리퀘스트는 업스트림 저장소의 기본 브랜치를 대상으로 합니다. 일반적인 포크 설정에서는 업스트림 리모트가 `upstream`이고 자신의 포크가 `origin`이지만, 여기서 중요한 것은 정확한 리모트 이름이 아닙니다.

- 풀 리퀘스트를 열기 전에, 업스트림 저장소의 열린 풀 리퀘스트와 이슈에서 같은 파일이나 규칙을 건드리는 작업이 있는지 검색하세요. 겹치는 것이 있으면, 충돌하는 풀 리퀘스트를 여는 대신 조율하세요 (그 위에 쌓거나, 규칙을 맞추거나, 머지된 뒤 리베이스).
- 널리 공유되는 파일(예를 들어 `scripts/` 아래 파일)을 크게 리팩터하는 풀 리퀘스트보다, 작고 집중된 풀 리퀘스트를 선호하세요. 큰 변경은 진행 중인 작업과 충돌하기 쉽습니다.

## 경계

- 항상: 새 스킬 디렉터리를 만들기 전에 CONTRIBUTING.md 사전 점검을 실행하세요
- 항상: 새 스킬은 skill-anatomy.md 형식을 따르세요
- 항상: 새 풀 리퀘스트를 열기 전에 업스트림 저장소의 열린 풀 리퀘스트와 이슈에서 겹침을 확인하세요
- 하지 말 것: 실행 가능한 절차 대신 모호한 조언인 스킬을 추가하지 마세요
- 하지 말 것: 스킬 사이에 내용을 중복하지 마세요. 다른 스킬을 참조하세요
