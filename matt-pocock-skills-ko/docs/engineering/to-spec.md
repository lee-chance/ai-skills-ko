## 무엇을 하는가

`to-spec`은 방금 나눈 대화를 **[스펙](https://www.aihero.dev/ai-coding-dictionary/spec)**으로 바꾸고, 이슈 트래커에 단일 이슈로 게시합니다.

인터뷰하지 않습니다. 사용할 때 결정은 이미 끝났습니다. 따라서 알려진 것(스레드, 코드베이스, `GLOSSARY.md`, ADR에서)을 종합하고 새로운 질문 라운드를 시작하지 않습니다. 스펙은 이미 내린 결정을 기록합니다. 새로운 결정을 내리는 곳이 아닙니다.

## 언제 사용하는가

`/to-spec`을 입력하여 호출합니다. [에이전트](https://www.aihero.dev/ai-coding-dictionary/agent)는 스스로 사용하지 않습니다.

빌드가 하나의 에이전트 [세션](https://www.aihero.dev/ai-coding-dictionary/session)에 너무 커서 여러 개로 나눠야 할 때 사용하세요. 이것이 전체 트리거입니다:

| 현재 상황 | 실행할 것 |
| --- | --- |
| 아직 아무것도 결정하지 않음 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 먼저 |
| 결정했고, 작업이 하나의 [컨텍스트 윈도우](https://www.aihero.dev/ai-coding-dictionary/context-window)에 맞음 | [implement](https://aihero.dev/skills-implement): 스펙 건너뜀 |
| 결정했고, 작업이 여러 세션에 걸침 | `/to-spec`, 그 다음 [to-tickets](https://aihero.dev/skills-to-tickets) |
| [wayfinder](https://aihero.dev/skills-wayfinder) 맵이 완료됨 | `/to-spec #<map_issue>` |

## 전제 조건

`to-spec`은 스펙을 이슈로 게시하므로, [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)가 먼저 이 리포에 대한 트래커와 triage-label 어휘를 구성해야 합니다. 두 종류의 트래커 모두 작동합니다: GitHub 같은 실제 트래커, 또는 추가 설정 없이 작동하는 `.scratch/` 아래의 로컬 markdown 파일.

## 스펙은 결정 기록입니다

스펙은 컨텍스트 윈도우가 끝나기 때문에 존재합니다. [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)하는 동안 많은 것을 해결했습니다: 솔루션의 형태, 여러분이 논의한 선택, 그리고 의도적으로 거부한 것. 그 모든 것이 곧 지우려고 하는 하나의 대화에 있습니다. 스펙은 그것을 유지합니다.

따라서 스펙은 어떤 것도 검증하거나 결정하지 않습니다. 여러분이 결정한 것을 여러분 프로젝트 자체 어휘로 기록하므로, 새 세션이 여러분이 다시 설명하지 않고도 작업을 이어갈 수 있습니다. 스펙이 여러분이 절대 말하지 않은 것을 명시한다면, 그것은 결함입니다.

## 산문 전에 심

무엇이든 작성하기 전에, `to-spec`은 기능이 테스트될 **심**을 스케치하고 여러분과 확인합니다. 새로운 것보다 기존 심을 선호하고, 할 수 있는 가장 높은 심을 선택합니다. 변경에 이상적인 심의 수는 하나입니다.

다른 스킬들이 나중에 그 합의된 심을 사용합니다. [tdd](https://aihero.dev/skills-tdd)는 미리 합의한 심에서만 작동합니다. [code-review](https://aihero.dev/skills-code-review)는 스펙에 대한 diff를 검토하므로, 아무도 합의하지 않은 심은 검토 발견 사항으로 나타납니다. 두 연결 모두 이 문서를 통과합니다. 그래서 여러분은 여기서 심 대화를 진지하게 받아들여야 하며, 구현을 위해 남겨두지 말아야 합니다.

## 자주 묻는 질문

**`/to-prd`는 어디로 갔나요?**
이 스킬이며, v1.1에서 이름이 바뀌었습니다. "Spec"은 이제 전체적으로 사용되는 하나의 용어이며, 오래된 `to-prd` 슬러그는 더 이상 작동하지 않으므로 새 이름으로 재설치하세요. 오래된 어휘는 *spec*과 *tickets* 쌍으로 대체됩니다. 스펙은 목적지이며 그것을 고정하는 결정입니다. [티켓](https://www.aihero.dev/ai-coding-dictionary/ticket)은 거기에 도달하는 단계입니다. 방향을 바꾸면 완료되지 않은 티켓을 삭제하고 스펙을 유지하세요.

**왜 스펙에 `ready-for-agent` 레이블이 붙나요? 에이전트가 그것으로 구현하는 것을 원하지 않아요.**
레이블은 "추가 triage 필요 없음"을 의미합니다: 문서가 에이전트가 작업하기에 충분히 완전합니다. 작업 지시서가 아니라 입력을 표시합니다. 하지만 `ready-for-agent`를 폴링하는 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 에이전트는 그 차이를 볼 수 없습니다. 티켓 슬라이스를 선택하는 대신 한 번 실행으로 전체 스펙을 빌드하려고 합니다. 이것이 스킬과 가장 많이 보고된 문제입니다. 변경될 때까지, AFK 에이전트의 프롬프트에서 부모 스펙을 명시적으로 제외하거나, `/to-tickets`가 실행된 후 레이블을 제거하세요.

**grilling에서 `/to-tickets`로 바로 가고 스펙을 건너뛰지 않는 이유는?**
종종 그렇게 해야 합니다. 스펙은 다중 세션 작업에서만 단계의 가치가 있습니다. 그 가치는 티켓은 일회용이고 스펙은 그렇지 않다는 것입니다. 각 티켓은 하나의 새로운 컨텍스트 윈도우에 맞게 크기가 조정된 다음 삭제되거나 닫히지만, 스펙은 그 뒤의 추론을 기록하는 한 곳으로 남습니다. 단일 세션 변경에서는 그것이 아무것도 주지 않으며, [모델](https://www.aihero.dev/ai-coding-dictionary/model)이 흐를 수 있는 추가 종합 단계에 비용을 지불합니다. grilling에서 `/implement`로 가세요.

**방금 wayfinder 맵을 완료했습니다. 무엇을 공급하나요?**
개별 결정 티켓이 아니라 주 맵 이슈 `/to-spec #<map_issue>`를 주세요. [wayfinder](https://aihero.dev/skills-wayfinder)는 맵 전체에 걸쳐 퍼진 결정을 생성하며, 산출물이 아닙니다. `to-spec`은 그것들을 빌드할 수 있는 하나의 문서로 축소합니다. 맵을 `/implement`로 바로 루프하면 그 단계를 잃습니다.

**스펙이 제가 검토하기 위한 것인가요, 아니면 에이전트를 위한 것인가요?**
대부분 에이전트를 위한 것이며, 그렇게 읽힙니다: 완전하고, 밀도가 높고, 참조로 가득 차 있습니다. 심과 범위 밖 섹션을 읽으세요. 그 두 곳에서 잘못된 결정은 지금 잡는 것이 가장 저렴하고 나중에 찾는 것이 가장 비쌉니다. 사람들은 전체를 읽는 것에 대해 불평하며, 요약 모드는 없습니다. 하지만 스펙이 여러분을 놀라게 한다면, grilling이 너무 얕았던 것입니다. 스펙이 너무 긴 것이 아닙니다.

**티켓이 시작되면 스펙을 동결하나요, 아니면 에이전트가 다시 작성하게 하나요?**
아무것도 동기화 상태로 유지하지 않습니다. 실제로 그 순간에 알았던 것의 스냅샷이며, 구현이 처음으로 무언가를 가르쳐주면 시대에 뒤떨어집니다. 작업이 배포된 후 일회용으로 취급하세요. `GLOSSARY.md`와 ADR은 지속되도록 의도된 파일입니다. 구현 중에 지속되어야 할 것을 배우면, 편집된 스펙이 아니라 거기에 넣으세요.

**제 작업은 리팩터나 모듈 경계이지 기능이 아닙니다. 템플릿이 맞나요?**
덜 잘 맞으며, 이것은 알려진 제한 사항입니다. 템플릿은 사용자 스토리에 크게 의존하며, 그것은 아키텍처 작업에 맞지 않습니다. 실제로는 인터페이스와 불변성에 관한 결정 주위에 아무도 요청하지 않은 스토리를 작성하게 됩니다. 대신 implementation-decisions와 testing-decisions 섹션을 사용하세요. 지속되는 아키텍처 결정을 스펙이 아니라 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)를 통해 ADR로 기록하세요.

**관련 작업에 대해 트래커를 확인하거나, 존중하는 ADR을 인용하나요?**
둘 다 아니요. 접촉하는 영역에 대한 ADR을 읽고 따르지만, 링크하지 않습니다. 또한 작성 전에 중복 이슈에 대해 트래커를 검색하지 않으므로, 스펙이 누군가가 이미 제출한 작업을 복제할 수 있고, 아무것도 경고하지 않습니다. 영역이 바쁘다면, 먼저 직접 트래커를 검색하세요.

**`/to-tickets`가 제 스펙을 읽을 수 없었어요: 계속 잘렸어요.**
트래커 이슈는 매우 큰 스펙을 완전히 반환하지 않을 수 있으며, 대신 사용할 로컬 사본이 없습니다. 이것을 수정하려면, `/to-spec`과 `/to-tickets` 사이에 [지우거나](https://www.aihero.dev/ai-coding-dictionary/clearing) [압축](https://www.aihero.dev/ai-coding-dictionary/compaction)하지 마세요. 같은 윈도우에서 실행하면 `/to-tickets`는 스펙을 다시 가져올 필요가 없습니다.

## 제대로 작동한다는 신호

- 새로운 질문 라운드를 묻는 대신 작성을 시작합니다.
- 작성하기 전에 심을 보여주고, 할 수 있는 한 적게 제안합니다.
- 일반적인 제품 관리 보일러플레이트가 아니라 여러분 프로젝트의 명사를 사용합니다.
- 거기서 내린 모든 결정을 기억합니다. 섹션을 채우기 위해 아무것도 발명하지 않았습니다.
- 범위 밖 섹션은 실제 것들을 나열합니다. 여러분이 거부한 것들은 보통 페이지에서 가장 유용한 라인입니다.

## 어디에 적용되는지

`to-spec`은 주 빌드 체인의 단계이지만, 다중 세션 분기에서만입니다:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

업스트림에서 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)는 이 스킬이 기록만 하는 결정을 내리며, 완료된 [wayfinder](https://aihero.dev/skills-wayfinder) 맵이 여기서 체인에 합류합니다. 다운스트림에서 [to-tickets](https://aihero.dev/skills-to-tickets)는 스펙을 [implement](https://aihero.dev/skills-implement)가 빌드할 추적탄 티켓으로 자릅니다. 어떤 스킬이나 흐름이 맞는지 확실하지 않을 때, [ask-matt](https://aihero.dev/skills-ask-matt)가 안내합니다.
