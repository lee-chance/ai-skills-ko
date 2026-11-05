# 레시피와 함정

복사할 가치가 있는 프롬프트들, 그 다음 모두가 한 번 만드는 실수들. 자신의 경로와 완료 조건을 넣으세요. 레시피는 의도적으로 비공식적입니다. 그것이 실제로 입력되는 방식이며, 스킬은 의도를 잘 읽습니다.

![카운터 위에 /how, /tdd, /loop를 읽는 고정된 카드가 있고, 레시피 박스에서 로봇들이 요리하는 동안 그녀가 완성된 요리를 맛봄.](./images/recipes.jpg)

## 낯선 서브시스템 이해

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

메커니즘 먼저, 히스토리 두 번째. 각 스킬의 보고서는 검색한 소스를 알려주므로, 답변이 무엇에 근거하는지 알 수 있습니다.

## 코드를 건드리기 전에 시끄러운 보고서 재진술

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

잘못 읽은 것은 재진술에 나타나며, 수정하는 데 하나의 메시지 비용이 듭니다. 에이전트가 자신의 것을 말할 때까지 당신 자신의 이론을 숨기세요. `/in-your-own-words`는 플레이북 없이 재진술만 요청합니다.

## 보내기 전에 프롬프트 다듬기

```text
/sharpen write the onboarding doc for the new billing service.
```

에이전트는 당신이 요청하지 않은 것을 전문가가 할 것, 그들이 시작할 원자료, 그들의 방법과 도구, 그리고 결과가 옳다는 외부 점검을 명명합니다. 그것을 요청하도록 재작성된 프롬프트를 돌려주고 작업을 수행하지 않습니다. 옳게 읽히면 재작성을 보내세요.

## 선택하기 전에 프로토타입

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

설명이 아니라 실행되는 것에서 선택합니다. 에이전트는 가는 길에 자신의 레이아웃과 타이밍 질문에 답합니다.

## 정해진 설계를 계획으로 전환

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

설계가 정해진 후에만 요청하세요. 계획이 결과물이며, 그것을 실행할 플레이북을 명명합니다.

## 설계에 대한 두 번째 의견 얻기

```text
ask /arena for a second opinion on this thread and our approach
```

당신의 현재 설계는 여러 후보 중 하나가 되며, 합성은 패널이 더 나은 것을 찾았는지 당신이 가진 것을 확인했는지 알려줍니다. 되돌리기가 비싼 설계 옆에 비용이 적습니다.

## 독립적인 슬라이스를 병렬로 체크

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

각 워커는 하나의 패키지를 소유합니다. 부모는 모든 슬라이스를 기다리고 원시 워커 덤프 대신 하나의 `PASS`, `ISSUES` 또는 `BLOCKED` 보고서를 반환합니다.

## 브랜치를 회의적으로 검토

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

한정자는 실제 작업을 수행합니다. "don't change anything yet"는 읽기 전용으로 유지하고, nitpick 규칙은 노이즈를 사전 필터링하여 검증된 발견이 당신의 시간 가치가 있도록 합니다.

## 실패하는 테스트를 통해 버그 수정

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path"는 중요합니다. 취약한 mock을 통해 테스트를 강제하는 것은 실제 명령을 실행하는 것보다 적게 증명하며, 플레이북은 그렇게 말할 수 있습니다.

## 증거로 보고서 재현 및 수정

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main"은 버그가 이미 사라졌을 때 실행이 일찍 멈추도록 합니다. 비디오는 diff를 읽기 전에 수정을 확인할 수 있게 합니다.

## 테스트가 거의 도달하지 못하는 속성 증명

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

명시된 범위 내의 모든 케이스에서 체크된 하나의 속성, 코드가 이미 그것을 깨뜨리면 코드의 용어로 반례, 그리고 다음 에이전트가 그 코드에 대한 모든 변경에서 실행하는 프로젝트 스킬을 얻습니다.

## 게시하기 전에 숫자 검증

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

실행 횟수, 범위, 숫자를 제한하는 것과 함께 더 빠름, 더 느림, 측정 가능한 차이 없음 또는 inconclusive를 얻습니다.

## 동일한 실수 수정 중지

```text
/correct agents keep adding new config flags without registering them in the schema
```

수정은 아키텍처, 타입, lint 또는 테스트로 리포에 착지하므로, 다음 에이전트가 실수를 만들 수 없습니다.

## 작업을 시작하지 않고 how 질문

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

답변, 보낼 프롬프트, 소스 링크를 얻습니다. 그 프롬프트를 보낼 때까지 아무것도 실행되지 않습니다.

## 물러날 때 실행을 정직하게 유지

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

전체 계약은 [야간 페이지](./07-overnight.md)에 있습니다. 작업과 완료 조건이 이미 대화에 있으면 짧은 형식이 작동합니다.

## 표류하는 실행 리디렉션

조향 프롬프트는 한 줄입니다:

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

