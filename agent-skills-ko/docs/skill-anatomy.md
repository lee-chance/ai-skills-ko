# 스킬 구조

이 문서는 agent-skills 스킬 파일의 구조와 형식을 설명합니다. 새 스킬을 기여하거나 기존 스킬을 이해할 때 가이드로 사용하세요.

## 파일 위치

모든 스킬은 `skills/` 아래 자기 디렉터리에 있습니다.

```
skills/
  skill-name/
    SKILL.md           # Required: The skill definition
    scripts/           # Optional: Runnable helpers used by the skill workflow
    references/        # Optional: Skill-specific reference documentation
    supporting-file.md # Optional: Reference material loaded on demand
```

`SKILL.md`만 필수입니다. `scripts/`나 `references/`는 스킬이 실제로 필요할 때만 추가하고, 더 단순한 스킬에서는 아예 두지 마세요.

## SKILL.md 형식

### 프론트매터 (필수)

```yaml
---
name: skill-name-with-hyphens
description: Guides agents through [task/workflow]. Use when [specific trigger conditions].
---
```

**규칙:**

- `name`: 소문자, 하이픈으로 구분합니다. 디렉터리 이름과 일치해야 합니다.
- `description`: 스킬이 하는 일을 3인칭으로 시작하고, 명확한 "Use when" 트리거 조건을 하나 이상 넣으세요. *무엇*과 *언제*를 모두 포함합니다. 최대 1024자입니다.
- 최상위 키는 [Agent Skills 스펙](https://agentskills.io) 필드로 제한됩니다. `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`입니다. `model`, `tools`, `max_turns`, `context` 같은 벤더 또는 런타임 제어는 `metadata` 아래나 에이전트별 어댑터 파일에 둡니다. [docs/advanced-per-agent-configuration.md](advanced-per-agent-configuration.md)를 보세요. 검증기는 그 외의 최상위 키를 거부합니다.

게시된 이름은 호환 식별자입니다. 특히
`browser-testing-with-devtools`는 다른 스킬이 직접 참조하므로 안정적인 업스트림
이름입니다. 다운스트림 카탈로그가 이름을 바꿀 수는 있지만, 별칭이나 마이그레이션
매핑은 그 카탈로그가 소유합니다. 다운스트림 전용 별칭은 이 저장소에서 유지하지
않습니다.

**이것이 중요한 이유:** 에이전트는 description을 읽어 스킬을 발견합니다. description은 시스템 프롬프트에 주입되므로, 스킬이 제공하는 것과 언제 활성화할지를 모두 알려야 합니다. 워크플로우를 요약하지 마세요. description에 프로세스 단계가 들어 있으면, 에이전트는 스킬 전문을 읽지 않고 요약을 따를 수 있습니다.

### 표준 섹션 (권장 패턴)

위의 프론트매터 계약은 필수입니다. 아래 섹션 배치는 경직된 템플릿이 아니라 권장 패턴입니다. 같은 목적을 분명하게 수행한다면 동등한 제목도 허용됩니다.

```markdown
# Skill Title

## Overview
One-two sentences explaining what this skill does and why it matters.

## When to Use
- Bullet list of triggering conditions (symptoms, task types)
- When NOT to use (exclusions)

## [Core Process / The Workflow / Steps]
The main workflow, broken into numbered steps or phases.
Include code examples where they help.
Use flowcharts (ASCII) where decision points exist.

## [Specific Techniques / Patterns]
Detailed guidance for specific scenarios.
Code examples, templates, configuration.

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| Excuse agents use to skip steps | Why the excuse is wrong |

## Red Flags
- Behavioral patterns indicating the skill is being violated
- Things to watch for during review

## Verification
After completing the skill's process, confirm:
- [ ] Checklist of exit criteria
- [ ] Evidence requirements
```

## 섹션의 목적

### 개요 (Overview)

스킬의 짧은 소개입니다. 이것에 답해야 합니다. 이 스킬은 무엇을 하고, 에이전트는 왜 따라야 하나요?

### 언제 사용하나 (When to Use)

에이전트와 사람이 이 스킬이 현재 작업에 적용되는지 판단하도록 돕습니다. 긍정적 트리거("Use when X", X일 때 사용)와 부정적 제외("NOT for Y", Y에는 해당 없음)를 모두 넣으세요.

### 핵심 프로세스 (Core Process)

스킬의 심장입니다. 에이전트가 따르는 단계별 워크플로우입니다. 모호한 조언이 아니라, 구체적이고 실행 가능해야 합니다.

**좋은 예:** "`npm test`를 실행하고 모든 테스트가 통과하는지 확인하세요"
**나쁜 예:** "테스트가 동작하는지만 확인하세요"

### 흔한 합리화 (Common Rationalizations)

잘 만든 스킬의 가장 두드러진 특징입니다. 에이전트가 중요한 단계를 건너뛰려고 쓰는 변명과, 그에 대한 반론을 짝으로 둡니다. 에이전트가 프로세스를 따르지 않아도 된다고 합리화하는 것을 막습니다.

에이전트가 "I'll add tests later"(테스트는 나중에 추가할게요) 또는 "This is simple enough to skip the spec"(이건 단순해서 스펙은 건너뛰어도 됩니다)라고 말한 때를 떠올려 보세요. 그런 말은 사실적 반론과 함께 여기에 들어갑니다.

### 레드 플래그 (Red Flags)

스킬이 위반되고 있다는 관찰 가능한 신호입니다. 코드 리뷰와 자기 점검에 유용합니다.

### 검증 (Verification)

종료 기준입니다. 에이전트가 스킬 프로세스가 끝났는지 확인하는 체크리스트입니다. 모든 확인란은 증거(테스트 출력, 빌드 결과, 스크린샷 등)로 검증할 수 있어야 합니다.

## 보조 파일

보조 파일은 다음일 때만 만드세요.

- 참조 자료가 100줄을 넘을 때 (본 `SKILL.md`는 집중된 상태로 유지)
- 코드 도구나 스크립트가 필요할 때
- 체크리스트가 별도 파일을 정당화할 만큼 길 때

패턴과 원칙이 50줄 미만이면 본문에 두세요.

스킬에 실행 가능한 도우미가 필요 없으면, 다른 스킬을 흉내 내려고 빈 `scripts/` 디렉터리를 만들지 마세요. 빈 디렉터리는 스킬 동작은 바꾸지 않은 채 잡음만 더합니다.

<a id="shared-references"></a>

## 공유 참조

둘 이상의 스킬이 쓰는 체크리스트(테스트, 보안, 성능, 접근성, 완료 정의)는 저장소 루트의 `references/`에 있습니다. 일부러 어떤 스킬 디렉터리 *안에도* 두지 않습니다.

이것은 팩 수준의 설계 선택입니다. Agent Skills 스펙은 스킬을 자체 완결 디렉터리로 설명하지만, 여기의 여러 스킬은 같은 체크리스트를 가리킵니다. 그것들을 스킬 옆에 두면 둘 중 하나가 됩니다. 체크리스트를 쓰는 모든 스킬에 복사하거나, 한 스킬이 그것을 "소유"하고 나머지가 그 디렉터리를 들여다보게 하거나입니다. 둘 다 시간이 지나면 어긋납니다. 저장소 루트의 사본 하나가 기준 원본으로 남습니다.

대가는 이식성입니다. 저장소 전체 설치(Claude Code 마켓플레이스 플러그인 등)는 `references/`를 함께 가져가지만, `skills/<name>/`만 복사하는 스킬별 설치는 저장소 루트의 형제 디렉터리를 남겨 두고, 그 링크는 아무것도 가리키지 않습니다. 그 공백은 [#361](https://github.com/addyosmani/agent-skills/issues/361)에서 추적합니다.

현재 관례: 정확히 하나의 스킬만 쓰는 자료는 그 스킬 디렉터리 안의 보조 파일이고, 스킬들이 공유하는 자료는 `references/`에 둡니다.

## 컨텍스트 효율

스킬은 필요할 때 로드됩니다. 시작 시 컨텍스트에 있는 것은 스킬 이름과 description뿐입니다. 전체 `SKILL.md`는 에이전트가 그 스킬이 관련 있다고 판단할 때만 로드됩니다. 그 로드를 가볍게 유지하려면 다음을 지키세요.

- **`SKILL.md`를 500줄 미만으로 유지하세요.** 자세한 참조 자료는 보조 파일로 옮기세요.
- **구체적인 description을 쓰세요.** 정확한 description은 에이전트가 맞는 순간에 스킬을 활성화하고, 그렇지 않을 때는 건너뛰게 합니다.
- **점진적 공개를 사용하세요.** 워크플로우가 거기까지 도달했을 때만 읽는 보조 파일을 참조하세요.
- **인라인 코드보다 스크립트를 선호하세요.** 스크립트를 실행하면 컨텍스트를 쓰지 않고, 출력만 씁니다. 인라인 코드 블록은 로드할 때마다 비용을 냅니다.
- **파일 참조는 한 단계만 두세요.** 중간 문서를 거치지 말고 `SKILL.md`에서 보조 파일로 직접 링크하세요.

## 스크립트 요구사항

스킬이 `scripts/` 아래에 실행 가능한 도우미를 함께 내보내면, 각 스크립트는 다음 관례를 따릅니다.

- `#!/bin/bash` 셔뱅을 사용하세요.
- 실패 시 즉시 중단하려면 `set -e`를 사용하세요.
- 상태 메시지는 stderr로 쓰세요. `echo "Message" >&2`
- 기계가 읽을 출력(JSON)은 stdout으로 쓰세요.
- 임시 파일용 정리 trap을 넣으세요.
- 스크립트 경로는 `skills/<skill-name>/scripts/<script>.sh`로 참조하세요(저장소 기준 상대 경로).

## 작성 원칙

1. **지식보다 프로세스.** 스킬은 참조 문서가 아니라 워크플로우입니다. 사실이 아니라 단계입니다.
2. **일반론보다 구체성.** "`npm test`를 실행하세요"가 "테스트를 검증하세요"보다 낫습니다.
3. **가정보다 증거.** 모든 검증 확인란에는 증거가 필요합니다.
4. **합리화 방지.** 건너뛰고 싶어지는 단계마다 합리화 표에 반론이 필요합니다.
5. **점진적 공개.** 본 `SKILL.md`가 진입점입니다. 보조 파일은 필요할 때만 로드됩니다.
6. **토큰을 의식하세요.** 모든 섹션은 포함될 이유를 대야 합니다. 빼도 에이전트 동작이 바뀌지 않으면 빼세요.
7. **모델 중립.** 우회책이 아니라 절차를 쓰세요. [절차를 쓰고, 우회책은 쓰지 마세요](#write-the-procedure-not-the-workaround)를 보세요.

<a id="write-the-procedure-not-the-workaround"></a>

## 절차를 쓰고, 우회책은 쓰지 마세요

이 팩의 스킬은 많은 에이전트와 모델 세대에서 실행됩니다. 특정 모델이 특정 호출을 잘못해서 존재하는 단계는, 다른 모든 모델에서 부채입니다. 작업을 직접 풀었을 에이전트를 제약하고, 더 강한 모델이 실제 작업에 써야 할 턴을 씁니다. 모델 간 전이 측정([WikiSkill, arXiv:2608.27454](https://arxiv.org/abs/2608.27454))에 따르면, 한 모델의 실행 실패에 맞춰 작성한 스킬은 더 강한 모델이 *스킬이 전혀 없을 때보다 더 나쁘게* 동작하게 할 수 있습니다.

**규칙:** 모델, 모델 버전, 또는 한 에이전트의 비공개 도구 이름을 지칭하지 않고는 정당화할 수 없는 단계는 스킬이 아니라 이슈에 속합니다. 한 런타임이 우연히 노출하는 메커니즘(`run_command`, `write_to_file`)이 아니라, 능력("run the focused test command"(집중된 테스트 명령을 실행), "write the file"(파일을 작성))을 설명하세요.

스킬 내용을 제안하기 전에 확인할 냄새 두 가지입니다.

- **지나치게 구체적인 메커니즘.** 목표만 말해도 될 자리에서 정확한 명령 형식이나 직렬화 세부 사항을 처방합니다. 근거가 "model X gets this wrong otherwise"(그렇지 않으면 모델 X가 이걸 틀립니다)라면, 절차가 아니라 우회책입니다.
- **잘게 나뉜 진단.** 한 단계로 같은 것을 확인할 수 있는데 여러 단계의 검사 순서를 둡니다. 단계가 늘 때마다 턴을 쓰고, 턴 예산은 유한합니다.

이것은 스킬 *내용*에 대한 이야기입니다. `references/` *경로*의 이식성은 별도 문제입니다([공유 참조](#shared-references)를 보세요).

## 이름 규칙

- 스킬 디렉터리: `lowercase-hyphen-separated`
- 스킬 파일: `SKILL.md` (항상 대문자)
- 보조 파일: `lowercase-hyphen-separated.md`
- 공유 참조: 스킬 디렉터리 안이 아니라 루트 `references/` 디렉터리에 둡니다(이유는 [공유 참조](#shared-references)를 보세요).
- 스킬별 참조: 보조 문서 하나는 스킬 디렉터리에 파일 하나로 둘 수 있습니다(위의 보조 파일 항목). 관련된 문서 여러 개가 스킬과 함께 움직일 때는, 자체 완결적이고 배포 가능한 스킬을 위한 떠오르는 관례로 스킬 디렉터리 안의 `references/`에 묶습니다. 그러면 스킬이 자기 보조 문서를 함께 가져갑니다.

## 스킬 간 참조

다른 스킬은 이름으로 참조하세요.

```markdown
Follow the `test-driven-development` skill for writing tests.
If the build breaks, use the `debugging-and-error-recovery` skill.
```

스킬 사이에 내용을 복제하지 마세요. 참조하고 링크하세요.

## 필수와 권장

필수:

- `skills/<skill-name>/SKILL.md` 파일
- `name`과 `description`이 있는 유효한 YAML 프론트매터
- 스킬이 하는 일과 언제 사용하는지를 모두 담은 description

권장:

- 위에 나온 표준 섹션 흐름
- 스킬에서 더 자연스럽게 읽힐 때의 `How It Works`, `Core Process`, `Workflow` 같은 동등한 제목
- 본 `SKILL.md`를 집중된 상태로 유지할 때만 두는 보조 파일
