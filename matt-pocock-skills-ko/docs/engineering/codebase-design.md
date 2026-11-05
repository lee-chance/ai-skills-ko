## 무엇을 하나요

`codebase-design`은 모듈을 설계하는 데 사용하는 단어를 고정합니다: **module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**. 각각을 정확하게 정의하고 느슨한 대체어("component", "service", "API", "boundary")를 금지하며, 이들에서 따르는 소수의 원칙을 명시합니다.

이것은 프로세스가 아니라 참조입니다. 루프를 실행하지 않고, 아티팩트를 생성하지 않으며, 질문하기 위해 멈추지 않습니다. 설계를 다루는 다른 모든 스킬은 이 어휘를 사용합니다. 단독으로는 단어를 제공하고 멈춥니다. 호출하기 전에 이것을 알아두세요. 프로세스도 중지 규칙도 없는 스킬에 [세션](https://www.aihero.dev/ai-coding-dictionary/session)을 지시하고 "가세요"라고 말하면 에이전트는 프로세스를 발명합니다. 아래 질문은 그것이 어떻게 보이는지 보여줍니다.

## 언제 사용하나요

`/codebase-design`을 입력하거나, 설계 작업이 적합할 때 에이전트가 자동으로 이를 찾습니다.

재설계하는 코드를 이미 알고 있고 그 형태에 대해 생각해야 할 때 사용하세요: 심이 어디로 가는지, 인터페이스가 얼마나 작아질 수 있는지, 추출이 호출자로부터 복잡성을 제거하는지. 설계 단어가 무엇을 의미하는지에 대한 논쟁을 해결하는 데도 사용하세요.

여러 스킬이 이것과 가깝습니다. 가지고 있는 문제로 선택하세요:

| 문제 | 스킬 |
|---|---|
| 하나의 모듈의 형태: 인터페이스, 심, 깊이 | `codebase-design` |
| *도메인의 단어*: "account"는 세 가지를 의미하고, 두 사람이 "cancellation"으로 다른 것을 의미합니다 | [domain-modeling](https://aihero.dev/skills-domain-modeling) |
| 재설계할 *어느* 모듈인지 아직 모릅니다 | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) (후보를 찾는 조사) |
| 단지 명명되는 것이 아니라 논쟁되는 설계를 원합니다 | [grilling](https://aihero.dev/skills-grilling) |
| 빌드할 구체적인 동작이 있고 리팩토링에서 살아남는 테스트를 원합니다 | [tdd](https://aihero.dev/skills-tdd) |

## 어휘

용어집이 스킬입니다. 스킬은 모든 용어를 다른 것과 비교하여 정의하고 각각에 대체하는 단어를 제공합니다.

| 용어 | 의미 | 사용하지 말 것 |
|---|---|---|
| **Module** | 인터페이스와 구현이 있는 모든 것. 의도적으로 규모 불가지론적: 함수, 클래스, 패키지, 계층에 걸친 슬라이스. | unit, component, service |
| **Interface** | 호출자가 올바르게 사용하기 위해 알아야 하는 모든 것: 타입 시그니처, 그리고 불변성, 순서 제약 조건, 오류 모드, 필수 구성, 성능 특성. | API, signature |
| **Depth** | 인터페이스에서의 레버리지: 호출자나 테스트가 배워야 하는 인터페이스 단위당 행사할 수 있는 동작의 양. **Deep**: 작은 인터페이스 뒤에 많은 동작. **Shallow**: 인터페이스가 구현만큼 거의 복잡합니다. | none |
| **Seam** | Michael Feathers의 용어: 그 장소에서 편집하지 않고 동작을 변경할 수 있는 장소. 인터페이스의 *위치*이며, 어디에 놓을지는 그 뒤에 무엇이 가는지와는 별개의 자체 결정입니다. | boundary |
| **Adapter** | 심에서 인터페이스를 만족시키는 구체적인 것. 종류가 아니라 역할을 지목합니다: 인메모리 페이크와 Postgres 저장소는 둘 다 어댑터입니다. | none |
| **Leverage** | 호출자가 깊이로부터 얻는 것: 배운 인터페이스 단위당 더 많은 능력. | none |
| **Locality** | 유지관리자가 깊이로부터 얻는 것: 변경 사항, 버그 및 검증이 한 곳에 머무르므로 하나의 수정이 모든 호출자를 포함합니다. | none |

스킬은 깊이를 구현 줄 대 인터페이스 줄의 비율로 정의하지 *않습니다*. 이것은 Ousterhout 자신의 정의입니다. 그 메트릭은 구현을 패딩하는 것에 보상하므로 스킬은 대신 레버리지로서의 깊이를 사용합니다.

## 네 가지 원칙

- **깊이는 구현이 아니라 인터페이스의 속성입니다.** 깊은 모듈은 내부적으로 작고 교체 가능한 부분으로 빌드될 수 있습니다. 호출자는 그것을 보지 못할 뿐입니다. 모듈은 자체 테스트가 사용하는 내부 심과 인터페이스에 하나의 외부 심을 가질 수 있습니다.
- **삭제 테스트.** 모듈을 삭제한다고 상상하세요. 복잡성이 사라지면 모듈은 통과였습니다. N개의 호출자에 걸쳐 다시 나타나면 모듈은 실제 복잡성을 숨기고 있었습니다.
- **인터페이스는 테스트 표면입니다.** 호출자와 테스트는 동일한 심을 넘습니다. 인터페이스를 *넘어서* 테스트하고 싶다면 모듈의 형태가 잘못된 것입니다.
- **하나의 어댑터는 가상의 심을 의미합니다. 두 개의 어댑터는 실제 심을 의미합니다.** 무언가가 그것을 가로질러 변할 때까지 심을 자르지 마세요. 단일 어댑터 심은 그저 간접입니다.

두 개의 지원 파일이 더 나아가며, 스킬은 미리가 아니라 요청 시 읽습니다. [DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md)는 후보의 의존성을 네 가지 범주(in-process, local-substitutable, remote-but-owned, true-external)로 분류합니다. 범주가 심을 가로질러 심화된 모듈을 테스트하는 방법을 결정하기 때문입니다. [DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md)는 동일한 모듈에 대해 세 개 이상의 근본적으로 다른 인터페이스를 생성하기 위해 병렬 [서브에이전트](https://www.aihero.dev/ai-coding-dictionary/subagent)를 시작한 다음 깊이, 지역성 및 심 배치에 대해 비교합니다.

## 자주 묻는 질문

**TypeScript에서 실제로 깊은 모듈을 어떻게 빌드하나요?**

이것은 스킬에 대해 가장 자주 묻는 질문이며 스킬은 이에 답하지 않습니다. 깊은 모듈이 무엇인지 *정의*합니다. 인터페이스를 넘어 도달하는 길잃은 import를 중지하는 방법에 대해서는 아무 말도 하지 않습니다. [이슈 #458](https://github.com/mattpocock/skills/issues/458)은 명확하게 말했습니다: "인터페이스에 만족하고, 세부 사항을 숨기고 등등이라고 가정해 봅시다. 하지만 어떻게 강제하나요? 린팅이나 명확한 가드레일 없이는 시간이 지남에 따라 사람과 LLM 모두 지저분하게 만들기 시작할 것이라고 생각합니다." 해당 스레드의 답은 세 가지 옵션을 제공했습니다: 클래스 또는 IIFE로 래핑하고 클래스가 거대해지는 것을 수용합니다. 모노레포의 패키지로 만들고 모노레포 도구를 수용합니다. 또는 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)와 같은 린터를 사용하여 인터페이스를 우회하는 import를 금지합니다. 이러한 메커니즘 중 Effect가 최선이고 dependency-cruiser가 두 번째입니다. 저장소의 `in-progress/` 버킷에 `src/packages/<name>/index.ts` 규칙을 정하는 `setup-ts-deep-modules` 스킬이 있지만, 문서 페이지가 없는 베타 채널 스킬이며 린트 규칙을 제공하지 않습니다.

**세션을 지시했는데 요청하지 않은 것을 재설계하는 데 100k [토큰](https://www.aihero.dev/ai-coding-dictionary/token)을 소모했습니다.**

이것은 [이슈 #449](https://github.com/mattpocock/skills/issues/449)로 제출된 알려진 문제입니다. 스킬은 모델 호출이며 스스로를 어휘로 설명하지만, 에이전트가 이를 실행 가능한 프로세스로 취급하는 것을 강제로 중지하는 것은 없습니다. "/codebase-design에서 재개하고 열린 결정을 구동하라"고 지시받은 에이전트는 프로세스에 가장 가까운 스킬 부분을 선택했습니다: `DESIGN-IT-TWICE.md`의 병렬 서브에이전트. 이전 세션이 이미 매핑한 코드를 재탐색하고 질문하기 전에 오랫동안 작업했습니다. 이 스킬에는 드라이버 스킬이 가진 가드레일(체크포인트, 한 번에 하나의 질문, 자동 진행 없음)이 없습니다. 참조이기 때문입니다. 해결 방법은 드라이버 스킬(`/grill-with-docs`, `/improve-codebase-architecture` 또는 `/tdd`)을 호출하고 `codebase-design`을 어휘로 사용하는 것입니다. 이슈는 열려 있습니다.

**`design-an-interface`는 어디로 갔나요? 그리고 `/interface-design` 스킬이 있나요?**

이 스킬이 `design-an-interface`를 대체하고 그 내용을 인수받았습니다. 누락된 것이 없습니다. "design it twice" 기법(Ousterhout의 근본적으로 다른 설계를 생성하는 병렬 서브에이전트)은 여기서 `DESIGN-IT-TWICE.md`로 제공됩니다. 별도로, 여러 사람이 깊은 모듈/얇은 인터페이스 철학을 위한 전용 `/interface-design` 스킬을 요청했습니다. 이 스킬은 이미 해당 철학을 다루고 있으며 별도의 스킬은 계획되지 않았습니다. 둘 중 하나의 이름을 찾아왔다면 이것이 페이지입니다.

**이것은 폴더, 배럴 파일, 기능 슬라이스와 같은 파일 구조 규칙이 아닌가요?**

아니요. 사람들은 여러 번 이것에 반발했지만 스킬은 변경되지 않았습니다. [이슈 #95](https://github.com/mattpocock/skills/issues/95)는 깊은 모듈의 구체적인 구현으로 공식화된 프랙탈 트리 파일 구조를 제안했습니다. 답변은 둘이 독립적이라는 것이었습니다: "깊은 모듈은 파일 시스템이 어떻게 보이든 상관없이 인터페이스의 설계와 엄격한 인터페이스를 통한 액세스에 관한 것입니다. 이 접근 방식으로 얕은 모듈을 가질 수 있는 것이 완전히 가능해 보입니다." #458에서도 동일하게 나왔습니다: "모듈의 개념을 파일 시스템에 너무 밀접하게 연결하고 있는 것 같습니다. 파일 시스템은 확실히 모듈의 형태에 대한 유용한 힌트가 될 수 있지만 깊은 모듈의 구성에서 파일 시스템을 사용할 필요는 없습니다." 용어집은 **module**을 의도적으로 규모 불가지론적으로 정의합니다.

**`tdd`가 실제로 이 어휘를 사용하나요?**

지금은 사용하지만 오랫동안 그렇지 않았습니다. v1.0은 이 공유 스킬을 위해 `tdd`에서 인라인 깊은 모듈 노트를 제거했지만, 아무도 그것을 대체할 포인터를 추가하지 않았으므로 `tdd`는 스스로를 위해 "seam"을 정의하고 아무것도 참조하지 않았습니다. 포인터는 이제 `tdd`에 있으며, 열린 질문이 테스트가 아니라 인터페이스의 형태일 때 에이전트가 이를 따릅니다. `tdd`는 여전히 *테스트*하는 경계로서 "seam"을 소유합니다. 이 스킬은 그 뒤의 모듈 형태를 소유합니다.

**design-it-twice 패턴은 Claude Code 외부에서 작동하나요?**

깨끗하게는 아닙니다. `DESIGN-IT-TWICE.md`는 "Agent 도구를 사용하여 병렬로 3개 이상의 서브에이전트를 생성"이라고 말하며, "Agent"는 Claude Code [도구](https://www.aihero.dev/ai-coding-dictionary/tool)의 이름입니다. 저장소는 Codex를 포함한 다른 [하네스](https://www.aihero.dev/ai-coding-dictionary/harness)에 대한 메타데이터를 제공하며, 그 이름을 가진 도구가 없을 수 있습니다. 따라서 병렬 설계 단계는 스킬의 메타데이터가 제안하는 것보다 덜 이식 가능합니다. [이슈 #564](https://github.com/mattpocock/skills/issues/564)가 이를 추적하며 열려 있습니다.

**용어집에 connascence, 모듈 비밀, [progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)와 같은 자신의 개념을 추가할 수 있나요?**

사람들은 그것들을 제안했습니다. [이슈 #180](https://github.com/mattpocock/skills/issues/180)은 심을 가로질러 *무엇이* 누출되는지에 대한 명명 계층으로 Parnas의 모듈 비밀과 Page-Jones의 connascence를 추가하며 작동하는 diff가 첨부되어 있습니다. [이슈 #303](https://github.com/mattpocock/skills/issues/303)은 구현 내부에 progressive disclosure를 제안하여 공개 인터페이스에서 깊은 모듈도 내부에 구조를 가지도록 합니다. 둘 다 열려 있고 병합되지 않았습니다. 출시된 용어집은 의도적으로 작으며, 스킬 자체가 이유를 제공합니다: 일관된 언어가 핵심이며, 아무도 일관되게 사용하지 않는 용어는 용어가 없는 것보다 나쁩니다.

## 제대로 작동하는지 확인하는 방법

- 설계 대화가 "component", "service" 및 "boundary"라는 단어를 생성하는 것을 멈추고 "module", "interface" 및 "seam"을 생성하기 시작합니다.
- 누군가가 제안된 추출을 가리키고 망설임 없이 삭제 테스트를 통과하는지 말할 수 있습니다.
- 제안된 심은 첫 번째뿐만 아니라 명명된 두 번째 어댑터와 함께 제공됩니다.
- 인터페이스에 대한 논의는 타입 시그니처뿐만 아니라 불변성, 순서 및 오류 모드를 다룹니다.
- 호출이 세션을 시작하지 않습니다. `/codebase-design`만으로 에이전트가 파일을 읽고 리팩토링을 제안하기 시작하면 참조를 드라이버로 착각한 것입니다.

## 어디에 적합한가요

`codebase-design`은 **언제든지 사용 가능한 스탠드얼론**이며, 체인의 단계가 아니라 엔지니어링 스킬 아래의 어휘 계층입니다. 가장 가까운 이웃은 [domain-modeling](https://aihero.dev/skills-domain-modeling)으로, 모듈의 형태가 아니라 *문제 도메인*의 단어에 대한 병렬 참조입니다. 깊은 모듈의 이름을 잘 짓는 데는 둘 다 필요하므로 일반적으로 함께 원합니다. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)는 다른 것입니다: 심화 후보를 찾기 위해 코드베이스를 조사하고 이 용어집에 모든 후보를 작성하므로 모듈을 찾고 이 스킬의 단어로 설계합니다. 어느 스킬 또는 플로우가 적합한지 확실하지 않으면 [ask-matt](https://aihero.dev/skills-ask-matt)가 라우팅합니다.
