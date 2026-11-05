---
name: technical-writing
description: "계층화된 기술 문서 표준: Diátaxis 구조, Google 개발자 스타일 문장, STE 지침 규칙, Global English 구문. /technical-writing 또는 문서, RFC, readme, PR 설명 또는 커밋 메시지 작성 또는 검토 시 사용하세요."
disable-model-invocation: true
---

# Technical writing

피곤한 엔지니어가 첫 읽기에 이해할 수 있도록 작성하세요. 네 개의 레이어를 모두 적용하세요.

세 가지 규칙이 레이어 위에 있습니다:

- **작업을 하지 않는 모든 단어를 자르세요.** 단어 없이 문장이 살아남으면 단어는 사라집니다. "In order to"는 "to"입니다. "It is important to note that"는 없습니다.
- **짧고 일상적인 단어를 사용하세요.** "utilize"가 아니라 "use". "facilitate"가 아니라 "help". "perform"이 아니라 "do". 긴 단어는 정밀도로 길이를 사야 합니다.
- **규칙이 문장을 더 나쁘게 만들 때 문장을 다른 방식으로 수정하거나 그대로 두세요.** 모든 규칙을 따르고 기계가 작성한 것처럼 들리는 문장은 실패했습니다.

코드베이스가 단어 목록입니다. 동의어나 설명이 아니라 실제 심볼, 파일, 플래그 또는 명령 이름을 작성하세요.

전문 용어를 발명하지 마세요. 개발자가 소리 내어 말할 단어를 사용하세요: "evacuate", "ratchet" 또는 "endgame"이 아니라 "move", "delete", "a budget that only decreases". 명명된 패턴은 문서가 첫 번째로 무엇을 의미하는지 말할 때 괜찮습니다. 새로운 위반자와 그 대체를 diff와 함께 응답에서 `unslop`의 abstract-metaphor 규칙에 추가로 제안하세요. 해당 스킬을 편집하지 마세요.

## 리듬을 다양화하세요

문서는 모든 레이어를 준수하고 여전히 기계 작성으로 읽힐 수 있습니다: 모든 문장이 짧게 잘리고, 어디에도 시각이 없고, 특정한 것이 없습니다.

- 목적에 따라 문장 길이를 혼합하세요. 짧은 문장은 포인트를 착륙시킵니다. 더 긴 것은 조건이나 결과와 함께 사실을 전달합니다.
- 문장당 하나의 생각은 문장당 하나의 길이를 의미하지 않습니다. 두 가지 생각을 전달하는 문장을 분할하세요. 하나를 전달하는 긴 문장을 유지하세요.
- 모드가 허용하는 곳에서 시각을 가지세요. 설명은 트레이드오프를 가중하므로 장단점을 나열하는 대신 그것들에 대해 무엇을 만드는지 말하세요. 참조는 건조하게 유지됩니다.
- 무균보다 구체적으로. "schema changes can cause issues"가 아니라 "a column rename fails the build".

## 먼저 모드 선택 (Diátaxis)

하나의 문서, 하나의 모드. 두 가지 질문이 그것을 선택합니다: 콘텐츠가 행동 (doing)을 알리나요 또는 이해 (thinking)를, 그리고 학습 또는 작업을 제공하나요?

- 행동 + 학습: **tutorial** (튜토리얼).
- 행동 + 작업: **how-to** (방법).
- 이해 + 작업: **reference** (참조).
- 이해 + 학습: **explanation** (설명).

전체 문서 또는 하나의 문장에 나침반을 사용하세요.

**Tutorial: doing으로 학습.** 학습자의 성공은 그들의 직업이 아니라 당신의 직업입니다. 학습자가 "배울" 것이 아니라 빌드할 것을 말하면서 여세요. 모든 단계는 일찍 그리고 자주 보이는 결과를 생성합니다. 그들이 무엇을 봐야 하는지 말하세요: 예상 출력, 프롬프트 변경, 로그 라인. 설명을 한 절과 링크로 자르세요. 구체적으로 유지하세요. "we"로 명령으로 작성하세요: "First, do x. Now, do y."

