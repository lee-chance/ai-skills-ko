# 당신의 것으로 만들기

poteto-mode는 한 사람의 스타일입니다. 그 아래의 플레이북, 라우팅, 모델 역할은 당신의 것과도 똑같이 잘 작동합니다. 이 페이지는 개인 모드 생성, 세션에서 교훈 캡처, 에이전트가 실수를 반복하지 않도록 리포 수정, 집중된 스킬 작성, 신뢰하기 전에 스킬 변경 테스트를 다룹니다.

생각보다 작게 시작하세요. 첫날에 많은 스킬이 필요하지 않으며, 이 전체 플러그인도 필요하지 않습니다. 명확하게 프롬프트하고, 에이전트가 실패하는 곳을 관찰하고, 동일한 실패가 두 번 나타날 때 스킬이나 체크를 추가하세요.

## `/automate-me`로 자신만의 모드 생성

```text
/automate-me
```

스타일을 설명하지 않습니다. [`/automate-me`](../../skills/automate-me/SKILL.md)가 히스토리에서 읽기 때문입니다. 활성 워크스페이스의 최근 transcript에서 답변, 위임, 검증, 코드, 산문, 프로세스를 좋아하는 방식에서 반복되는 선호도를 마이닝한 다음, 어떤 패턴이 정말 당신인지 묻습니다. Cursor의 내장 `create-skill` 플로우를 통해 `.cursor/skills/<your-name>-mode/SKILL.md`를 초안하고, 초안을 [`/unslop`](../../skills/unslop/SKILL.md)을 통해 실행하고, 다른 변경처럼 검토할 수 있도록 워크트리에서 PR을 엽니다.

습관이 표류할 때마다 다시 실행하세요:

```text
/automate-me update my mode skill with everything since its last edit
```

업데이트 모드는 스킬이 마지막으로 변경된 이후의 히스토리만 마이닝합니다. 모순되지 않은 규칙을 유지하고, 새 증거가 있는 규칙을 수정하고, 새 패턴에 대한 섹션만 추가합니다.

## `/reflect`로 세션의 교훈 캡처

무언가를 가르쳐준 작업 직후, 실행하세요:

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md)는 transcript를 세 명의 병렬 리뷰어에게 보낸 다음, 합성기가 제안을 `Accepted`, `Rejected`, `Backlog`로 정렬하고 스킬 변경 전에 승인을 기다립니다. 미래 결정을 변경할 경우에만 제안을 승인하세요. 하나의 이상한 세션은 일화이지, 규칙이 아닙니다.

## `/correct`로 환경 수정

동일한 실수로 에이전트를 반복해서 수정할 때, 수정은 다음 프롬프트가 아니라 리포에 속합니다. 얼마나 잘 유지되는지에 따라 옵션을 랭크하세요:

1. 아키텍처나 더 나은 데이터 구조로 실수를 불가능하게 만드세요.
2. 타입으로 차단하거나, 에러가 수정을 명명하는 lint 또는 CI 체크로 차단하세요.
3. 테스트로 잡으세요.
4. doc 또는 에이전트 규칙으로 기록하세요. 에이전트가 규칙을 건너뛸 때 아무것도 실패하지 않으므로, 이것이 마지막에 옵니다.

인간 리뷰는 리스트에 없습니다. 모든 PR에서 동일한 실수를 잡아야 하는 리뷰어는 이것이 수정하는 문제입니다. [`/correct`](../../skills/correct/SKILL.md)가 작업을 수행합니다:

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

최근 커밋, 리버트, 리뷰 주석, 회피책을 설명하는 주석을 읽은 다음, 실수를 클래스로 그룹화합니다. 클래스는 두 번 발생하면 계산됩니다. 가장 빈번한 클래스를 각각 하나의 커밋으로 작동하는 최고 수준에서 수정하고, 각 새 체크가 실제 과거 실수에서 실패함을 증명합니다. 또한 각 규칙을 그것을 시행하는 것과 페어링하는 에이전트 지시 파일에 테이블을 유지하므로, 아무것도 시행하지 않는 규칙은 반복으로 나타납니다. 답변은 각 클래스를 증거, 선택된 수준, 더 높은 수준이 작동하지 않은 이유와 함께 나열합니다.

