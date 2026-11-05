---
name: setup-pstack
description: 역할당 pstack이 사용하는 모델과 어떤 추론 예산으로 구성하세요. 사용 가능한 모델을 감지하고 스킬 기본값을 재정의하는 항상 적용되는 규칙을 작성합니다. /setup-pstack, "configure pstack models", "pstack budget", 또는 pstack의 모델 선택 변경에 사용하세요.
---

# Setup pstack

항상 적용되는 규칙인 `~/.cursor/rules/pstack-models.mdc`를 작성하여 역할당 pstack의 모델을 설정하세요.

## 단계

### 1. 사용 가능한 모델 감지

이 세션에서 `Task` 서브에이전트에 전달할 수 있는 모델 슬러그를 열거하세요. 그것이 신뢰할 수 있는 소스입니다. Cursor가 사용자의 권한이 있는 모델을 나열하는 모델 API 또는 CLI도 노출한다면 완전성을 위해 그것을 선호하세요. 감지할 수 없으면 사용자에게 접근할 수 있는 슬러그를 붙여넣으라고 요청하세요. 사용 가능하다고 확인하지 않은 실제 슬러그를 절대 작성하지 마세요. 별칭 `inherit-parent`와 `auto`는 감지된 슬러그가 아니더라도 항상 유효합니다.

### 2. 현재 상태 로드

기본 역할 대 모델 매핑은 아래 5단계에 표시된 규칙 형태입니다. `~/.cursor/rules/pstack-models.mdc`가 이미 존재하면 읽고 `# budget` 라인과 역할 값을 현재 선택으로 취급하세요. 그렇지 않으면 해당 기본값에서 시작하세요. `how critics`와 같이 5단계에 없는 역할의 라인은 은퇴한 역할에서 나온 것입니다. 삭제하세요.

### 3. 예산, 맵, 확인

**(a) 예산을 요청하세요.** 자유 텍스트보다 AskQuestion을 선호하세요. 이 정확한 레이블로 이 네 가지 옵션을 제공하고, 규칙이 하나를 기록할 때 현재 예산을 명명하세요. 규칙이 없으면 `large`가 스킬 기본값과 일치한다고 말하세요.

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 적용하세요.** 스킬 기본값에서 작업 테이블을 빌드하고, 재실행 시 패밀리, 목록 또는 별칭 (`inherit-parent`, `auto`)으로 변경한 모든 역할을 유지하세요. `unlimited`, `large`, `medium`, `small`은 패널 항목을 포함하여 모든 실제 슬러그의 effort 토큰을 `max`, `xhigh`, `high` 또는 `medium`으로 설정합니다. effort 토큰은 마지막 토큰이거나, 래더 `max` > `xhigh` > `high` > `medium` > `low`에서 후행 `fast` 전의 토큰입니다. 결과가 감지된 슬러그가 아니면 대상 이하에서 가장 높은 effort를 가진 동일한 패밀리의 감지된 슬러그를 사용하고, 그렇지 않으면 역할을 선택이 필요한 것으로 표시하세요. `inherit-parent`와 `auto`는 변경되지 않습니다. 따라서 `unlimited`는 `claude-opus-5-5-xhigh`를 `claude-opus-5-5-max`로 전환합니다. Grok 슬러그는 `xhigh`에서 최고점이므로 `unlimited` 아래에서 폴백이 Grok를 `xhigh`에 놓고 `grok-4.7-xhigh-fast`를 그대로 유지합니다. `large`는 두 기본값을 모두 유지합니다. `small`은 그것들을 `claude-opus-5-5-medium`과 `grok-4.7-medium-fast`로 전환합니다.