**How-to: 목표로 가는 단계.** 기계가 수행할 수 있는 작업이 아니라 사람이 가진 문제를 해결하세요. 역량을 가정하고 교육을 건너뛰세요. 행동만: 탈선 없음, 배경 없음, 자체를 위한 완전성 없음. 대신 링크하세요. 포크와 판단을 허용하세요: "If you want x, do y." 가이드를 작업으로 명명하세요: "Radar array calibration"이 아니라 "How to calibrate the radar array".

**Reference: 조회를 위한 사실.** 설명만 하세요. 지침 없음, 설득 없음, 의견 없음. 건조하고, 완전하고, 확실하게. 헤징 없이 사실, 옵션, 한계 및 오류를 진술하세요. 설명된 것의 구조를 미러링하여 코드와 문서를 함께 탐색할 수 있도록 하세요. 독자가 예상하는 곳에 자료를 두세요. 가능한 곳에서 코드에서 생성하세요.

**Explanation: 이해와 왜.** 하나의 경계가 있는 주제, 제품에서 멀리 읽을 수 있습니다. 각 제목은 앞에 암묵적인 "About..."을 견뎌야 합니다. 실제 왜 질문에 고정하세요. 컨텍스트를 제공하세요: 설계 결정, 역사, 제약 조건, 대안. 의견은 여기서만 허용되고 다른 곳에서는 없습니다.

모드를 혼합하지 마세요: 튜토리얼 내부의 참조 테이블 없음, 참조 내부의 튜토리얼 손잡이 없음, how-to 내부의 주장 없음. 대신 분할하고 링크하세요.

## 독자에게 문장 작성 (Google 개발자 스타일)

- 독자에게 "you"로, 현재 시제로 말하세요. "Will"은 진정으로 나중에 일어나는 것에 대해서만.
- 누가 무엇을 하는지 말하세요: "is checked"가 아니라 "the compiler checks". 액터가 알려지지 않았거나 요점 옆일 때만 수동형이 괜찮습니다.
- 지침을 명령으로 작성하세요: "Click Submit." 사실을 평범하게 진술하세요. 절대 "should be done".
- 지침 전에 조건을 두세요: "To delete the document, click Delete."
- 일반적인 경우를 먼저 두세요. 예외는 후.
- 지식 있는 친구처럼 들리세요. 유행어 없음, 비유적 언어 없음, 지침에 "please" 없음, 절차에서 절대 "simply", "easy" 또는 "quickly". 간단했다면 독자가 여기 있지 않을 것입니다.
- 사전 발표하지 마세요 ("we will soon support...") 그리고 동일한 구문으로 연속 문장을 시작하지 마세요.
- 링크가 어디로 가는지 말하는 단어로 링크하세요: 페이지 제목 또는 짧은 설명. 절대 "click here". 페이지 외부로의 링크보다 페이지의 컨텍스트 문장을 선호하세요.
- 헤딩은 주제뿐만 아니라 포인트를 전달합니다 ("Modes"가 아니라 "Pick the mode first"). 문장 케이스. 작업 헤딩은 베어 동사 구입니다 ("Create an instance"). 개념 헤딩은 명사 구입니다. 페이지당 하나의 h1, 건너뛴 수준 없음.
- 시퀀스에 대한 번호 목록, 다른 모든 것에 대한 글머리 기호. 완전한 문장으로 목록을 소개하세요. 항목을 병렬로 유지하세요.
- 코드는 코드 폰트로 갑니다. UI 요소는 굵게 표시됩니다. 직렬 쉼표를 사용하세요. "etc."를 삭제하고 목록이 부분적이라고 미리 말하세요.

## 진술이 한 번에 하나씩 로드되도록 만들기 (STE 규칙)

