# GitHub Copilot에서 agent-skills 사용하기

이 가이드는 VS Code의 Copilot을 다룹니다. 독립 실행형 `copilot` 명령줄 도구는 [copilot-cli-setup.md](copilot-cli-setup.md)를 보세요.

**설치로 실제로 얻는 것:** 스킬입니다. 설치된 각 스킬은 프론트매터의 `name`을 이름으로 하는 슬래시 커맨드가 됩니다. 예를 들어 `/spec-driven-development`, `/test-driven-development`입니다. `npx skills add addyosmani/agent-skills`와 아래의 수동 복사는 모두 스킬만 설치합니다. 두 경로 모두 이 저장소의 짧은 라이프사이클 래퍼(`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`)를 복사하지 않습니다. 그 래퍼는 `.claude/commands/`에 있는 Claude Code 커맨드입니다. 스킬의 전체 이름을 사용하거나, 직접 별칭을 추가하세요. [라이프사이클 워크플로우](#lifecycle-workflows)를 참고하세요.

> **`/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/webperf`, `/ship`은 Copilot에 나타나지 않습니다.** 이들은 Claude Code 커맨드이며, Copilot은 `.claude/commands/`를 읽지 않습니다. 설치 후에 보이지 않는 것은 예상된 동작이며, 빠뜨린 단계가 아닙니다. 스킬은 자신의 이름으로 호출하세요. `/spec`에는 `/spec-driven-development`, `/plan`에는 `/planning-and-task-breakdown`을 쓰고, 나머지도 같은 방식입니다. 전체 대응은 [라이프사이클 워크플로우](#lifecycle-workflows)에 있습니다. VS Code에서는 짧은 형태가 필요하면 [짧은 별칭](#optional-short-spec-style-aliases)을 직접 추가할 수 있습니다.

## 설정

### Copilot 지시문

Copilot은 저장소의 `.github/skills`, `.claude/skills`, `.agents/skills` 디렉터리로 에이전트 스킬을 만드는 것을 지원합니다.

```bash
mkdir -p .github/skills/test-driven-development .github/skills/code-review-and-quality

# Create files for essential skills
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .github/skills/test-driven-development/SKILL.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md > .github/skills/code-review-and-quality/SKILL.md
```

이 두 경로 중 어느 쪽을 쓰든, 결과는 세 프로젝트 경로 중 하나의 스킬 디렉터리마다 `SKILL.md`가 하나인 형태입니다. 전역/사용자 플래그로 설치 도구를 실행하면 다른 곳에 기록됩니다. 출력에서 사용한 경로를 확인하세요. Copilot Chat에서 `/skills`를 실행하면 **Configure Skills** 메뉴가 열립니다. 무엇이 탐색되었는지 확인하세요.

자세한 내용은 [GitHub Copilot용 에이전트 스킬 만들기](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)와 VS Code의 [에이전트 스킬](https://code.visualstudio.com/docs/agent-customization/agent-skills) 가이드를 참고하세요.

### 에이전트 페르소나 (*.agent.md)

Copilot은 전문화된 에이전트 페르소나를 지원합니다. agent-skills의 에이전트를 사용하세요.

> **중요:** GitHub Copilot은 커스텀 에이전트 파일 이름이 `*.agent.md`여야 합니다.
> `*.md`라는 이름의 파일은 Copilot이 조용히 무시합니다.
> 자세한 내용은 [VS Code 커스텀 에이전트 문서](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-file-structure)를 보세요.

```bash
# Create the agents directory and copy agent definitions
mkdir -p .github/agents
cp /path/to/agent-skills/agents/code-reviewer.md .github/agents/code-reviewer.agent.md
cp /path/to/agent-skills/agents/test-engineer.md .github/agents/test-engineer.agent.md
cp /path/to/agent-skills/agents/security-auditor.md .github/agents/security-auditor.agent.md
```

Copilot Chat에서 에이전트를 호출합니다.
- `@code-reviewer 이 풀 리퀘스트를 리뷰해 주세요`
- `@test-engineer 이 모듈의 테스트 커버리지를 분석해 주세요`
- `@security-auditor 이 엔드포인트의 취약점을 확인해 주세요`

### 사용자 지정 지시문 (사용자 수준)

모든 저장소에서 쓰고 싶은 스킬은 다음을 따르세요.

1. VS Code → Settings → GitHub Copilot → Custom Instructions를 엽니다.
2. 가장 자주 쓰는 스킬의 요약을 추가합니다.

## 권장 구성

### .github/copilot-instructions.md

GitHub Copilot은 `.github/copilot-instructions.md`로 프로젝트 수준 지시문을 지원합니다.

```markdown
# 프로젝트 코딩 표준

## 테스트
- 코드보다 테스트를 먼저 작성합니다 (TDD)
- 버그: 실패하는 테스트를 먼저 작성한 다음 고칩니다 (Prove-It 패턴)
- 테스트 계층: 단위 > 통합 > e2e (동작을 포착하는 가장 낮은 수준을 사용합니다)
- 변경할 때마다 `npm test`를 실행합니다

## 코드 품질
- 다섯 축으로 리뷰합니다: 정확성, 가독성, 아키텍처, 보안, 성능
- 모든 풀 리퀘스트는 다음을 통과해야 합니다: 린트, 타입 체크, 테스트, 빌드
- 코드나 버전 관리에 시크릿을 넣지 않습니다

## 구현
- 작고 검증 가능한 증분으로 빌드합니다
- 각 증분: 구현 → 테스트 → 검증 → 커밋
- 서식 변경과 동작 변경을 섞지 않습니다

## 경계
- 항상 할 것: 커밋 전에 테스트를 실행하고, 사용자 입력을 검증합니다
- 먼저 물어볼 것: 데이터베이스 스키마 변경, 새 의존성
- 절대 하지 말 것: 시크릿 커밋, 실패하는 테스트 제거, 검증 생략
```

### 전문화된 에이전트

Copilot Chat에서 목적에 맞는 리뷰 워크플로우에는 이 에이전트를 사용하세요.

<a id="lifecycle-workflows"></a>

## 라이프사이클 워크플로우

스킬은 기본적으로 사용자가 호출할 수 있습니다. 탐색되고 나면 추가 구성 없이, 스킬 자신의 이름으로 라이프사이클 전체를 쓸 수 있습니다.

| 워크플로우 | Copilot 호출 | 참고 |
|----------|--------------------|-------|
| 정의 (Define) | `/spec-driven-development` | 코드를 작성하기 전에 구조화된 스펙을 작성합니다 |
| 계획 (Plan) | `/planning-and-task-breakdown` | `tasks/plan.md`와 `tasks/todo.md`를 만듭니다 |
| 빌드 (Build) | `/incremental-implementation` | `/test-driven-development`와 함께 사용합니다. 한 번에 하나의 슬라이스입니다 |
| 검증 (Verify) | `/test-driven-development` | red-green-refactor. 버그에는 Prove-It |
| 리뷰 (Review) | `/code-review-and-quality` | 다섯 축 리뷰 |
| 출시 (Ship) | `/shipping-and-launch` | 출시 준비 |

이 워크스페이스에 실제로 불러온 항목은 `/`를 입력해 둘러보세요.

자연어는 대안이며, 슬래시 커맨드가 보이든 보이지 않든 어떤 Copilot 화면에서든 동작합니다.

> [기능]의 스펙을 작성하려면 spec-driven-development 스킬을 사용하세요.

> 스테이징된 변경을 리뷰하려면 code-review-and-quality 스킬을 사용하세요.

<a id="optional-short-spec-style-aliases"></a>

### 선택 사항: 짧은 `/spec` 스타일 별칭

VS Code의 익스텐션 호스트 로컬 에이전트는 `.github/prompts/<name>.prompt.md`의 [프롬프트 파일](https://code.visualstudio.com/docs/agent-customization/prompt-files)을 지원하며, 각각 `/<name>` 슬래시 커맨드가 됩니다. Agent Host는 프롬프트 파일을 **사용하지 않습니다**. 그곳에서는 위의 스킬 이름을 사용하세요.

별칭은 스킬 하나로 가는 얇은 바로가기일 뿐입니다. 이 별칭은 이 저장소의 Claude Code 커맨드가 하는 오케스트레이션을 구현하지 않습니다. `/build auto`의 한 번 승인으로 계획하고 구현하는 과정과 `/ship`의 병렬 페르소나 팬아웃이 그 예입니다. 그것을 Copilot에서 재현하는 일은 별도 작업이며, 파일 하나짜리 별칭이 감당하지 않습니다. 기본값은 스킬 이름으로 두고, 짧은 형태가 파일 하나를 더 둘 가치가 있을 때만 별칭을 쓰세요.

기존 파일을 덮어쓰지 않고 하나 만드세요.

```bash
mkdir -p .github/prompts
[ -e .github/prompts/spec.prompt.md ] || cat > .github/prompts/spec.prompt.md <<'EOF'
---
description: Write a structured spec before writing code
---

Use the spec-driven-development skill.

Ask clarifying questions about the objective and target users, core features and
acceptance criteria, stack preferences and constraints, and known boundaries.
Then write a spec covering objective, commands, project structure, code style,
testing strategy, and boundaries. Save it as SPEC.md in the project root and
confirm with me before any code is written.
EOF
```

창을 다시 불러온 다음 `/spec`을 입력하세요.

나머지는 같은 `mkdir`/`cat` 블록에서 파일 이름만 바꿔 실행하세요. 파일 이름이 곧 커맨드 이름입니다. `description`과 본문은 이 표에서 가져오세요. **`---` 프론트매터 아래의 본문 전체를 바꾸세요.** 스킬 이름만 바꾸면 안 됩니다. 스펙 본문의 SPEC.md와 명확화 질문 지시는 정의 (Define) 단계에만 해당하며, 그대로 두면 `/plan`이나 `/test`가 스펙을 작성하게 됩니다.

| 별칭 파일 | `description` | 본문 전체. 프론트매터 아래의 모든 내용 |
|------------|---------------|--------------------------------------------------|
| `.github/prompts/plan.prompt.md` | 승인된 스펙을 순서가 있는, 검증 가능한 작업으로 나눕니다 | `planning-and-task-breakdown` 스킬을 사용하세요. 스펙을 읽은 다음, 작업을 작고 독립적으로 검증 가능한 작업으로 나누세요. 각 작업에는 인수 기준과 명시적인 의존 순서가 있어야 합니다. 결과를 `tasks/plan.md`와 `tasks/todo.md`에 저장하세요. 제품 코드는 작성하지 마세요. 계획을 보여 주고 승인을 기다리세요. |
| `.github/prompts/build.prompt.md` | 계획된 다음 작업을 테스트 우선으로 구현합니다 | `incremental-implementation`과 `test-driven-development` 스킬을 사용하세요. `tasks/plan.md`와 `tasks/todo.md`를 읽은 다음, 아직 체크되지 않은 다음 작업 하나만 수행하세요. 실패하는 테스트를 먼저 작성하고, 통과시킨 뒤, 리팩터하고, 테스트 스위트를 실행하고, 해당 작업을 체크하세요. 거기서 멈추고 무엇이 바뀌었는지 보고하세요. |
| `.github/prompts/test.prompt.md` | 그 테스트를 만족하는 코드를 작성하기 전에 테스트를 작성합니다 | `test-driven-development` 스킬을 사용하세요. 새로운 동작이라면, 구현을 작성하기 전에 그 동작을 포착하는 실패하는 테스트를 작성하세요. 버그라면, 실패하는 테스트로 먼저 재현한 다음 수정하세요. 각 단계 후에 테스트 스위트를 실행하고, 빨간 출력과 초록 출력을 보여 주세요. |

`.claude/commands/*.md`를 그대로 복사하지 마세요. 본문은 직접 쓰거나 이 표에서 가져오세요. 그 파일들은 스킬을 `agent-skills:<name>`으로 참조하는데, 이것은 Copilot에는 의미가 없는 Claude Code 플러그인 네임스페이스입니다.

### 스킬 슬래시 커맨드가 보이지 않을 때

먼저 예상된 경우인지 확인하세요. 없는 커맨드가 짧은 라이프사이클 래퍼(`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`)뿐이라면 문제는 없습니다. 이들은 Claude Code 커맨드이며 Copilot에는 나타나지 않습니다(맨 위의 참고를 보세요). 아래 단계는 `/spec-driven-development`처럼 스킬 자신의 이름까지 없을 때 씁니다.

아래를 순서대로 확인하세요. `/spec-driven-development`가 없는 경우와 `/spec`이 없는 경우는 원인이 다릅니다.

1. **스킬이 어디에 설치되었는지 확인하세요.** 각 스킬에는 `SKILL.md`가 들어 있는 자체 디렉터리가 필요합니다. 이 가이드가 쓰는 프로젝트 수준 경로는 `.github/skills/`, `.claude/skills/`, `.agents/skills/`입니다. 전역/사용자 플래그로 설치 도구를 실행하면 워크스페이스 밖(`~/.agents/skills/` 등)에 기록되므로, 세 경로 중 어디에도 없는 스킬은 개인 범위로 설치되었을 수 있습니다. 실제 경로는 [VS Code 에이전트 스킬 문서](https://code.visualstudio.com/docs/agent-customization/agent-skills)와 대조한 뒤, 프로젝트 범위로 두고 싶었다면 프로젝트에 다시 설치하세요.
2. **프론트매터를 확인하세요.** `name`이 있고 유효해야 합니다. 그 값이 곧 슬래시 커맨드입니다. 프론트매터에서 사용자 호출을 끈 스킬은 나타나지 않습니다.
3. **Configure Skills 메뉴를 확인하세요.** `/skills`를 실행하고 해당 스킬이 여기서 켜져 있는지 확인하세요.
4. **새 세션을 시작하세요.** 새로 추가한 스킬이 대화 도중에 항상 반영되지는 않습니다.
5. **호스트를 확인하세요.** `/spec-driven-development`는 되는데 `/spec` 별칭이 안 되면, 프롬프트 파일을 읽지 않는 Agent Host를 쓰고 있을 가능성이 큽니다.
6. **버전을 확인하세요.** VS Code(**Help → About**)와 Copilot Chat 확장을 확인하세요. 스킬을 슬래시 커맨드로 쓰는 기능은 최근 기능이므로, 둘 중 하나라도 뒤처져 있으면 업데이트하세요.

## 사용 팁

1. **지시문은 간결하게 유지하세요.** Copilot 지시문은 초점이 분명할 때 가장 잘 동작합니다. 스킬 파일 전체를 넣기보다 핵심 규칙을 요약하세요.
2. **리뷰에는 에이전트를 사용하세요.** `code-reviewer`, `test-engineer`, `security-auditor` 에이전트는 Copilot의 에이전트 모델에 맞춰져 있습니다.
3. **채팅에서 참조하세요.** 특정 단계를 작업할 때는 관련 스킬 내용을 Copilot Chat에 붙여 넣어 컨텍스트로 쓰세요.
4. **풀 리퀘스트 리뷰와 함께 쓰세요.** `code-reviewer` 에이전트 페르소나로 풀 리퀘스트를 리뷰하도록 Copilot을 설정하세요.
