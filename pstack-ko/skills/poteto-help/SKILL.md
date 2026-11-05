---
name: poteto-help
description: 사용자를 pstack 설정, /poteto-mode, 작업에 대한 스킬, playbook 또는 원칙 선택으로 안내합니다. 질문과 함께 /poteto-help를 입력하세요.
disable-model-invocation: true
---

# Poteto help

pstack에 대한 사용자의 질문에 답하고, 보낼 수 있는 프롬프트를 제공하고, 답이 나온 파일을 링크하세요. 도움말 질문의 경우 작업을 시작하지 마세요. 사용자가 어떻게인지 물었고 pstack 실행은 실제 토큰을 소비하므로 프롬프트를 보내도록 하세요.

"use pstack to fix this bug"와 같이 작업을 요청하는 메시지는 도움말 질문이 아닙니다. [`poteto-mode`](../poteto-mode/SKILL.md)를 읽고, 그 아래에서 작업을 수행하고, Custom Mode가 그것을 유지한다고 한 번 언급하세요.

이 파일은 질문을 답을 보유한 스킬 및 가이드 페이지에 매핑합니다. 해당 파일이 세부 사항을 소유합니다. 인용하기 전에 라우팅하는 파일을 읽고, 이 맵과 다르면 그것을 신뢰하세요. 여기의 링크는 사용자가 열 수 없을 수 있는 설치된 플러그인을 가리키므로 사용자에게 파일의 공개 사본을 제공하세요: `https://github.com/cursor/plugins/blob/main/pstack/` 다음에 경로.

## 필요한 것 찾기

메시지와 대화에서 필요를 추론하세요. "which skill reviews a PR?"과 같이 명명된 상황은 해당 섹션으로 바로 갑니다. 필요가 여전히 불명확하면 이 옵션들로 하나의 다중 선택 질문을 한 다음 그들이 선택한 섹션만 답하세요:

- 설정하기
- `/poteto-mode`로 작업 시작하기
- 상황에 대한 스킬 선택
- 잘못된 실행 수정
- pstack을 내 것으로 만들기

답을 변경하는 상태를 확인하고, 그렇게 할 때만 언급하세요:

- `~/.cursor/rules/pstack-models.mdc`가 없다는 것은 이 사용자에 대해 `/setup-pstack`이 실행되지 않았음을 의미하므로 모든 역할이 기본 모델을 사용합니다.
- 프로젝트에 `verify-*` 스킬이나 다른 앱 하니스가 없다는 것은 에이전트에게 앱을 구동하는 스크립트 방법이 없음을 의미합니다. 질문이 변경이 작동함을 증명하는 것에 관한 것일 때 `/create-verification-skill`을 언급하세요.
- 프로젝트에 형식 검증 스킬이 없다는 것은 테스트가 도달하는 것을 넘어서 어떤 속성도 확인되지 않음을 의미합니다. 질문이 레이스, 불변성 또는 테스트가 거의 히트하지 않는 다른 케이스에 관한 것일 때 `/create-formal-verification-skill`을 언급하세요. 하나가 존재하고 커버하는 코드가 동기화와 마지막으로 기록된 커밋 후에 변경되었을 때, 질문이 해당 코드를 터치하면 `/maintain-formal-verification-skill`을 언급하세요.

모델 규칙이 누락되었고 중요할 때, 사용자가 각 역할에 대한 모델과 추론 예산을 지금 선택하기를 원하는지 물어보세요. 사용자가 새로 왔거나, 질문이 설정 또는 비용에 관한 것이거나, 답이 어떤 모델이 실행되는지에 따라 달라질 때 중요합니다. 채팅당 최대 한 번 물어보세요. 필요도 불명확하면 두 질문을 함께 물어보세요. 두 가지 선택을 제공하세요:

- 지금: 입력할 `/setup-pstack`을 제공하고, 질문에도 답하세요.
- 나중에: 질문에 답하고, 모든 역할이 `/setup-pstack`을 실행할 때까지 기본 모델을 유지한다고 한 줄 추가하세요.

## 설정하기