- 문장당 하나의 지침. 다른 모든 곳에서 문장당 하나의 생각.
- 약 20단어보다 긴 지침과 약 25단어보다 긴 다른 문장을 분할하세요.
- 보호하는 단계 전에 경고 또는 조건을 두세요: "If hot oil touches your skin, injuries can occur."
- "the"와 "a"를 유지하세요: "Remove backup file"은 두 가지 방식으로 읽힙니다. "Remove the backup file"은 하나로 읽힙니다.
- 각 단어에 하나의 의미와 하나의 작업을 제공한 다음 유지하세요. "check"가 검사를 의미하면 억제에도 사용하지 마세요.
- 액션당 하나의 단어를 선택하고 고수하세요: 여기서 "start"이고 거기서 "initiate"가 아니라.
- 절대 내레이션으로 그리고 절대 수동형으로가 아니라 직접 명령으로 절차를 작성하세요: "the component must be installed"가 아니라 "Install the component".
- 가능한 곳에서 "-ing" 단어를 피하세요.

## 두 가지 읽기에 열려 있는 문장을 남기지 마세요 (Global English)

- "only"와 "not"과 같은 단어를 변경하는 단어 옆에 유지하세요: "only fails on growth"와 "fails only on growth"는 다른 것을 말합니다.
- 긴 명사 문자열을 분해하세요: "the proto import budget check script"는 "the script that checks the proto-import budget"가 됩니다.
- 모든 "it", "they", "this"가 하나의 명백한 것을 가리키게 만드세요. 의심스러우면 명사를 반복하세요. "this" 또는 "which"를 절대 전체 절을 가리키도록 사용하지 마세요.
- 동사를 삭제하지 마세요: "Phase 1 moves the converters and Phase 2 the runtime"은 Phase 2를 하나 없이 남깁니다. 하나를 주세요.
- 구조를 보여주는 작은 단어를 유지하세요. "Ensure that the switch is off"의 "that"와 같은. 명확성을 위해 단어 수를 절대 교환하지 마세요.
- 문장이 두 가지 방식으로 그룹화할 수 있을 때 "and" 또는 "or"가 어떤 부분을 결합하는지 말하세요. "Both...and", "either...or", "if...then"은 무료 명확화입니다.
- 세미콜론이 아니라 마침표를 사용하세요. em 대시를 새 문장으로 교체하세요.
- 괄호 안의 텍스트를 완전한 문법 단위 또는 자체 문장으로 만드세요. 절대 "(s)"로 복수를 형성하지 마세요.
- 슬래시 없음: "a/b" 또는 "and/or" 대신 "a, b, or both"를 작성하세요.
- 각 것을 어디서나 하나의 이름으로 호출하세요. 하나의 것에 대해 "the gate", "the ratchet", "the budget check"라고 말하는 문서는 세 가지를 가르칩니다. 변경되지 않은 것을 변동시키지 마세요.
- 관용구, 구어, 라틴 약어 및 은유를 건너뛰세요.

## 목소리 및 저장소 특성

- 이 스킬이 터치하는 모든 문서에 **unslop** 스킬을 적용하세요. 해당 스킬은 slop 패턴 카탈로그를 소유합니다: AI 어휘, 필러, 헤징, 포맷 징후.
- PR 설명과 커밋 메시지도 쓰기입니다. Diátaxis를 제외한 모든 레이어가 그것들에 적용됩니다. PR 본문은 리뷰어가 1분 미만에 읽을 수 있는 브리핑입니다. swarm 로그, SHA 목록 또는 메트릭 테이블을 붙여넣지 마세요. 링크하세요.
- 제품 UI 문자열은 문서가 아닙니다. 그것들에 대해 제품의 복사 가이드라인을 사용하세요.
- 탭으로 코드 스니펫을 들여쓰세요. 실제 경로를 작성하세요. 모든 카운트 또는 트리 주장을 착륙시키는 커밋에서 참으로 만들고, 재생성하는 명령을 포함하세요.

## 작업 예제

전:

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

후:

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.
