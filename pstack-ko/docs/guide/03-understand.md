# 변경하기 전에 코드 이해하기

이해하지 못하는 코드를 편집하는 것은 미묘한 회귀가 배포되는 방식이며, 이것은 에이전트에게나 당신에게나 마찬가지입니다. 에이전트는 보통 두 가지 방식 중 하나로 실패합니다. 당신이 원하는 것을 잘못 읽거나, 작업을 올바르게 수행할 컨텍스트가 없습니다. [프롬프트에 들어가는 것](./02-poteto-mode.md#what-goes-in-a-prompt)이 첫 번째를 처리합니다. 이 페이지는 두 번째를 처리합니다.

pstack은 네 가지 방법을 제공합니다. `/how`는 코드가 지금 무엇을 하는지 설명합니다. `/why`는 왜 그런 방식으로 형성되었는지 이유를 파헤칩니다. `/teach`는 둘 다 하나의 설명으로 혼합합니다. `/recall`은 주제에 대한 당신 자신의 최근 컨텍스트를 재구축합니다. 각각은 또한 에이전트가 확인할 수 있는 단어로 자신을 설명하도록 만듭니다. 그것이 당신보다 코드를 더 잘 알 수 있는 에이전트를 감독하는 방법입니다.

![탐정이 확대경으로 기계 청사진을 연구하는 동안 로봇들이 사건 파일을 가져옴; 그녀 뒤의 증거 보드는 /how와 /why 아래에 단서들을 연결.](./images/understanding.jpg)

## 읽기 전용 조사로 시작

원인이 불분명할 때, 수정이 아니라 발견을 요청하세요:

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet"는 이것을 [Investigation 플레이북](../../skills/poteto-mode/playbooks/investigation.md)으로 라우팅합니다. `/how`를 실행하고, 동기에 대한 질문을 위해 `/why`를 추가하고, 인용된 설명을 반환합니다. 옵션 간의 선택의 경우, 트레이드오프 테이블과 함께 권장 사항을 반환합니다. "what data you used"를 묻는 것은 에이전트가 증거를 추측과 분리하도록 만듭니다. 발견이 수정을 가리킬 때, 새 작업으로 수정을 시작하세요.

## `/how`로 동작 추적

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

실제로 가진 질문을 하세요. [`/how`](../../skills/how/SKILL.md)는 코드를 읽고 서브시스템에 당신을 온보딩하는 시니어 엔지니어 수준에서 런타임 플로우, 키 타입, 명백하지 않은 부분과 함께 답변합니다. 큰 서브시스템의 경우 먼저 2~4개의 읽기 전용 탐색기를 펼칩니다. 좁은 질문의 경우 그냥 읽고 설명합니다.

## `/why`로 히스토리 파헤치기

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md)는 소스 컨트롤에서 시작한 다음, 이슈 트래커, 긴 형식 문서, 팀 채팅, 관찰성, 에러 추적, 분석과 같이 MCP가 노출하는 증거 카테고리를 모두 병렬로 쿼리합니다. 보고서는 모든 것을 인용하고, 직접 증거를 추론과 분리하고, 기록이 얇을 때 "appears to"라고 말합니다. 널 결과도 보고되는데, "아무도 왜 적지 않았다"는 그 자체로 답이기 때문입니다.

둘은 자연스럽게 결합됩니다. `do why first then how`는 히스토리가 혼란을 설명한다고 의심될 때 좋은 프롬프트입니다.

## `/teach`로 실제로 이해하기

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md)는 요약만으로 충분하지 않을 때 사용합니다. `/how`와 `/why`를 실행하며, 작은 변경의 경우 아마도 그 중 하나만, 발견을 다이어그램을 하나씩 쌓아가며 명확한 설명으로 엮습니다. "convince me" 프레임은 재사용할 가치가 있습니다. 설명을 투어가 아니라 테스트할 수 있는 주장으로 바꿉니다.

에이전트 자신의 선택에도 작동합니다:

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

가르침은 당신만큼이나 에이전트에게도 도움이 됩니다. 작업을 설명해야 하는 에이전트는 코드를 읽고 각 주장을 증거로 뒷받침해야 하며, 자신감 있게 말하고 계속 진행하는 대신.

## `/recall`로 자신의 컨텍스트 재구축

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md)는 당신 자신의 최근 채팅과 공유 기록(이슈, 이전 수정, 여전히 발생하는 에러)을 마이닝하고 상황과 다음 내용에 대한 브리프를 돌려줍니다. 오래된 채팅은 새로운 에이전트가 부족한 컨텍스트를 보유하므로, 먼저 로드하여 오래된 주제에 대한 새 작업을 시작한 다음 새 입력을 전달하세요:

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

하나의 특정 채팅을 재개하려면, 아래 Session pickup 플레이북이며, `/recall`이 아닙니다.

## Session pickup으로 이전 작업 인수

다른 에이전트(또는 지난 주의 당신)가 브랜치를 중간에 남겼을 때:

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[Session pickup 플레이북](../../skills/poteto-mode/playbooks/session-pickup.md)은 이전 추적을 권위있는 것으로 취급합니다. 브랜치 상태와 결정을 재구성하고, 재개 지점을 명명하고, 처음부터 모든 것을 재유도하는 대신 원래 목표에 대해 상속된 주장을 검증합니다.

**함정:** "에이전트가 어쨌든 코드를 읽을 것"이라고 이 페이지의 스킬을 건너뛰지 마세요. 추적된 모델 없이 편집을 시작하는 에이전트는 첫 번째 그럴듯한 지점에서 증상을 수정하는 경향이 있습니다. `/how`가 먼저인 것이 두 번째 버그보다 저렴합니다.

다음: [변경 설계하기](./04-design.md).
