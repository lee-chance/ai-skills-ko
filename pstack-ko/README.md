# pstack (한국어 번역)

> **번역 안내**: 이 폴더는 [pstack 플러그인](../pstack/)의 비공식 한국어 번역본입니다. 원본 폴더는 그대로 유지되며, 이 번역본은 학습 및 이해를 돕기 위한 목적으로 제공됩니다. 최신 정보는 항상 [원본 pstack 폴더](../pstack/)를 참조하세요.

---

저는 [poteto](https://x.com/poteto)입니다. 저는 회장이나 CEO는 아니지만 Meta, Netflix, Cursor에서 수백만 줄의 코드를 다뤄왔습니다. 또한 React 코어 팀 멤버로서 React 컴파일러를 구축하고 유지보수하는 일을 돕고 있습니다.

AI가 너무 많은 slop(저품질) 코드를 작성한다는 인식이 커지고 있습니다. 저도 동의합니다. 저는 20명의 slop 아티스트처럼 배포하고 싶지 않습니다. 품질 없는 처리량은 제가 추구하는 목표가 아닙니다. 빠르게 가고 싶다면, 먼저 깊게 파고들어야 합니다.

**pstack이 제 답입니다.** 이것들은 제가 Cursor에서 고품질 코드를 배포하기 위해 매일 사용하는 것과 동일한 스킬입니다. 이것은 Cursor를 진짜 엔지니어링 팀으로 바꿔줍니다. 목표는 코드 라인 수를 최대화하는 것이 아니라, 사실 그 반대입니다. pstack은 더 적지만 더 높은 품질의 코드를 작성하도록 도와줍니다.

**pstack은 두려움 없는 병렬성을 제공합니다.** 한 에이전트를 깊게 파고들어 좋고 검증 가능한 코드를 작성하도록 신뢰할 수 있을 때, 진정으로 자신감 있게 병렬화할 수 있습니다. `poteto-mode`로 여러 에이전트를 시작하고 그들이 엄격한 엔지니어링 원칙을 작업에 적용할 것을 신뢰하세요.

**cursor는 모든 세계의 장점을 제공합니다.** 모든 최첨단 모델은 각자의 강점과 약점을 가지고 있습니다. pstack으로 어떤 모델이든 사용하세요. 사실, 제 많은 스킬들은 각 모델의 고유한 강점을 활용하기 위해 멀티 모델 워크플로우를 사용합니다.

포크하세요. 개선하세요. 당신의 것으로 만드세요. PR은 환영합니다!

## 설치

```bash
/add-plugin pstack
```

claude code에서:

```bash
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

claude code는 서드파티 마켓플레이스에 대한 자동 업데이트를 끄므로, pstack은 설치한 버전에 그대로 유지됩니다. 자동 업데이트를 켜려면 `/plugin`을 실행하고 **marketplaces** 탭을 열고 `cursor-plugins`를 선택한 다음 **enable auto-update**를 선택하세요. 수동으로 한 번 업데이트하려면 `claude plugin update pstack@cursor-plugins`를 실행하세요.

claude code는 플러그인 명령과 에이전트에 접두사를 붙이므로, `/poteto-mode`는 `/pstack:poteto-mode`가 됩니다. [claude code 어댑터](./docs/harness/claude-code.md)는 다른 모든 Cursor 이름을 매핑합니다. claude code에서 `/pstack:setup-pstack`은 모델 선택을 `~/.claude/rules/pstack-models.md`에 작성하고, Cursor 전용 기능(예: bugbot 또는 automations)이 필요한 단계는 한 줄 노트와 함께 건너뜁니다.

claude code는 리포지토리 루트의 [`harness/pstack/`](https://github.com/cursor/plugins/tree/main/harness/pstack)에서 이 readme와 가이드를 포함한 생성된 pstack 사본을 설치합니다. pstack을 변경한 후 리포지토리 루트에서 `node scripts/generate-pstack-harness-trees.mjs`를 실행하고 결과를 커밋하세요. 생성된 사본이 최신 상태가 아니면 CI가 실패합니다.

## 시작하기

두 단계:

1. [`/setup-pstack`](./skills/setup-pstack/SKILL.md)을 실행하고, 추론 예산을 선택하고, 원하는 모델을 선택하세요.
2. 엄격함이 필요한 작업을 할 때마다 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)를 사용하세요.

여기가 처음이신가요? [pstack 가이드](./docs/guide/README.md)가 설정과 프롬프팅부터 검증과 야간 실행까지 첫 실제 작업을 안내합니다. 막히거나 어떤 스킬이 맞는지 확실하지 않나요? [`/poteto-help`](./skills/poteto-help/SKILL.md)에 물어보세요.

그게 전부입니다. 다른 스킬들은 상황에 따라 필요하며, mode 스킬이 필요에 따라 사용합니다. 기본적으로 mode는 모델 강도별로 작업을 나눕니다: 코드 위임(기능, 리팩토링, 버그 수정, 성능, hillclimb)은 grok으로 가고, 가장 어려운 변경, 산문, 판단은 opus 5.5로 갑니다. 기본 패널은 opus 5.5 / grok입니다. [`/setup-pstack`](./skills/setup-pstack/SKILL.md)은 이것들을 변경할 수 있습니다.

## 사용법

작업 시작 시 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)를 사용하세요. 요청을 읽고, 플레이북 세트에서 선택하고, 필요에 따라 다른 스킬들을 실행합니다.

작업을 입력하기 전에 `/` 메뉴에서 `/poteto-mode`를 선택하면 cursor가 메시지에 스킬을 첨부합니다.

### 그냥 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)를 사용하세요

이 스킬은 주요 단축키입니다. 에이전트가 엄격한 엔지니어링 작업을 수행해야 할 때마다 사용합니다. 23개의 플레이북이 제공됩니다:

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

<details>
<summary>23개 플레이북 모두 보기</summary>

| 플레이북 | 용도 |
|---|---|
| [investigation](./skills/poteto-mode/playbooks/investigation.md) | 읽기 전용 질문. x가 어떻게 작동하는지, y가 왜 이렇게 만들어졌는지, 우리가 확신하는지. |
| [bug fix](./skills/poteto-mode/playbooks/bug-fix.md) | 결함을 재현하고, 근본 원인을 찾고, 런타임 증거로 수정. |
| [perf](./skills/poteto-mode/playbooks/perf-issue.md) | 측정된 느림을 추적하고 기준선 대비 개선. |
| [hillclimb](./skills/poteto-mode/playbooks/hillclimb.md) | 목표 대비 하나의 메트릭을 지속적이고 과학적으로 개선, 전후 측정으로 가설을 반복하고 승인된 개선마다 하나의 커밋. |
| [runtime forensics](./skills/poteto-mode/playbooks/runtime-forensics.md) | 계측으로부터 라이브 증상(누수, 유휴 CPU 스핀, 글리치) 진단. |
| [trace forensics](./skills/poteto-mode/playbooks/trace-forensics.md) | 캡처된 프로파일링 아티팩트(cpuprofile, trace, spindump, heap snapshot) 진단. |
| [feature](./skills/poteto-mode/playbooks/feature.md) | 명명된 데이터 형태로부터 구축된 새롭거나 변경된 동작. |
| [refactoring](./skills/poteto-mode/playbooks/refactoring.md) | 구조나 형태에 대한 동작 보존 변경. |
| [prototype](./skills/poteto-mode/playbooks/prototype.md) | 설계나 동작 결정을 저렴하게 내리거나 관찰하여 경험적 포크를 해결하기 위한 일회용 스케치. |
| [visual parity](./skills/poteto-mode/playbooks/visual-parity.md) | 두 구현 간의 픽셀 단위 정확한 UI 동등성. |
| [authoring a skill](./skills/poteto-mode/playbooks/authoring-a-skill.md) | SKILL.md 작성 또는 편집. |
| [eval](./skills/poteto-mode/playbooks/eval.md) | 스킬 또는 프롬프트 변경이 에이전트 동작에 미치는 영향을 블라인드 테스트. |
| [babysit](./skills/poteto-mode/playbooks/babysit.md) | PR 또는 스택을 병합 준비 상태로 유도: 충돌, 리뷰 스레드, CI. |
| [shipping](./skills/poteto-mode/playbooks/shipping.md) | 그린 스택을 독립적으로 검증한 다음, 기본적으로 github를 통해 또는 가능한 경우 origin을 통해 연속된 검증된 실행을 상향식으로 병합. |
| [autonomous run](./skills/poteto-mode/playbooks/autonomous-run.md) | 멈추지 않고 긴 작업을 완료까지 주도. |
| [orchestrate](./skills/poteto-mode/playbooks/orchestrate.md) | 하나의 코디네이터 채팅에 전달된 지속적인 프로젝트: 며칠, 많은 스택된 PR, 서브에이전트 함대. |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | PR당 하나의 소유자로 독립적인 PR을 병합까지 실행. 각 코드 준비 헤드를 스웜이 검증하고, 패치에 대한 모든 이후 변경은 새로운 체크를 받음. |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 병합 없는 autopilot-full. 운영자가 검토하고 병합할 PR을 빌드하고 검증하며, 빌드되는 PR 위에만 PR을 스택. |
| [session pickup](./skills/poteto-mode/playbooks/session-pickup.md) | 이전 에이전트의 진행 중인 작업을 재개하거나 인수. |
| [pause safely](./skills/poteto-mode/playbooks/pause-safely.md) | 나중에 재개할 수 있도록 진행 중인 작업을 깔끔하게 일시 중단. |
| [multi-phase plan](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 단계 또는 스택된 PR에 걸친 작업. |
| [worktree cleanup](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 병합되거나 버려진 워크트리와 오래된 iOS 시뮬레이터를 정리하여 디스크 회수, 안전 게이트 적용. |
| [opening a pr](./skills/poteto-mode/playbooks/opening-a-pr.md) | 작은 순서있는 커밋들로부터 conventional commits 제목과 브리핑 스타일 본문을 가진 준비된 PR 열기. 모든 다른 플레이북의 끝에 호출됨. |

</details>

호출되면:

1. 작업을 [플레이북](./skills/poteto-mode/playbooks/)에 매칭하고 그 단계들을 그대로 복사한 첫 번째 항목으로 하는 todo 리스트를 엽니다.
2. 단계가 실행될 때 다른 스킬들로 라우팅합니다.
3. 소비자와 유지보수자를 위해 프레임된 unslopped 답변을 작성합니다.

전체 규칙과 플레이북은 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)에 있습니다.

턴 간에 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)를 계속 유지하려면, `/` 메뉴에서 선택하고 enter 대신 option+enter(Mac) 또는 alt+enter(Windows)를 누르세요. 그러면 [커스텀 모드](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)가 되어 cursor가 에이전트 창과 CLI에서 제공합니다. 모드를 종료할 때까지 매 턴마다 컨텍스트에 유지됩니다. 일반 enter는 하나의 메시지에만 첨부합니다.

[`/poteto-mode`](./skills/poteto-mode/SKILL.md)는 cursor의 `/loop` 명령과 매우 잘 작동합니다. 엄격함을 희생하지 않고 여러 시간 동안 cursor가 작업하도록 할 수 있습니다.

## 스킬들

[`/poteto-mode`](./skills/poteto-mode/SKILL.md)는 단계가 필요할 때 이들 대부분을 실행합니다(`how`, `why`, `architect`, `arena`, `swarm`, `interrogate`, `unslop`, `no-comments`, `technical-writing`, `tdd`, 그리고 원칙들). 아래 표는 직접 원하는 것을 위한 것입니다:

```
/how do we cancel runs? do we have an n+1 when we look up every run to cancel?
```

```
/interrogate review this pr.
```

<details>
<summary>모든 스킬</summary>

| 스킬 | 사용 시점 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 중요하지 않은 작업에 대한 기본 진입점. |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | pstack이 처음이거나 어떤 스킬, 플레이북 또는 원칙이 맞는지 확실하지 않을 때. 무엇을 하려는지 알아내고, 그 부분에 답하고, 입력할 프롬프트를 제공. `/poteto-help`를 입력할 때만 실행. |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 에이전트가 시작하기 전에 목표와 문제를 다시 말하기를 원할 때. `/in-your-own-words`를 입력할 때만 실행. |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 프롬프트를 보내기 전에 더 크게가 아니라 더 깊게 만들고 싶을 때: 당신이 요청하지 않은 것을 최고의 전문가가 할 것, 그들이 시작할 원자료, 그들의 방법과 도구, 그리고 결과가 옳은지에 대한 외부 점검. 재작성된 프롬프트를 돌려주고 선택권을 열어둠. 작업을 수행하지 않음. `/sharpen`을 입력할 때만 실행. |
| [`/how`](./skills/how/SKILL.md) | 서브시스템이 어떻게 작동하는지에 대한 워크스루를 원할 때. |
| [`/why`](./skills/why/SKILL.md) | 뭔가가 왜 이런 방식으로 만들어졌는지 알고 싶을 때. 런타임에 사용 가능한 MCP를 발견하고 각 증거 카테고리를 병렬로 쿼리(소스 컨트롤, 이슈 트래커, 긴 형식 문서, 실시간 채팅, 인프라 관찰성, 에러 추적, 분석 웨어하우스). |
| [`/recall`](./skills/recall/SKILL.md) | 작업을 시작하거나 재개하고 특정 주제에 대한 최근 컨텍스트를 자신의 채팅 히스토리와 공유 기록에서 재구축하여 간결한 현재 상태 브리프로 받고 싶을 때. |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 마지막 메시지 이후 이 채팅에서 변경된 것을 명확한 단어와 작은 시각 자료로 원할 때, 답변만으로 결정 가능하도록 기다리고 있는 모든 항목이 나열되며, 그것이 답변을 길게 만들더라도. |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | `/ketchup` 캐치업을 슬라이드의 짧은 자막이 있는 비디오로 원할 때, 기다리고 있는 호출은 그 아래 텍스트로. |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 작아 보이는 변경이 있고 다른 무엇을 깨뜨릴 수 있는지 알고 싶을 때, 주장이 아니라 실행 코드로 입증된 안전한 이유인 하나의 사실로. |
| [`/architect`](./skills/architect/SKILL.md) | 함수 경계를 넘는 코드를 작성하려고 하고 호출자의 사용법, 타입, 모듈 형태를 먼저 정하고 싶을 때. |
| [`/arena`](./skills/arena/SKILL.md) | 동일한 것에 대한 N개의 병렬 시도를 원하고, 각각의 최고 부분을 가져가고 싶을 때. |
| [`/swarm`](./skills/swarm/SKILL.md) | 다른 슬라이스 또는 레이스에 걸친 N개의 병렬 워커를 원하고, 하나의 집계된 보고서를 원할 때. |
| [`/interrogate`](./skills/interrogate/SKILL.md) | diff가 있고 다른 모델들이 그것을 깨뜨리려고 시도하기를 원할 때, 실행이 증명하는 발견만 유지. |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 실제로 작업한 방식으로부터 초안된 자신의 `-mode` 스킬을 원할 때. |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 버튼이 웹훅을 통해 Grok Bot을 깨우는 페이지 또는 대시보드를 원할 때, sender-key handoff와 Tailscale 포함. |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 역할당 pstack이 사용하는 모델을 선택하고 싶을 때. 모델을 감지하고 설정 규칙을 작성. |
| [`/reflect`](./skills/reflect/SKILL.md) | 긴 작업이 끝나고 레시피를 스킬 편집으로 캡처하고 싶을 때. |
| [`/correct`](./skills/correct/SKILL.md) | 동일한 실수로 에이전트를 계속 수정할 때. 히스토리에서 실수 클래스를 마이닝하고, 작동하는 최고 수준에서 각각을 수정(아키텍처, 그 다음 타입, lint, CI, 그 다음 테스트, 마지막으로 문서)하고, 각 규칙을 그것을 시행하는 것과 페어링하는 테이블 유지. |
| [`/teach`](./skills/teach/SKILL.md) | 변경이나 서브시스템을 요약만 받는 것이 아니라 실제로 이해하고 싶을 때. how + why를 실행하고 다이어그램을 하나씩 쌓아가며 하나의 명확한 설명을 엮음. |
| [`/tdd`](./skills/tdd/SKILL.md) | 버그를 수정하고 저렴한 로컬 테스트 경로가 있을 때. 실패하는 테스트를 먼저 작성하고, 그 다음 수정. |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 벤치마크를 실행하거나 속도 향상 또는 회귀를 측정했을 때. 보고하거나 조치를 취하기 전에 숫자를 검증(제한 요소, 튜닝, 오류, 반복 실행, 엔드투엔드 관련성). |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 리뷰 전에 주석을 제거; Comment Sicko를 생성하고, 승인된 발견을 수정하고, 주장된 제약에 대한 인코딩 제공. |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | TypeScript를 읽거나 편집할 때. type-system-discipline 원칙을 구문으로 근거함. |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 번들된 플레이북이 맞지 않을 때. 작업에 대한 엄격하고 감사 가능한 플레이북을 설계. |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 검토 가능한 의사결정 추적을 원할 때. 커밋할 수 있는 tsv에 결정을 로깅. |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 프로젝트에 앱 동작을 증명하는 스크립트화된 방법이 없을 때. 모든 언어 또는 플랫폼에 대한 기능 맵을 가진 프로젝트 로컬 verify 스킬을 생성. |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | verify 스킬의 기능 맵이 앱에서 벗어났을 때. 소스 웨이브 + 하나의 라이브 패스, 최대 하나의 입증된 수정 PR. |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 테스트가 레이스, 재시도, 상태 머신, 파서 또는 안전하지 않은 코드를 깨뜨리는 케이스에 도달할 수 없을 때. 맞는 도구로 하나의 속성을 검증하고 모든 변경에서 다시 체크하는 프로젝트 로컬 스킬을 생성. |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 공식 검증이 커버하는 코드가 마지막 체크 이후 변경되었을 때. 코드와 일치하도록 모델, 하네스 또는 속성을 업데이트하고, 재실행하고, 각 실패가 검증의 드리프트인지 코드의 버그인지 말함. |
| [`/statechart`](./skills/statechart/SKILL.md) | 동작을 소유한 누군가가 스펙을 읽는 것이 아니라 보기를 원할 때. TLA+ 모델을 체크하고, 사용자가 보는 것을 mermaid 상태도로 그리고, 규칙을 깨뜨리는 각 상태를 표시하고, 각각에 대한 최단 경로를 제공. |
| [`/unslop`](./skills/unslop/SKILL.md) | 글쓰기를 정리할 때. AI 흔적을 제거. |
| [`/bro`](./skills/bro/SKILL.md) | 마지막 메시지를 전문 용어 없이 평범한 인간 언어로 다시 말하기를 원할 때. |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 문서, RFC, readme, PR 설명, 커밋 메시지를 위한 계층화된 문서 표준(Diátaxis + Google developer style + STE + Global English). |

</details>

### 예제

대부분 작업 시작 시 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)를 입력하고 플레이북으로 라우팅되도록 합니다. 다른 스킬들은 단계가 필요할 때 실행됩니다. 몇 가지는 직접 사용합니다.

<details>
<summary>모든 예제</summary>

```
bug fix:           /poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even
                   when idle. repro first, then fix and verify.
perf:              /poteto-mode a big list takes a second or two to load even though we virtualize.
                   run a cpu trace and tell me why.
feature:           /poteto-mode build a small feature behind a feature flag. verify it really works.
prototype:         /poteto-mode build two prototypes of the markdown renderer so we can compare.
                   spawn an agent for each.
multi-phase:       /poteto-mode open source these skills as a plugin. nothing internal leaks, work
                   in a temp dir, show me the dependency graph first.
overnight run:     /poteto-mode i'm going to bed. land the stack even if ci flakes. i want
                   everything merged by morning.
babysit:           /poteto-mode check on pr 123. anything outstanding?
visual parity:     /poteto-mode the row spacing is too tall when this flag is on. the second image
                   is correct. repro and fix until it matches.
figure it out:     /poteto-mode i'm stepping away. migrate every caller from the synchronous store
                   to the new async one, keeping behavior identical. i want to trust it was done
                   right when i'm back.
how:               /how do we cancel runs? do we have an n+1 when we look up every run to cancel?
why:               /why is this feature flag not on yet?
architect:         design this instrumentation to be high signal with no false positives. /architect
                   this first.
arena:             /arena take my prompt to the arena verbatim. i want to compare their proposals
                   with yours.
swarm:             /swarm check every package under packages/ against its check.sh. one worker per
                   package. one report.
interrogate:       /interrogate review this pr.
tdd:               /tdd implement
unslop:            can we unslop and tighten the new changes?
reflect:           /reflect that took too long. capture what we learned so the next run doesn't
                   repeat it.
correct:           /correct
show-me-your-work: /show-me-your-work keep a decision trail i can review when i'm back.
automate-me:       /automate-me
help:              /poteto-help which skill should i use to review this branch?
```

</details>

## `poteto-agent` 및 Comment Sicko 서브에이전트

[`/poteto-mode`](./skills/poteto-mode/SKILL.md)는 이것을 받은 채팅에서 실행됩니다. 그 채팅이 플레이북, todo 리스트, 그리고 모든 서브에이전트 생성을 소유합니다.

pstack은 또한 실행 중에 생성된 위임자를 위한 래퍼로 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)를 제공합니다. 작업을 수행하기 전에 인라인 원칙 인덱스를 포함한 `poteto-mode` 전체를 읽습니다. `generalPurpose`를 대체하면 그 읽기를 건너뛰고 드리프트됩니다. 플레이북 자체를 실행하기 위해 `poteto-agent`를 생성하지 마세요.

[`/poteto-mode`](./skills/poteto-mode/SKILL.md)와 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)는 동일한 래퍼를 통해 라우팅합니다.

pstack은 또한 `subagent_type: "comment-sicko"`로 사용할 수 있는 읽기 전용 주석 리뷰어인 [Comment Sicko](./agents/comment-sicko.md)를 제공합니다. 보통 직접이 아니라 [`/no-comments`](./skills/no-comments/SKILL.md)를 통해 호출합니다.

## 원칙들

각각 하나의 원칙을 가진 24개의 짧은 스킬들. `poteto-mode`는 그것들을 인라인으로 인덱싱하고 작업 시작 시 그 인덱스를 읽습니다. 독립 실행형 파일들은 다른 스킬들이 원칙을 이름으로 참조할 수 있도록 거기에 있으며, 인덱스가 각각에 대한 전체 규칙을 가리킬 수 있도록 합니다.

<details>
<summary>24개 원칙 모두 보기</summary>

| 원칙 | 그룹 | 규칙 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | 핵심 | 삭제와 문제를 해결하는 가장 작은 변경을 선호. |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | 핵심 | 로직 작성 전에 적용: 핵심 타입과 데이터 구조 선택, 스캐폴드 대 기능 작업 순서화, 동시 액터가 무엇을 공유하는지 질문. 다운스트림 코드가 명확해지도록 데이터 구조를 올바르게 함. |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | 핵심 | 요구사항을 덧붙이는 대신 첫날부터 기본 가정이었던 것처럼 재설계. |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | 핵심 | 하나의 전제를 공유하는 둘 이상의 수정이 동일한 게이트에서 실패했을 때 적용. 또 다른 수정을 작성하기 전에 전제를 기록하고 직접 테스트. |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | 핵심 | 먼저 데드 웨이트, 중복 검증기, 스텁 참조를 제거하고, 더 단순한 기반 위에 구축. |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | 핵심 | 질문과 답변 사이의 레이어와 독자의 머릿속 숨겨진 상태를 세고; 하나의 호출자 래퍼를 접고 가변 범위를 줄임. |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | 핵심 | 명시적 단계 경계를 가진 계획된 재작성 및 마이그레이션 중에 적용. 일회용 호환성 코드로 부드러운 중간 상태를 보존하지 말고 대상 아키텍처로 수렴. |
| [experience-first](./skills/principle-experience-first/SKILL.md) | 핵심 | 구현 편의성보다 사용자 기쁨을 선택; 더 많은 거친 기능보다 더 적은 세련된 기능을 배포. |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | 핵심 | 커밋하기 전에 2-3개의 경쟁 프로토타입을 만들고 나란히 비교. |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | 핵심 | 대량 작업뿐만 아니라 중요하지 않은 작업에도 적용: 편집, 마이그레이션, 분석, 체크. 손으로 작업하는 대신 그것을 수행하거나 입증하는 도구를 구축(codemod, script, generator, 또는 서브에이전트가 따르는 스킬). 도구는 리뷰어가 재실행할 수 있는 아티팩트. |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | 아키텍처 | 흩어진 조건문 대신 구조에 도메인을 인코딩. |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | 아키텍처 | 시스템 경계(CLI, config, network, external APIs)에 가드를 집중; 내부 타입을 신뢰하고 비즈니스 로직을 순수 함수로 유지. |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | 아키텍처 | 불법 상태를 표현 불가능하게 만들고, 의미론적 프리미티브를 브랜딩하고, 경계에서 외부 데이터를 파싱하고, 변형을 소진하고, 권위있는 스키마에서 파생. |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | 아키텍처 | 부분 이전 실행에 관계없이 동일한 최종 상태로 수렴. |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 아키텍처 | 호환성 레이어를 보존하는 대신 호출자를 마이그레이션하고 동일한 웨이브에서 오래된 API를 삭제. |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 아키텍처 | 먼저 공유를 제거; 하나의 공유 writer가 실제 불변식일 때만 구조적으로 직렬화. |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | 검증 | 작업 완료 후, 완료를 선언하기 전에 적용. 프록시, 자체 보고 또는 '컴파일됨'이 아니라 실제 아티팩트(기능 실행, 실제 값 읽기, diff 검사)에 대해 검증. |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | 검증 | 각 증상을 시스템이 처음 잘못된 곳까지 추적하고 거기서 수정. 가드는 처리하는 상태가 합법적일 때만 수정. |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | 검증 | 다단계 작업(스윕, 마이그레이션, 유사 편집 실행)과 커밋 및 PR을 스택하는 방법에 적용. 작업을 각각 검증 가능한 상태로 끝나는 작은 단위로 나누고, 다음 전에 각각을 체크하고, 시퀀스가 리뷰어에게 자신을 증명하도록 배달을 주문. |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | 검증 | 테스트를 작성, 변경 또는 유지할 때 적용. 코드의 사용자가 관찰할 수 있는 것을 주장하므로, 그 동작이 깨질 때 테스트가 실패하고 내부만 변경될 때 계속 통과. |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | 검증 | 측정한 숫자를 신뢰, 보고 또는 조치하기 전에 적용: 속도 향상, 회귀, 처리량, 지연 시간 또는 eval 결과. 그것을 제한하는 것을 찾고, 생각하는 작업이 아닌 다른 것을 측정했다는 것을 배제. |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | 위임 | 대량을 서브에이전트로 라우팅; 원시 페이로드가 아니라 요약을 메인 스레드에 유지. |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | 위임 | 진행하고, 결과를 제시하고, 사람이 사후에 경로를 수정하도록 함; 되돌릴 수 없는 행동에 대한 확인을 예약. |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | 메타 | 더 많은 텍스트 대신 lint, 메타데이터 플래그, 런타임 체크 또는 스크립트로 규칙을 인코딩. |

</details>

## 여기에 포함되지 않음

`poteto-mode`가 참조하지만 번들되지 않은 몇 가지:

- `/deslop`과 `deslop` 스킬은 `cursor-team-kit` 플러그인에서 제공.
- `control-cli`(CLI 및 TUI용)와 `control-ui`(브라우저, Electron, web용)도 `cursor-team-kit`에서 제공.
- `/create-skill`은 cursor 내장. cursor는 또한 PR을 감시하는 내장 `/autopilot`을 제공. `poteto-mode` 내부에서는 PR 상태 요청이 대신 [babysit playbook](./skills/poteto-mode/playbooks/babysit.md)으로 이동.

전체 세트를 원하면 pstack과 함께 `cursor-team-kit`을 설치하세요.

## 왜 계획 스킬이 없나요?

cursor는 이미 pstack과 잘 작동하는 훌륭한 plan 모드를 가지고 있습니다. 하지만 개인적으로, 저는 계획을 믿지 않습니다. 최고의 스펙은 코드입니다. 계획을 만들고 싶다면, [`/poteto-mode`](./skills/poteto-mode/SKILL.md)가 커버하지만, 기본값은 아닙니다.

## 당신의 것으로 만드세요

`poteto-mode`는 제 스타일입니다. 당신은 정확히 그것을 원하지 않을 수 있습니다.

[`/automate-me`](./skills/automate-me/SKILL.md)를 입력하세요. 최근 transcript를 마이닝하고, 실제로 작업한 방식으로부터 `<your-name>-mode` 스킬을 초안하고, 아래에서 pstack을 통해 라우팅합니다. pstack을 기반으로 유지하고 `poteto-mode`와 함께 자신의 라우팅 스킬을 갖게 됩니다.

모델도 구성 가능합니다. [`/setup-pstack`](./skills/setup-pstack/SKILL.md)를 입력하세요. 액세스할 수 있는 모델을 감지하고 각 역할(코드, 판단, 리뷰 패널)을 모델에 매핑하는 작은 항상 적용 규칙을 작성합니다. 모든 스킬이 그것을 읽고 규칙이 없을 때 합리적인 기본값으로 폴백하므로, 원하는 것만 오버라이드합니다.

기본값이 변경되면, 변경 전에 작성된 규칙은 여전히 이전 기본값을 고정합니다. 해당 역할 라인을 삭제하거나 파일을 삭제한 다음 `/setup-pstack`을 다시 실행하세요. 재실행은 모델이 기본값과 다른 역할을 유지합니다.

## 자동화

pstack은 또한 휴면 상태의 [benny automation pack](./automations/benny/)을 제공합니다. benny는 Slack 이슈 보고서를 분류하고, 실제 UI 증거로 확인된 버그를 재현하고 수정합니다. 그 파일들은 슬래시 스킬로 등록되지 않습니다.

설정하려면 cursor를 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)로 가리키세요. 설정은 팩을 `.cursor/automations/benny/`의 대상 리포지토리에 복사하고, 공유 스킬을 위해 거기에 pstack을 활성화하고, 복사된 팩 외부에 사용자 구성을 유지합니다. benny는 cursor automations에서 실행되므로 Cursor 전용입니다.

## 라이선스

MIT

---

## 📁 폴더 구조 가이드

이 섹션은 pstack 플러그인의 구조를 이해하는 데 도움을 주기 위해 추가되었습니다:

- **`agents/`** - 서브에이전트 정의 (`poteto-agent`, `comment-sicko`)
- **`assets/`** - 플러그인 로고 및 기타 정적 리소스
- **`automations/`** - 자동화 팩 (예: `benny` - Slack 이슈 트리아지 자동화)
- **`docs/`** - 상세 문서
  - **`guide/`** - 단계별 사용 가이드 (설정, 사용법, 원칙 등)
  - **`harness/`** - 다른 환경(claude code) 어댑터 문서
- **`skills/`** - 58개의 스킬 정의 (각 SKILL.md 파일)
  - 핵심 스킬: `poteto-mode`, `poteto-help`, `architect`, `arena`, `swarm` 등
  - 원칙 스킬: `principle-*` (24개의 엔지니어링 원칙)
  - 검증 스킬: `create-verification-skill`, `statechart`, `tdd` 등
  - 문서 스킬: `technical-writing`, `unslop`, `no-comments` 등
- **`plugin.json`** - 플러그인 메타데이터 (이름, 버전, 설명 등)
- **`.cursor-plugin/`** - Cursor 플러그인 시스템 설정
- **`LICENSE`** - MIT 라이선스 (영문)
- **`README.md`** - 이 파일 (주요 문서 및 시작 가이드)
