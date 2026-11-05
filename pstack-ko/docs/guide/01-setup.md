# pstack 설정하기

이 페이지에서는 플러그인을 설치하고, pstack이 사용할 모델을 선택하고, 첫 번째 작업을 실행합니다. 설정은 하나의 명령과 짧은 대화입니다.

## 플러그인 설치

Cursor 채팅에서 실행:

```text
/add-plugin pstack
```

Cursor가 플러그인이 설치되었음을 확인합니다.

Claude Code에서는 `/plugin marketplace add cursor/plugins`를 실행한 다음 `/plugin install pstack@cursor-plugins`를 실행하세요. Claude Code는 플러그인 명령에 접두사를 붙이므로, 이 가이드의 각 명령은 거기서 `/pstack:setup-pstack`처럼 `pstack:` 접두사를 취하며, 이는 모델 규칙을 `~/.claude/rules/pstack-models.md`에 작성합니다. [Claude Code 어댑터](../harness/claude-code.md)가 다른 차이점을 다룹니다.

## 모델 선택

실행:

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md)은 액세스할 수 있는 모델을 감지하고, 추론 예산을 묻고, 각 역할(코드 위임자, 판단, 리뷰 패널)을 보여주고, 원하는 것을 묻습니다. 질문에 답하세요. `~/.cursor/rules/pstack-models.mdc`를 작성하며, 이는 모든 pstack 스킬이 읽는 작은 규칙입니다.

기본값은 `xhigh` 추론으로 실행되며, 이는 `large` 예산과 동일합니다. `unlimited`는 각 모델을 `max`까지 최고 티어로 올립니다. Opus는 `max`로 갑니다. Grok은 `xhigh`에서 최고이므로 거기에 머뭅니다. `medium`과 `small`은 추론을 낮추고 더 적은 토큰을 소비합니다.

신경 쓰는 것만 오버라이드하면 됩니다. 규칙에 라인이 없는 역할은 스킬의 기본값을 유지합니다. 기본값을 복원하려면 해당 역할의 라인을 삭제하세요. `/setup-pstack`을 재실행하면 모델이 기본값과 다른 역할을 유지합니다. 기본값이 변경되면, 변경 전에 작성된 규칙은 여전히 이전 기본값을 고정하므로, 해당 역할 라인을 삭제하거나 파일을 삭제한 다음 `/setup-pstack`을 다시 실행하세요.

Auto를 사용하면 어떻게 되는지 궁금할 수 있습니다. 역할을 `inherit-parent` 또는 `auto`로 설정하면 pstack은 서브에이전트 `model` 필드를 생략하므로 서브에이전트가 부모 채팅 모델을 상속합니다. 두 값은 동일한 의미이며, 둘 다 모델 슬러그가 아닙니다. 패널 역할의 경우 값은 리스트이며, 항목당 하나의 서브에이전트가 실행되므로 리스트 길이가 패널 크기를 설정합니다. 설정은 또한 `swarm workers`를 구성하며, 이는 레이스가 각 암(arm)에 대한 모델을 명명하지 않는 한 모든 `/swarm` 워커의 기본 모델입니다.

## 검증 제안을 수락하거나, 거부하세요

설정 마지막에 `/setup-pstack`은 프로젝트에서 앱 동작을 증명하는 방법을 찾습니다. `verify-*` 스킬이나 기존 하네스를 찾습니다. 둘 다 찾지 못하면, [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md)로 하나를 생성할 것을 한 번 제안합니다.

예라고 말하면 `.cursor/skills/verify-<app>/`를 작성하며, 이는 에이전트에게 사용자가 하는 방식으로 앱을 구동하는 방법을 가르치는 프로젝트 로컬 스킬입니다. 전달하기 전에 스킬이 작동함을 한 번 증명합니다. 아니오라고 말하면 설정이 계속 진행됩니다. 언제든지 직접 `/create-verification-skill`을 실행할 수 있습니다. [검증 및 배포](./06-verify-and-ship.md#create-a-project-verification-skill)에서 깊이 다룹니다.

pstack이 처음이라면, 예라고 말하세요. 자신의 작업을 확인할 수 있는 에이전트는 체크가 통과할 때까지 계속 진행합니다. 할 수 없는 에이전트는 모든 결과를 손으로 확인하도록 당신에게 돌려줍니다. 이 가이드의 모든 것 중에서, 검증 스킬이 가장 큰 보상을 제공합니다.

그런 다음 설정은 프로젝트에 이미 하나가 없는 한 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md)로 공식 검증 스킬을 생성할 것을 한 번 제안합니다. 테스트는 누군가가 작성하기로 생각한 케이스를 확인합니다. 공식 검증 스킬은 명시된 범위 내의 모든 케이스에서 "작업이 동시에 두 번 실행되지 않는다"와 같은 코드의 하나의 핵심 속성을 확인합니다. 코드에 동시성, 재시도, 상태 머신 또는 파서가 있고, 버그가 비용이 많이 들고 테스트가 깨지는 케이스에 거의 도달하지 못할 때 예라고 말하세요. 그렇지 않으면 아니오라고 말하고, 그것이 변경되면 나중에 실행하세요. [검증 및 배포](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill)에서 다룹니다.

설정 후 새 채팅을 시작하세요. 모델 규칙은 새 세션에 적용됩니다.

## 비용 관리

pstack은 서브에이전트와 리뷰 패널에 추가 토큰을 소비합니다. 그것이 엄격함의 대가입니다. 더 적게 소비하려면:

- `/setup-pstack`을 재실행하고 더 작은 추론 예산이나 더 저렴한 모델을 선택하세요. 메인 채팅에 강력한 모델을 사용하고 코드 역할에 더 저렴하고 빠른 모델을 사용하는 것이 좋은 분할입니다.
- 역할을 `auto` 또는 `inherit-parent`로 설정하여 채팅 자체 모델에서 실행되도록 하세요.
- 패널 리스트를 줄이세요. 각 항목은 하나의 서브에이전트를 실행합니다.
- 엄격함이 필요한 작업에 `/poteto-mode`를 저장하세요. 작고 명백한 편집은 필요하지 않습니다.

## 첫 번째 작업 실행

실제이지만 작은 것을 선택하고, 동료에게 설명하는 방식으로 설명하세요:

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

todo 리스트를 관찰하세요. 첫 번째 항목은 복사된 매칭된 플레이북의 단계이며, 이 프롬프트의 경우 Feature 플레이북입니다. `/poteto-mode`가 단계를 건너뛰면, 단계는 `skip: <reason>`과 함께 리스트에 남아있으므로, 무엇을 하지 않기로 선택했는지 볼 수 있습니다.

여기에서 일반 후속 조치를 입력할 수 있습니다. 전체 채팅에 대해 `/poteto-mode`를 유지하려면, Enter 대신 Option+Enter(Mac) 또는 Alt+Enter(Windows)로 `/` 메뉴에서 선택하세요. 그러면 [커스텀 모드](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)가 되어, 종료할 때까지 매 턴마다 컨텍스트에 유지됩니다. 커스텀 모드는 에이전트 창과 CLI에서 사용할 수 있습니다. 일반 Enter는 스킬을 하나의 메시지에 첨부하고, 채팅이 진행되면서 희미해집니다.

다음: [`/poteto-mode`를 통한 작업 라우팅](./02-poteto-mode.md).