1. 채팅에서 `/add-plugin pstack`으로 설치하거나, 사이드바의 Customize에서 설치하세요.
2. [`/setup-pstack`](../setup-pstack/SKILL.md)를 실행하세요. 추론 예산을 요청하고, 각 역할에 모델을 매핑하고, 규칙을 작성합니다. 규칙은 새 채팅에 적용됩니다. 그런 다음 프로젝트가 이미 하나를 가지고 있지 않으면 프로젝트에 대한 검증 스킬과 형식 검증 스킬을 생성하도록 각각 한 번씩 제공합니다.
3. `/poteto-mode`, 목표, 통과하거나 실패할 수 있는 검사로 실제 작업을 시작하세요.

설치는 사용자가 스킬을 호출할 때까지 아무것도 변경하지 않습니다. `/setup-pstack`만 사용자의 말에서 로드합니다. [README](../../README.md)와 [가이드 페이지 1](../../docs/guide/01-setup.md)에 세부 사항이 있습니다. [`references/prompting.md`](references/prompting.md)에 따라 첫 번째 프롬프트를 함께 작성하도록 제안하세요.

비용이 걱정이라면 토큰이 어디로 가는지 그리고 어떻게 더 적게 쓸 수 있는지 말하세요. pstack은 서브에이전트와 리뷰 패널에 추가 토큰을 소비합니다. `/setup-pstack`을 다시 실행하고 더 작은 예산이나 더 저렴한 모델을 선택하세요. `auto` 또는 `inherit-parent`로 설정된 역할은 채팅의 모델로 실행되어 채팅이 Auto 또는 더 저렴한 모델로 실행될 때 토큰을 절약합니다. 더 짧은 패널 목록은 각 항목에 대해 하나씩 더 적은 서브에이전트를 실행합니다. 엄격성이 필요한 작업에 대해 `/poteto-mode`를 저장하세요.

pstack은 Cursor를 위해 빌드되었으며, `/plugin marketplace add cursor/plugins`, 그 다음 `/plugin install pstack@cursor-plugins`로 Claude Code에도 설치됩니다. 거기서 각 명령은 `/pstack:poteto-mode`와 같이 `pstack:` 접두사를 취합니다. [Claude Code 어댑터](../../docs/harness/claude-code.md)는 Cursor 이름을 매핑하고, Bugbot 또는 Automations와 같이 Cursor 전용 기능이 필요한 단계는 한 줄 노트와 함께 건너뜁니다.

다른 도구는 Agent Skills 형식을 사용하기 때문에 스킬을 읽을 수 있습니다. 그러나 `/poteto-mode`, `/how`, `/why`, `/teach`를 포함한 대부분의 워크플로우 스킬은 역할별 모델로 Cursor 서브에이전트를 생성하고, Custom Modes와 `/loop`는 Cursor 기능이므로 해당 부분은 거기서 작동하지 않을 수 있습니다.

## `/poteto-mode`로 작업 시작

`/poteto-mode`는 작업을 playbook에 일치시키고, playbook의 단계를 투두 리스트에 복사하고, 단계가 필요로 할 때 다른 스킬을 실행합니다. 건너뛰는 단계는 `skip: <reason>`으로 리스트에 남습니다. 좋은 프롬프트는 목표와 완료를 어떻게 말할 수 있는지를 명시합니다. 스킬을 나열하지 않습니다. 손으로 작성된 시퀀스는 playbook이 유지할 단계를 삭제하거나 재정렬하는 경향이 있기 때문입니다. 하나를 작성하는 데 도움을 주기 전에 [`references/prompting.md`](references/prompting.md)를 읽으세요. [가이드 페이지 2](../../docs/guide/02-poteto-mode.md)에 예제가 있습니다.

`/poteto-mode`가 계속 적용되는지 여부는 사용자가 시작하는 방법에 따라 다릅니다:

- `/poteto-mode`에서 Enter는 스킬을 하나의 메시지에 연결합니다. 채팅이 이동함에 따라 흐려집니다.
- Mac에서 Option+Enter 또는 Windows에서 Alt+Enter, 또는 스킬 항목에서 Use as Mode는 Custom Mode로 만듭니다. 사용자가 모드를 종료할 때까지 매 턴마다 컨텍스트에 남아 있으며, 캐주얼 턴에서는 벗어나 있습니다.
- Cursor의 문서는 Agents Window와 CLI에서 Custom Modes를 나열합니다. 다른 곳에서는 각 새 작업을 `/poteto-mode`로 시작하세요.