인수 없이 실행하면 자체적으로 히스토리에서 클래스를 찾습니다. `/reflect`와 `/correct`는 작업을 나눕니다. `/reflect`는 하나의 세션에서 스킬을 개선합니다. `/correct`는 실수 클래스가 돌아올 수 없도록 리포를 변경합니다. 수정이 새 경계일 때 `/architect`와 페어링하세요. [많은 프로젝트를 병렬로 실행](./07-overnight.md#run-many-projects-in-parallel)에는 전체 리포에 걸쳐 둘 다 수행하는 프롬프트가 있습니다.

## 집중된 스킬 작성

캡처하려는 워크플로우를 이미 알고 있을 때:

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

스킬 작성은 [스킬 작성 또는 수정 플레이북](../../skills/poteto-mode/playbooks/authoring-a-skill.md)에 매칭되며, 이는 Cursor의 내장 `create-skill`을 통해 라우팅하고, frontmatter와 링크를 검증하고, PR 열기 플레이북을 통해 결과를 배포합니다. 에이전트 대상 산문은 인간 산문보다 높은 기준을 가지는데, 도움이 되지 않는 문장이 미래 에이전트가 따르는 지시사항이 되기 때문입니다. 손으로 `SKILL.md`를 작성하는 대신 플레이북이 그 기준을 유지하도록 하세요.

두 가지 특수 케이스는 자체 생성기를 가집니다. 앱을 구동하고 동작을 증명해야 하는 스킬은 검증 스킬이므로, 대신 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md)과 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)을 사용하세요. 모델 체커, 증명 또는 다른 검증기로 코드의 속성을 체크하는 스킬은 공식 검증 스킬이므로, [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md)과 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)을 사용하세요. [검증 및 배포](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill)는 두 종류 모두 다룹니다.

## `/technical-writing`으로 표준에 맞춰 문서 작성

스킬만이 배포하는 유일한 산문은 아닙니다. docs, RFC, readme, PR 설명, 커밋 메시지의 경우:

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md)는 계층화된 표준을 적용합니다. 목표는 피곤한 엔지니어가 첫 읽기에서 이해하는 산문입니다. 먼저 문서의 모드(튜토리얼, how-to, 참조 또는 설명)를 선택한 다음, 문장별로 작업합니다: 누가 무엇을 하는지, 문장당 하나의 생각, 두 가지 방식으로 읽을 수 있는 것 없음. 당신이나 에이전트가 방금 작성한 것을 검토하는 데 사용하거나, doc을 요청할 때 미리 명명하세요.

## 블라인드로 스킬 변경 테스트

스킬 편집은 모든 미래 세션에 영향을 미치므로, 실험인 것처럼 테스트하세요. 다른 사람의 스킬을 채택하는 것도 마찬가지입니다. 유지하기 전에 당신의 작업에서 에이전트를 더 좋게 만드는지 확인하세요.

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

스킬이 계속 놓치고 무엇을 해야 하는지 알 때, 한 작업에서 변경하고 테스트하세요:

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

미리 eval을 요청하는 것은 편집을 정직하게 유지합니다. 하나의 나쁜 세션에서 작성된 수정은 그 세션에 과적합되는 경향이 있으며, 많은 편집에 걸쳐 스킬이 표류합니다. eval은 배포하기 전에 표류를 잡습니다.

[Eval 플레이북](../../skills/poteto-mode/playbooks/eval.md)은 하나의 실패 모드, 관찰자 효과를 중심으로 만들어졌습니다. 평가받고 있다는 것을 아는 에이전트는 다르게 행동합니다. 따라서 후보 에이전트는 소독된 디렉토리에서 유기적으로 보이는 작업을 얻으며, "eval" 또는 "candidate"라는 단어도, 서로의 존재도 절대 얻지 못합니다. 한 판사가 중립 레이블 아래 모든 출력을 점수 매기고, 체인 따르기는 각 후보가 주장하는 것이 아니라 실제로 읽은 파일에서 채점됩니다.

판결을 수락하기 전에 모든 출력을 직접 읽으세요. 판사와 동의하지 않으면, 판단을 의심하기 전에 루브릭을 의심하세요.

## `/make-bot-ui`로 봇 UI 빌드

하나의 상황별 스킬은 Grok Bot 사용자를 위한 것입니다. [`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md)는 버튼이 웹훅 루틴을 통해 봇을 깨우는 작은 페이지를 빌드합니다. 예를 들어, 리뷰 큐를 스와이프하고 각 스와이프가 봇에게 그 항목에 대해 행동하도록 요청하게 할 수 있습니다. 머신의 서버가 웹훅의 sender 키를 보유하므로, 키는 브라우저나 채팅에 절대 도달하지 않습니다. 스킬은 또한 Tailscale에 페이지를 노출하는 것을 다룹니다.

**함정:** 작동하지 않기 때문에 작업 중간에 스킬을 편집하지 마세요. 자체 PR에서 수정하고 작업을 계속 진행하세요. 기능 작업에 얽힌 스킬 편집은 리뷰에 보이지 않고 평가할 수 없습니다.

다음: [레시피와 함정](./10-recipes-and-pitfalls.md).