더 많은 단어가 거의 필요하지 않습니다. 올바른 이름이 필요하며, [원칙 페이지](./08-principles.md)가 어휘입니다.

## 명확한 단어로 답변 얻기

```text
/bro
```

그것이 전체 프롬프트입니다. [`/bro`](../../skills/bro/SKILL.md)는 전문 용어 없이, 더 짧게, 한 인간이 다른 인간에게 말하는 것처럼 마지막 메시지를 다시 말합니다. 답변이 기술적으로 철저하고 여전히 무엇을 말했는지 모를 때 사용하세요.

## 실행 중으로 남긴 채팅 따라잡기

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md)는 마지막 메시지 이후 변경된 것을 명확한 단어로 알려주고, 선택, 증거, 위험과 함께 기다리고 있는 각 호출을 나열합니다. 보고하는 동안 아무것도 변경하지 않습니다.

대신 캐치업을 관찰하려면, [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)를 실행하세요. 슬라이드의 짧은 자막이 있는 비디오로 무슨 일이 일어났는지 보여주고, 기다리고 있는 호출을 그 아래 텍스트로 나열합니다.

## 함정들

- **프롬프트에 스킬 열거하기.** "use /how then /architect then /arena"는 플레이북이 이미 순서를 정한 단계를 재정렬합니다. 목표와 제약을 명시하세요. 기본값을 오버라이드하기 위해서만 스킬을 명명하세요.
- **모호한 완료 조건.** "make it better"는 `/loop`에 확인할 것을 제공하지 않습니다. 통과하거나 실패할 수 있는 명령이나 아티팩트를 제공하세요.
- **원인에 대한 당신의 이론으로 리드.** 에이전트는 당신이 가리킨 곳을 검색합니다. 먼저 문제를 다시 말하도록 요청한 다음, 직감을 공유하세요.
- **첫 번째 설계 받아들이기.** 하나의 시도는 모델이 생각한 첫 번째 형태에 고정됩니다. 프로토타입 또는 `/architect`를 요청하고 증거에서 선택하세요.
- **추상 계획 다듬기.** 뒤에 코드가 없는 계획의 적대적 검토는 절대 일어나지 않을 위험을 발명합니다. 프로토타입으로 미해결 질문을 해결한 다음, 구축된 것을 검토하세요.
- **하나의 워크트리에 병렬 에이전트.** 서로 덮어쓰고, 어떤 에이전트가 무엇을 변경했는지 아무도 알 수 없습니다. 클라우드 에이전트로 실행하거나, "own worktree per attempt"라고 말하세요.
- **루프를 신뢰하기 전에 루핑.** 자신의 작업을 검증할 수 없는 루프는 확인되지 않은 작업을 더 빠르게 만들 뿐입니다. 먼저 검증 스킬이 작동하도록 하세요.
- **검증되지 않은 숫자 신뢰.** 따뜻한 캐시나 건너뛴 코드 경로가 속도 향상을 가짜로 만들 수 있습니다. 숫자가 어디든 가기 전에 `/benchmark-checklist`를 실행하세요.
- **손으로 동일한 실수 수정.** 채팅의 수정은 하나의 실행을 돕습니다. `/correct`는 나중 실행이 반복하지 않도록 리포를 수정합니다.
- **커버리지에 `/arena` 사용.** `/arena`는 하나의 설계 또는 코드 브리프를 반복한 다음, 베이스를 선택하고 최고의 부분을 이식합니다. `/swarm`은 슬라이스 또는 선언된 레이스 암을 분할하고 하나의 보고서를 집계합니다.
- **모든 리뷰 주석 수락.** 봇과 인간 모두 하나의 리스트에 실제 캐치와 노이즈를 제출합니다. `/interrogate`는 재실행이 증명하는 발견만 유지하고 삭제한 것과 이유를 나열하며, 어느 쪽이든 오버라이드할 수 있습니다.
- **`auto`를 모델 슬러그로 취급.** `auto`와 `inherit-parent`는 "서브에이전트가 부모 채팅 모델을 상속하도록 모델 필드를 생략"을 의미합니다. [설정](./01-setup.md)이 역할을 다룹니다.
- **그린 빌드에서 성공 보고.** 빌드는 컴파일됨을 증명합니다. 실제 명령, 플로우, 저장된 값 또는 프로파일을 요청하고, 답변에 증거를 기대하세요.
- **`SKILL.md`를 손으로 작성.** [스킬 작성 또는 수정 플레이북](../../skills/poteto-mode/playbooks/authoring-a-skill.md)을 통해 라우팅하여 검증과 검토가 일어나도록 하세요.

그것이 가이드입니다. 앞으로 건너뛰었다면, [설정](./01-setup.md)으로 돌아가서 하나의 실제 작업을 실행하세요. 습관은 읽는 것이 아니라 사용에서 고착됩니다.

[가이드 인덱스](./README.md)로 돌아가기.