이것이 나타나면 [Cursor의 스킬 문서](https://cursor.com/docs/skills)를 링크하세요. 채팅 중간에 "new task"는 모드가 새로운 playbook과 일치하도록 합니다. `/poteto-mode`는 이미 playbook 단계가 생성하는 서브에이전트에 대해 `poteto-agent`를 사용합니다. 자신의 서브에이전트에서 동일한 스타일을 얻으려면 `subagent_type: "poteto-agent"`로 생성하세요.

## 스킬 선택

기본 답은 `/poteto-mode`이며, playbook 단계가 필요로 할 때 대부분의 다른 스킬을 실행합니다. playbook이 제공하는 것보다 무언가를 더 많이 또는 적게 원할 때 스킬을 직접 명명하세요. 추천하기 전에 스킬을 읽고, 하나의 예제 프롬프트를 제공하세요.

| 사용자가 원하는 것 | 스킬 |
|---|---|
| 엄격성으로 비자명한 작업 수행 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 에이전트가 시작하기 전에 목표와 문제를 이해했는지 확인 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 프롬프트를 더 크게가 아니라 더 깊게 다시 작성: 최고의 전문가가 추가할 것, 원자재와 방법, 외부 검사. 프롬프트를 반환하고 작업을 수행하지 않음 | [`/sharpen`](../sharpen/SKILL.md) |
| 코드가 지금 어떻게 작동하는지 알기, 또는 새 코드가 어디에 있어야 하는지 | [`/how`](../how/SKILL.md) |
| 코드가 왜 이렇게 형태를 갖췄는지 알기, 또는 숫자가 어디에서 왔는지 | [`/why`](../why/SKILL.md) |
| 변경 또는 하위 시스템을 평범하게 설명하여 이해하기 | [`/teach`](../teach/SKILL.md) |
| 주제에 대한 자신의 최근 작업을 따라잡기 | [`/recall`](../recall/SKILL.md) |
| 마지막 메시지 이후 이 채팅에서 변경된 내용을 평범한 단어와 작은 비주얼로 따라잡기, 그들을 기다리는 모든 항목을 나열하고 응답만으로 결정 가능하게 | [`/ketchup`](../ketchup/SKILL.md) |
| `/ketchup`처럼 따라잡기, 짧은 자막 슬라이드 비디오로, 대기 중인 호출을 그 아래 텍스트로 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 작은 diff가 자체 외부에서 무엇을 깨뜨릴 수 있는지 알기 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 함수 경계를 넘는 코드 전에 타입과 모듈 형태 정착 | [`/architect`](../architect/SKILL.md) |
| 하나의 브리프에 여러 번 시도하고, 가장 좋은 것으로 병합 | [`/arena`](../arena/SKILL.md) |
| 슬라이스에 대한 병렬 검사를 실행하거나, 워커를 경주시키기, 클라우드 에이전트로 | [`/swarm`](../swarm/SKILL.md) |
| 다른 모델이 diff를 검토하고 깨뜨리려고 시도하게 하기 | [`/interrogate`](../interrogate/SKILL.md) |
| 저렴한 로컬 테스트가 존재할 때 테스트 우선으로 버그 수정 | [`/tdd`](../tdd/SKILL.md) |
| `.ts` 또는 `.tsx` 작업에 TypeScript 규칙 적용 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 리뷰 전에 주석을 제거, 작성하지 않은 리뷰어 사용 | [`/no-comments`](../no-comments/SKILL.md) |
| 산문에서 AI 징후 정리 | [`/unslop`](../unslop/SKILL.md) |
| 문서, RFC, README, PR 설명 또는 커밋 메시지를 표준으로 작성 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 마지막 응답을 평범한 단어로 다시 듣기 | [`/bro`](../bro/SKILL.md) |
| 에이전트에게 앱을 구동하고 동작을 증명하는 스크립트 방법 제공 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 검증 스킬과 기능 맵을 앱과 다시 정렬 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 테스트가 거의 도달하지 않는 레이스, 불변성 또는 다른 속성을 형식적으로 검증 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 커버하는 코드가 변경된 후 형식 검증을 다시 정렬하고, 실패가 드리프트인지 버그인지 배우기 | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| PM 또는 디자이너에게 사용자가 보는 것을 TLA+ 모델로 확인한 차트로 보여주기, 규칙을 위반하는 각 상태로 가는 최단 경로와 함께 | [`/statechart`](../statechart/SKILL.md) |
| 보고하거나 조치하기 전에 성능 숫자 검증 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 크거나 교차하는 변경, 또는 떠난 후 검토할 변경 실행 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 실행 중 결정 로그 유지, 그 후 검토 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 각 역할에 대한 모델과 추론 예산 선택 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 자신의 작업 습관을 개인 모드 스킬로 전환 | [`/automate-me`](../automate-me/SKILL.md) |
| 완료된 작업이 가르친 것을 스킬 편집으로 전환 | [`/reflect`](../reflect/SKILL.md) |
| 에이전트가 이 저장소에서 동일한 실수를 반복하는 것을 중지 | [`/correct`](../correct/SKILL.md) |
| 버튼이 웹훅을 통해 Grok Bot을 깨우는 페이지 빌드 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| pstack에서 길 찾기 | `/poteto-help` |

이 옆에 있는 스킬 디렉토리가 테이블에서 누락되었다면 프론트매터를 읽고 설명으로 라우팅하세요. `principle-*` 디렉토리는 아래 원칙에서 다룹니다.

근접 호출:

- `/how`는 코드가 무엇을 하는지 설명합니다. `/why`는 이유를 설명합니다. `/teach`는 하나 또는 둘 다를 실행하고 결과를 평범하게 설명합니다.
- `/arena`는 모든 워커에게 동일한 브리프를 제공하고 가장 좋은 부분을 병합합니다. `/swarm`은 작업을 슬라이스 또는 경주로 분할하고 하나의 보고서를 반환합니다.
- `/architect`는 설계를 정착시킨 직후 구현합니다. 코드를 작성하기 전에 설계를 검토하려면 "with checkpoint"를 추가하세요.
- `/interrogate`는 diff를 검토합니다. `/blast-radius`는 diff 외부의 파손을 찾고 변경을 안전하게 만드는 하나의 사실을 증명합니다.
- `/recall`은 최근 채팅 전체에 걸쳐 컨텍스트를 재구축합니다. `/ketchup`은 사용자의 마지막 메시지 이후 이 채팅만 커버합니다. 하나의 특정 채팅 또는 브랜치를 재개하는 것은 Session pickup playbook입니다.
- `/figure-it-out`은 하나의 엄격한 실행을 설계합니다. Orchestrate playbook은 며칠과 많은 PR에 걸친 프로그램을 실행합니다. Autonomous run playbook은 하나의 작업을 완료 조건까지 구동합니다.

pstack에 없음:

- `/deslop`, `control-cli`, 그리고 `control-ui`는 `cursor-team-kit` 플러그인에 배송됩니다.
- `/loop`와 `/create-skill`은 Cursor 내장입니다.
- pstack에는 `/orchestrate` 스킬이 없습니다. Orchestrate는 `/poteto-mode` playbook입니다. 슬래시 메뉴가 `/orchestrate`를 표시하면 다른 플러그인이 그것을 제공합니다.

## Playbook과 원칙

Playbook은 `/poteto-mode` 내부의 단계 목록이지 스킬이 아니므로 슬래시 명령이 없습니다. `/poteto-mode` 내부에서 작업을 설명하면 하나를 선택하고, 이러한 문구는 하나를 직접 명명합니다:

- "babysit this pr" 또는 "check on pr 123"은 Babysit을 실행합니다. PR을 병합 준비까지 구동하고 거기서 멈춥니다. 사용자가 병합, 착륙 또는 배송을 요청하지 않는 한 병합하지 않습니다.
- "land the stack"은 Shipping을 실행합니다.
- "take over this branch"는 Session pickup을 실행합니다.
- "pause safely"는 Pause safely를 실행합니다.
- "full autopilot on this queue"는 Autopilot-full을 실행합니다. "autopilot, don't merge"는 Autopilot-stack을 실행합니다.
- "run the eval playbook"은 Eval을 실행합니다.

`/poteto-mode` 없이 "babysit this pr"과 같은 문구는 대신 동일한 작업에 대한 Cursor 자체 스킬을 시작할 수 있습니다. [`poteto-mode`](../poteto-mode/SKILL.md)의 Playbooks 섹션은 모든 playbook과 언제 적용되는지를 나열합니다. [가이드 페이지 6](../../docs/guide/06-verify-and-ship.md)은 PR 열기, 베이비싯, 착륙을 커버합니다.

pstack에는 계획 스킬이 없습니다. Cursor의 Plan Mode는 그것과 함께 작동합니다. 단계 또는 스택 PR에 걸친 작업의 경우 `/poteto-mode`에 계획을 요청하면 [Multi-phase plan playbook](../poteto-mode/playbooks/multi-phase-plan.md)을 실행하여 계획을 작성하고 구현하지 않습니다. 설계 질문의 경우 Prototype playbook 또는 `/architect`가 먼저 코드로 정착시킵니다.

원칙은 `/poteto-mode`가 읽고 응답에서 인용하는 하나의 규칙 스킬입니다. 사용자는 거의 하나를 호출하지 않습니다. 대신 "apply prove it works. show me the real output."에서처럼 이름으로 조종합니다. `/principle-<name>`을 입력하면 여전히 요청 시 하나를 로드합니다. [가이드 페이지 8](../../docs/guide/08-principles.md)은 그것들을 나열합니다.

## 잘못된 실행 수정

| 증상 | 수정 |
|---|---|
| 모드가 몇 턴 후에 적용을 중단 | Enter로 시작되었습니다. Custom Mode로 시작하거나, 각 작업을 `/poteto-mode`로 시작하세요. |
| 질문이 마지막 작업의 다음 단계로 취급됨 | "new task"라고 말하거나, 턴이 모드를 필요로 하지 않는다고 말하세요. |
| 새 모델 선택이 효과가 없음 | `/setup-pstack`의 규칙은 새 채팅에 적용됩니다. 하나를 시작하세요. |
| 실행이 예상보다 많은 비용 | Get set up에서 비용 단락을 참조하세요. |
| 스킬이 자체적으로 로드되지 않음 | `/setup-pstack`만 사용자의 말에서 로드합니다. 다른 것들은 사용자가 입력하거나 `/poteto-mode`가 실행할 때 로드되며, 모든 스킬을 실행하지 않습니다. |
| 병렬 에이전트가 서로 덮어씀 | 각 에이전트에게 자체 워크트리를 제공하거나, 각각 자체 머신을 받는 클라우드 에이전트로 실행하세요. |
| 오버나이트 실행이 이동했지만 아무것도 완료하지 않음 | `/loop`는 기간이 아니라 통과하거나 실패할 수 있는 검사가 필요합니다. [가이드 페이지 7](../../docs/guide/07-overnight.md)를 참조하세요. |
| 응답이 녹색 빌드에서 성공을 주장 | 실제 명령, 흐름, 저장된 값 또는 프로필을 요청하세요. 그것이 prove-it-works 원칙입니다. |

드리프트하는 실행의 경우 [`references/prompting.md`](references/prompting.md)에 한 줄 스티어가 있습니다. [가이드 페이지 10](../../docs/guide/10-recipes-and-pitfalls.md)에 더 많은 함정과 복사할 가치가 있는 레시피가 있습니다.

## pstack을 내 것으로 만들기

- [`/automate-me`](../automate-me/SKILL.md)는 사용자 자신의 기록에서 개인 모드 스킬을 작성하여 `/poteto-mode`와 함께 사용합니다.
- [`/reflect`](../reflect/SKILL.md)는 세션 후 교훈을 사용자가 승인하는 스킬 편집으로 전환합니다.
- `/poteto-mode write a skill for <workflow>`는 작성 playbook을 실행합니다. eval playbook은 스킬 변경을 블라인드로 테스트합니다.
- 잘못 동작하는 스킬을 잘못된 기능 작업 내부가 아니라 자체 PR에서 수정하세요.

[가이드 페이지 9](../../docs/guide/09-make-it-yours.md)는 이 각각을 커버합니다.

## 응답

답으로 이끕니다. 하나가 맞으면 [`references/recipes.md`](references/recipes.md)에서 조정된 코드 블록에 최대 하나의 예제 프롬프트를 제공한 다음 해당 파일에 대한 링크를 제공하세요. 사용자가 전체 맵을 요청하지 않는 한 짧게 유지하세요.