**(c) 역할을 보여주고 확인하세요.** 모든 역할을 모델과 함께 보여주고, 감지된 세트에 없는 모든 실제 슬러그를 선택이 필요한 것으로 표시하세요. 2단계가 삭제한 각 라인도 나열하세요. 그대로 수락할지 특정 역할을 변경할지 물어보고, 감지된 모델과 `inherit-parent` 및 `auto` (둘 다 의미: 이 역할은 부모 채팅 모델로 실행되며, Auto 사용자가 Auto에 머물러 있는 방식입니다)를 옵션으로 제공하세요. 자유 텍스트보다 AskQuestion을 선호하세요. 패널 역할 (arena runners, architect runners, interrogate reviewers)의 경우 값은 목록이며, 별칭 항목을 포함하여 항목당 하나의 서브에이전트가 실행되므로 목록 길이가 카운트를 설정합니다. `arena cross-judge pool`도 목록이지만 Arena는 하나의 판정자를 실행합니다. 부모의 패밀리가 아닌 패밀리의 값만 목록 순서대로 시도하므로 선호도에 따라 정렬하세요. `inherit-parent` 또는 `auto` 값은 절대 판정하지 않습니다. `swarm workers`는 레이스 또는 비교가 팔당 다른 모델을 할당하지 않는 한 모든 워커의 기본 모델입니다.

### 4. 검증

작성된 모든 실제 슬러그는 감지된 세트에 있어야 합니다. `inherit-parent`와 `auto`는 항상 통과합니다. 선택한 실제 슬러그를 사용할 수 없으면 멈추고 다시 물어보세요.

### 5. 규칙 작성

`alwaysApply: true`, 선택한 레이블과 대상 effort가 있는 `# budget` 라인, poteto-mode가 사용하는 것과 동일한 레이블을 사용하는 역할당 한 줄로 `~/.cursor/rules/pstack-models.mdc`를 작성하세요. 재실행이 멱등하게 유지되도록 전체 파일을 덮어쓰세요. 형태:

```
---
description: pstack 역할별 모델 선택 (스킬 기본값 재정의)
alwaysApply: true
---
# pstack 모델 구성. 역할당 한 줄. 스킬 기본값으로 폴백하려면 라인을 삭제하세요.
# 값으로 `inherit-parent` 또는 `auto`: 역할이 부모 채팅 모델로 실행됩니다 (Task `model` 생략). 패널 목록의 별칭 항목은 여전히 팬 아웃에 계산됩니다.
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### 6. 확인

사용자에게 규칙이 작성되었고 새 세션에 적용된다고 말하세요. 이 스킬을 다시 실행하면 업데이트됩니다.

### 7. 검증 스킬 제공 (선택 사항)

프로젝트에 증명을 위해 실제 앱을 구동하는 방법 (`verify-*` 스킬 또는 기존 하니스)이 있는지 확인하세요. 없으면 한 번 제안하세요: "에이전트가 사용자가 하는 방식으로 앱을 구동하고 변경이 작동함을 증명할 수 있도록 프로젝트 로컬 검증 스킬을 원하십니까? /create-verification-skill로 하나를 생성할 수 있습니다." yes에 `/create-verification-skill`을 호출하세요 (pstack이 설치된 곳에서 resolve: 워크스페이스, 사용자 또는 플러그인). no에 추진하지 않고 진행하세요.

### 8. 형식 검증 스킬 제공 (선택 사항)

프로젝트에 이미 형식 검증 스킬 (코드에 대해 모델 체커, 증명 또는 다른 검증기를 실행하는 프로젝트 스킬)이 있는지 확인하세요. 없으면 한 번 제안하세요: "에이전트가 테스트가 도달하는 케이스뿐만 아니라 범위의 모든 케이스에서 코드의 핵심 속성이 유지됨을 증명할 수 있도록 형식 검증 스킬을 원하십니까? /create-formal-verification-skill로 하나를 생성할 수 있습니다." yes에 `/create-formal-verification-skill`을 호출하세요 (pstack이 설치된 곳에서 resolve: 워크스페이스, 사용자 또는 플러그인). no에 추진하지 않고 진행하세요.
