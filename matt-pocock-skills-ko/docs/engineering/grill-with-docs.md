## 무엇을 하나요

`grill-with-docs`는 여러분과 [에이전트](https://www.aihero.dev/ai-coding-dictionary/agent)가 하나의 이해를 공유할 때까지 계획이나 설계에 대해 인터뷰하고, 그러는 동안 어휘와 어려운 결정을 저장소에 작성합니다. [grill-me](https://aihero.dev/skills-grill-me)가 실행하는 것과 동일한 인터뷰입니다(질문 라운드, 그런 다음 대기, 그런 다음 다음 라운드), 코드베이스를 가리킵니다.

**[상태를 가집니다](https://www.aihero.dev/ai-coding-dictionary/stateful)**. 다른 모든 그릴링 스킬은 [세션](https://www.aihero.dev/ai-coding-dictionary/session)을 머릿속에 남깁니다. 이것은 디스크에 파일을 남깁니다. 용어가 해결되면 스킬은 끝에 일괄적으로가 아니라 즉시 `GLOSSARY.md`에 작성합니다. 결정이 세 개의 게이트를 통과하면 스킬은 ADR로 작성합니다. 그것이 전체 차이이며, 사람들이 스킬과 함께 가지는 대부분의 문제를 일으키기도 합니다. 아티팩트는 실제 저장소의 실제 파일이므로 예상했을 때 누락될 수 있고, 두 명 이상의 사람이 작성할 때 표류할 수 있습니다.

## 언제 사용하나요

`/grill-with-docs`를 입력하여 호출하며, 에이전트는 스스로 이를 찾지 않습니다.

계획이 여전히 흐릿하고 사물에 대한 단어가 아직 정착되지 않았을 때, 저장소에서 변경 시작 시 사용하세요. 단일 세션 도구입니다. 원하는 그릴링 스킬은 앞에 있는 것에 따라 다릅니다:

| 가지고 있는 것 | 찾아야 할 것 |
| --- | --- |
| 작업 디렉토리에서 전혀 작업하지 않습니다 | [grill-me](https://aihero.dev/skills-grill-me) |
| 저장소, 그리고 하나의 세션에서 정착할 수 있는 변경 | `grill-with-docs` |
| 하나의 세션에 담기에는 너무 큰 노력(그린필드 빌드, 큰 기능) | [wayfinder](https://aihero.dev/skills-wayfinder) |
| 도메인 문서가 전혀 없고 특정 기능을 염두에 두지 않은 저장소 | `grill-with-docs`, 변경이 아니라 저장소를 겨냥 |
| 다른 사람의 머릿속 지식에 막힌 결정 | [to-questionnaire](https://aihero.dev/skills-to-questionnaire) |

wayfinder 분할은 세션 수로 귀결됩니다: 단일 세션 계획을 위한 `/grill-with-docs`, 다중 세션 계획을 위한 `/wayfinder`.

## 전제 조건

스킬은 저장소에 작성하므로 안전하게 작성할 수 있는 곳에 있어야 합니다. 해결된 용어는 루트의 `GLOSSARY.md` 용어집 또는 루트의 `GLOSSARY-MAP.md`가 저장소를 다중 컨텍스트로 표시하는 경우 관련 컨텍스트의 `GLOSSARY.md`로 이동합니다. 결정은 `docs/adr/`로 이동합니다. 스킬은 필요할 때만 둘 다 생성합니다. 첫 번째 용어 또는 결정이 정착될 때까지 아무것도 존재하지 않으므로 사전에 아무것도 설정하지 않습니다.

또한 자체 `SKILL.md`가 위임하는 한 줄이기 때문에 두 개의 다른 스킬이 존재해야 합니다. [grilling](https://aihero.dev/skills-grilling)은 인터뷰를 제공하고, [domain-modeling](https://aihero.dev/skills-domain-modeling)은 작성을 제공합니다. `grill-with-docs`만 설치하면 작동하지 않는 스킬을 얻습니다.

## 종이 흔적

세션에서 세 가지가 나오며, 동등하지 않습니다.

| 해결된 것 | 도착하는 곳 |
| --- | --- |
| 용어: 사물에 대한 프로젝트 자체 단어 | `GLOSSARY.md`, 인라인, 해결되는 순간 |
| 되돌리기 어렵고, 컨텍스트 없이 놀랍고, 실제 트레이드오프인 결정 | `docs/adr/` 아래의 ADR |
| 결정한 다른 모든 것 | 대화, 그리고 다른 곳이 없음 |

세 번째 행은 사람들을 잡는 것입니다. `GLOSSARY.md`는 용어집일 뿐입니다. 구현 세부 사항, [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 및 스크래치 노트를 보유하지 않습니다. ADR은 세 가지 조건을 동시에 필요로 하므로 대부분의 결정은 자격이 없고 대부분의 세션은 아무것도 생성하지 않습니다. 더 날카로운 용어집과 0개의 ADR을 생성하는 세션은 설계대로 작동하지만, 동의한 대부분의 것이 동의한 [컨텍스트 창](https://www.aihero.dev/ai-coding-dictionary/context-window)에만 존재함을 의미합니다. [지우는](https://www.aihero.dev/ai-coding-dictionary/clearing) 대신 동일한 대화를 [to-spec](https://aihero.dev/skills-to-spec)에 전달하세요.

용어집은 주요 출력입니다. 이 스킬은 도메인 언어를 빌드합니다: 프로젝트 자체 단어, 한 번 합의되어 여러분, 에이전트 및 동료가 다시 해결할 필요가 없습니다. 모든 사람이 이것이 에이전트 성능을 향상시킨다는 데 동의하는 것은 아닙니다. 가장 강한 반대는 용어와 그 평범한 영어 확장이 [모델](https://www.aihero.dev/ai-coding-dictionary/model)에서 동일한 결과를 얻고, 어휘가 주로 공유하는 사람들 사이의 통신을 단축한다는 것입니다. 그 견해에서 용어집은 여전히 가치가 있지만 가치는 사람들에게 갑니다.

## 자주 묻는 질문

**이것을 사용해야 하나요, 아니면 `/wayfinder`를 사용해야 하나요?**
범위가 결정합니다. 하나의 세션에서 정착할 수 있는 모든 것에 이것을 사용하세요. 노력이 하나에 담기에는 너무 클 때 [wayfinder](https://aihero.dev/skills-wayfinder)를 사용하고, 먼저 작업을 결정 [티켓](https://www.aihero.dev/ai-coding-dictionary/ticket) 맵으로 차트합니다. Wayfinder는 느리고 밀도가 높으며, 잘 범위가 지정된 기능에 도달하는 것은 일반적인 실수입니다. 이 스킬을 대체하지 않으며, 하나에 적합한 맵의 부분에 대해 그릴링 세션을 시작할 수 있습니다.

**실행되었지만 `GLOSSARY.md`와 ADR이 나타나지 않았습니다.**
두 가지 알려진 원인이 있습니다. 첫 번째는 아무것도 자격이 없다는 것입니다. ADR은 세 개의 게이트가 모두 필요하며, 새로운 어휘가 없는 변경에 대한 세션은 작성할 것이 없습니다. 두 번째는 실제 버그입니다. 스킬이 다른 오케스트레이션 계층(spec 주도 개발 래퍼, 다중 에이전트 프레임워크, 다른 사람의 파이프라인에서 단계로 호출하는 규칙) 내에서 실행될 때, 사용자는 인터뷰가 여전히 실행되는 동안 파일 작성 절반이 조용히 발생하지 않는다고 보고합니다. 버그가 제출되었고 수정되지 않았습니다. 해당 설정에 있다면 세션의 출력을 신뢰하기 전에 작업 디렉토리를 확인하세요.

**모든 것을 한 번에 물었고, 권장 사항이 없었으며, `GLOSSARY.md`를 언급하지 않았습니다.**
스킬이 두 의존성을 로드하지 못한 것입니다. `SKILL.md`가 한 줄 위임이기 때문에 [grilling](https://aihero.dev/skills-grilling)과 [domain-modeling](https://aihero.dev/skills-domain-modeling)을 가져오지 않는 에이전트는 그릴링이 무엇을 의미하는지 추측하고, 구조 없이 모든 질문을 한 번에 얻습니다. 부분 로딩은 더 혼란스럽습니다. `grilling`은 로드되고 `domain-modeling`은 로드되지 않으며, 종이 흔적이 없는 좋은 인터뷰를 얻습니다. 얼마나 자주 발생하는지는 모델과 [노력](https://www.aihero.dev/ai-coding-dictionary/effort) 수준에 달려 있으며, 이 스킬에 대해 가장 많이 보고된 문제입니다. 의심되는 경우 에이전트에게 어떤 스킬을 로드했는지 직접 물어보세요.

**내 다른 모든 결정은 어디로 갔나요?**
대화에만 있습니다. 이것은 스킬에 대한 가장 심각한 열린 불만입니다. 용어집은 spec이 아니며, 대부분의 답변은 ADR을 얻지 못하고, 해결된 각 답변을 spec, 티켓 및 테스트에 연결하는 기록이 없습니다. 나중 단계는 정확한 답변(순서 보장, 부정 요구 사항, 숫자 기본값)을 더 약한 산문으로 부드럽게 하고, 결과는 결정한 것을 놓치면서 완전해 보일 수 있습니다. 지금은 세션을 유지하고 [to-spec](https://aihero.dev/skills-to-spec)에 직접 피드하세요. 그런 다음 캡처했다고 가정하는 대신 자신의 답변에 대해 spec을 다시 읽으세요.

**문서가 전혀 없는 기존 저장소를 가리킬 수 있나요?**
예. 이것은 ADR, 도메인 언어 및 설계 원칙이 없는 코드베이스에 적합한 스킬입니다: 호출하고 "내 저장소를 문서화하는 데 도움을 주세요"라고 말하세요. 사용자는 종종 `GLOSSARY.md`를 빌드하거나 수리하기 위해 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)와 쌍을 이룹니다. 조종할 것으로 예상하세요. 코드를 읽고 찾은 것에 대해 묻고, 코드베이스에 이미 있는 단어 중 어느 것이 올바른 것인지 결정합니다.

**세션이 끝나면 무엇을 해야 하나요?**
스킬의 마감 메시지는 종종 열린 끝이며, 이는 알려진 문제입니다. 메인 플로우에서 답은 동일한 대화에서 [to-spec](https://aihero.dev/skills-to-spec)입니다. 변경이 즉시 빌드할 만큼 작으면 대신 [implement](https://aihero.dev/skills-implement)로 바로 가세요.

**왜 그렇게 불리나요?**
아무도 이름에 만족하지 않습니다. 동작을 더 정확하게 설명하는 `grill-domain-model`로 이름을 바꾸자는 열린 제안이 있습니다. 아무것도 움직이지 않았습니다. 이름 변경이 도착하면 문서 페이지가 함께 이동하고 URL이 변경됩니다.

## 제대로 작동하는지 확인하는 방법

- `GLOSSARY.md`가 끝에 한 덩어리로 나타나는 것이 아니라 세션 *중에* 용어별로 변경됩니다.
- 용어집은 순수한 어휘(엄격한 정의가 있는 프로젝트의 단어)로 읽히며 구현 세부 사항이나 spec과 유사한 산문을 포함하지 않습니다.
- 코드베이스가 답할 수 있는 질문은 여러분에게 묻는 것이 아니라 코드베이스를 읽어 답변됩니다.
- ADR을 거의 또는 전혀 얻지 못하고, 얻는 것은 다시 논쟁해야 하면 짜증날 결정입니다.
- 기존 용어집이 다르게 정의하기 때문에 사용한 단어에 도전합니다.

## 어디에 적합한가요

`grill-with-docs`는 메인 빌드 체인의 시작입니다:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

spec으로 작성되기 전에 나옵니다. [to-spec](https://aihero.dev/skills-to-spec)이 다시 인터뷰하지 않고 합성하는 공유 이해와 정착된 어휘를 생성합니다. 가까운 이웃은 [grill-me](https://aihero.dev/skills-grill-me)로, 저장소와 파일이 없는 동일한 인터뷰이며, [domain-modeling](https://aihero.dev/skills-domain-modeling)은 구동하는 용어집 및 ADR 규율입니다. 둘 다 인터뷰를 위해 [grilling](https://aihero.dev/skills-grilling) 프리미티브를 사용합니다. 업스트림에서 [wayfinder](https://aihero.dev/skills-wayfinder)는 하나의 세션에 너무 큰 노력을 차트하고 맵의 일부를 다시 전달할 수 있습니다. 어느 스킬 또는 플로우가 적합한지 확실하지 않으면 [ask-matt](https://aihero.dev/skills-ask-matt)가 라우팅합니다.
