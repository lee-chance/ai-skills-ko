## 무엇을 하나요

`code-review`는 여러분이 지정한 고정 지점(커밋, 브랜치, 태그, `main`, `HEAD~5`)과 `HEAD` 사이의 diff를 두 축을 따라 검토합니다. **Standards**는 코드가 이 저장소가 코드를 작성하는 방식을 따르는지 묻습니다. **Spec**은 코드가 원래 이슈 또는 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)이 요청한 것을 수행하는지 묻습니다. 각 축은 자체 [서브에이전트](https://www.aihero.dev/ai-coding-dictionary/subagent)에서 실행되므로 어느 쪽도 다른 쪽의 추론을 보지 못합니다.

스킬은 두 축을 병합하거나 순위를 재조정하지 않습니다. 리포트는 *축당* 최악의 이슈로 끝나며 그들 사이에서 단일 승자를 지목하는 것을 거부합니다. 변경 사항은 한 축을 통과하고 다른 축을 실패할 수 있습니다. 모든 규칙을 따르지만 잘못된 것을 구현하는 코드는 Standards를 통과하고 Spec을 실패합니다. [티켓](https://www.aihero.dev/ai-coding-dictionary/ticket)이 요청한 것을 정확히 수행하지만 저장소의 규칙을 위반하는 코드는 그 반대입니다. 혼합된 판정은 통과하는 축이 실패하는 축을 숨기도록 합니다.

## 언제 사용하나요

`/code-review`를 입력하거나, 브랜치, PR, 진행 중인 작업 또는 "X 이후" 무엇이든 검토하도록 요청하면 에이전트가 자동으로 이를 찾습니다.

| 여러분의 상황 | 찾아야 할 것 |
| --- | --- |
| diff가 존재하고 올바르게 빌드되었는지 *그리고* 올바른 것인지 알고 싶습니다 | `code-review` |
| diff에서 버그를 찾고 싶습니다: null 경로, 경쟁 상태, off-by-one | 이것이 아니라 Claude Code 자체 내장 리뷰 (아래 이름 충돌 참조) |
| 아직 작성되지 않았고 테스트 우선으로 작성하고 싶습니다 | [tdd](https://aihero.dev/skills-tdd) |
| 전체 spec을 빌드해야 하며, 리뷰 포함 | [implement](https://aihero.dev/skills-implement), 이것이 이 스킬을 스스로 호출합니다 |
| 하나의 diff가 아니라 전체 코드베이스가 표류했습니다 | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| 무언가가 깨졌고 이유를 모릅니다 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

고정 지점을 제공해야 합니다. 제공하지 않으면 스킬은 추측하는 대신 하나를 요청합니다. 무언가를 생성하기 전에 ref가 해결되고 diff가 비어 있지 않은지 확인하므로, 잘못 입력된 브랜치 이름은 두 개의 서브에이전트 내부가 아니라 여러분 앞에서 실패합니다.

## 전제 조건

Standards 축은 아무것도 필요하지 않습니다. 저장소가 문서화한 것(`CODING_STANDARDS.md`, `CONTRIBUTING.md` 등)을 읽고 저장소가 아무것도 문서화하지 않았을 때 내장 베이스라인으로 대체합니다.

Spec 축은 spec이 존재하고 찾을 수 있어야 합니다. 다음 순서로 찾습니다:

1. 커밋 메시지의 이슈 참조(`#123`, `Closes #45`, GitLab `!67`), 트래커 문서를 통해 가져옵니다.
2. 인수로 전달하는 경로.
3. 브랜치 또는 기능 이름과 일치하는 `docs/`, `specs/` 또는 `.scratch/` 아래의 spec 파일.
4. 여러분에게 묻습니다.

1단계는 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)가 작성하는 트래커 문서에 의존합니다. 그것 없이도 경로를 제공하면 축이 작동합니다. spec이 전혀 없으면 스킬은 Spec 서브에이전트를 건너뛰고 리포트는 요구 사항을 발명하는 대신 "spec을 사용할 수 없음"이라고 말합니다.

## 두 개의 축

| | Standards | Spec |
| --- | --- | --- |
| 질문 | 올바르게 빌드되었나요? | 올바른 것인가요? |
| 읽는 것 | 저장소의 문서화된 표준, 그리고 냄새 베이스라인 | 원래 이슈 또는 spec |
| 보고하는 것 | 문서화된 위반(강제될 수 있음), 그리고 냄새(항상 판단 호출) | 누락되거나 부분적인 요구 사항, 범위 확대, 잘못 구현된 요구 사항 |
| 모든 발견 사항이 인용하는 것 | 표준 파일과 규칙, 또는 명명된 냄새와 덩어리 | spec의 줄 |

이 설계는 여러분의 표준을 모르는 일반적인 리뷰 스킬을 피하기 위해 존재합니다. 그러한 스킬은 여러분의 코드베이스에서 의도적인 것을 플래그하고 코드베이스가 의존하는 불변성을 놓칩니다. 따라서 저장소 자체 문서는 Standards 축의 [1차 소스](https://www.aihero.dev/ai-coding-dictionary/primary-source)이며, **저장소가 항상 오버라이드합니다**.

**냄새 베이스라인**은 저장소의 표준 아래에 있습니다. Fowler의 _Refactoring_ 3장의 12가지 코드 냄새입니다: Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man, Refused Bequest. 각각은 레이블이 지정된 휴리스틱("가능한 Feature Envy")이며, 절대 강제 위반이 아닙니다. 각각은 냄새가 무엇이고 수정하는 방법을 명시하므로, 발견 사항에는 불만만이 아니라 수정이 첨부됩니다. 두 축 모두 여러분의 린터가 이미 강제하는 것은 건너뜁니다.

## 자주 묻는 질문

**Claude Code 자체 `/code-review`와 충돌합니다. 어떻게 해야 하나요?**

이것은 스킬에 대해 가장 많이 보고된 문제이며 수정되지 않았습니다. Claude Code는 다른 것을 하는 자체 `/code-review`를 제공합니다: 이것이 spec 준수 및 저장소 표준을 확인하는 곳에서 diff의 버그를 찾습니다. 이 라이브러리를 설치하면 하나가 이기며, 어느 것이 이기는지는 설치 방법에 따라 다릅니다:

- **Plugin marketplace.** 모든 스킬에는 `mattpocock-skills:` 접두사가 붙고 내장은 정규화되지 않은 이름으로 도달하기 어렵게 됩니다.
- **Plain skills install.** 로컬 파일이 이기고 이 스킬이 내장을 그림자로 만듭니다.

한 가지 답은 Claude Code의 내장 스킬을 완전히 제거하는 것입니다. 그것은 많은 [컨텍스트](https://www.aihero.dev/ai-coding-dictionary/context)를 절약하고 충돌은 중요하지 않게 됩니다. 그림자 자체는 Claude Code [하네스](https://www.aihero.dev/ai-coding-dictionary/harness) 버그라고 할 수 있습니다(스킬 저자는 스킬 이름을 무엇이든 자유롭게 지정할 수 있어야 함). 따라서 다른 답은 로컬 사본의 이름을 바꾸는 것입니다. `npx skills update`는 frontmatter에 대한 편집 또는 이름이 변경된 디렉토리를 취소합니다. 사용자가 보고하는 지속 가능한 해결 방법은 스킬을 새 이름으로 포크하고 관리 세트에서 `code-review`를 제거하는 것입니다. 수동으로 재동기화할 수 있도록 포크한 커밋에 대한 메모를 유지하세요.

**서브에이전트가 `/code-review`를 계속 호출하고 더 많은 에이전트를 생성합니다.**

이것은 알려진 열린 버그입니다. 여러 사람이 하나 이상의 하네스에서 이를 재현했습니다. Standards 및 Spec 프롬프트는 위임을 금지하지 않으므로 서브에이전트는 스킬을 다시 찾고 다시 펼칠 수 있습니다. 한 보고서는 50개 이상의 에이전트에 도달했습니다. 사람들이 포크에 적용한 수정은 두 서브에이전트 브리프에 추가된 한 줄입니다: "`/code-review`를 호출하거나 추가 에이전트를 생성하지 마세요: 이 리뷰를 직접 수행하세요." 일부는 하네스 수준에서 처리하여 모든 스킬이 가드를 상속하도록 하는 것을 선호합니다. 둘 다 아직 출시된 스킬에는 없습니다. 무인으로 실행하는 경우 에이전트 수를 주시하세요.

**코드를 작성한 [세션](https://www.aihero.dev/ai-coding-dictionary/session)에서 실행해야 하나요?**

새 것을 선호하세요. 한 독자가 말했듯이: "자체를 검토하는 동일한 컨텍스트는 리뷰가 아니라 슬래시 명령이 있는 확증 편향입니다." 작성 세션에서 검토하는 에이전트는 코드를 형성한 모든 가정을 컨텍스트에 가지고 있습니다. 독립적인 검토자는 해당 컨텍스트를 가지지 않을 것입니다. 이것이 사람들이 내장 리뷰 단계 없이 [implement](https://aihero.dev/skills-implement)를 요청하는 이유이기도 합니다. 해당 단계는 방금 diff를 작성한 세션 내에서 리뷰를 실행하기 때문입니다. 독립적인 버전은 깨끗한 세션에서 직접 `/code-review`를 호출하는 것입니다.

**모든 티켓 후에, 아니면 끝에 한 번?**

둘 다 작동하며 스킬은 여러분을 위해 결정하지 않습니다. 티켓당은 각 diff를 충분히 작게 유지하여 Spec 축이 확인할 명확한 하나의 spec을 가지도록 하며, 이것이 `implement`가 사용하는 모드입니다. 브랜치 끝으로 일괄 처리하면 티켓당 통과가 각각 놓치는 티켓 간 상호 작용을 포착합니다. 확실하지 않으면 티켓당 검토하고 브랜치 지점에 대해 최종 통과를 한 번 실행하세요.

**발견 사항을 신뢰할 수 있나요?**

확인하지 않고는 안 됩니다. 서브에이전트 출력은 가설이지 증거가 아닙니다. 한 팀은 산문 기반 리뷰가 놓친 12개의 브레이킹 체인지를 보고했습니다. 스킬은 두 리포트를 있는 그대로 또는 가볍게 정리하여 결합합니다. 파일에 대해 각 주장을 재확인하지 않으므로 발견 사항은 잘못된 위치를 인용하거나 영향을 과장할 수 있습니다. 조치하기 전에 각 발견 사항의 인용을 읽으세요. 스킬은 모든 발견 사항이 인용(표준 규칙, 냄새와 덩어리, 또는 spec 줄)을 가지도록 요구하며, 그것이 발견 사항을 확인 가능하게 만드는 것입니다.

**실행할 때마다 매번 새로운 문제를 찾는 이유는 무엇인가요?**

각 수정은 검토할 새 코드를 추가하고 Standards 축의 판단 호출 절반은 실행마다 다른 결과를 제공합니다. 한 독자가 루프를 설명했습니다: "/code-review와 /improve-code-architecture는 항상 매번 새로운 것을 찾습니다. 수정을 구현하고 이러한 스킬을 다시 실행하고 계속 반복합니다." 수렴 보장이 없습니다. 통과를 리드 목록으로 취급하세요. 인용된 규칙이 있는 것에 대해 조치한 다음 중지하세요. 깨끗하게 돌아올 때까지 루프에서 실행하지 마세요. 절대 그렇게 되지 않기 때문입니다.

**커밋되지 않은 작업을 검토하나요?**

아니요. `<fixed-point>...HEAD`를 diff합니다. 세 점 형식은 merge-base에서 측정하고 스테이징 및 작업 트리 변경 사항을 제외합니다. `implement`가 중간 커밋을 만들지 않았다면 리뷰는 다음 커밋에 들어갈 작업을 볼 수 없습니다. 먼저 커밋하고 검토한 다음 수정하거나 픽스업을 추가하세요.

## 제대로 작동하는지 확인하는 방법

- 서브에이전트가 생성되기 전에 잘못된 ref 또는 빈 diff에서 시작을 거부합니다.
- 리포트는 하나의 병합된 목록이 아니라 `## Standards` 및 `## Spec` 아래 두 개의 별도 블록으로 도착합니다.
- 모든 Standards 발견 사항은 저장소 파일 중 하나의 규칙 또는 12가지 냄새 중 하나를 덩어리와 함께 인용하여 지목합니다. 모든 Spec 발견 사항은 spec의 줄을 인용합니다.
- 마감 요약은 축당 최악의 이슈를 제공하고 전체 승자를 선택하는 것을 거부합니다.
- spec을 사용할 수 없으면 Spec 블록은 코드에서 추론한 요구 사항을 나열하는 대신 그렇게 말합니다.

## 어디에 적합한가요

`code-review`는 빌드 체인의 끝 근처에 있는 리뷰 단계입니다: `grill-with-docs → to-spec → to-tickets → implement → code-review → retro`. 또한 지시하는 모든 브랜치 또는 PR에서 독립적으로 서 있습니다.

- [implement](https://aihero.dev/skills-implement)는 가장 가까운 이웃입니다. 빌드를 구동하고 커밋하기 전에 자체 마감 리뷰로 이 스킬을 호출합니다. [implement-spec](https://aihero.dev/skills-implement-spec)은 전체 통합 브랜치에 대해 한 번 동일하게 수행합니다.
- [retro](https://aihero.dev/skills-retro)는 그 후에 나오며 조정합니다. 세션이 리뷰가 실수 클래스를 놓치는 것을 보여주면 `retro`는 Standards 축이 읽는 검사 또는 `CODING_STANDARDS.md` 규칙을 제안합니다.
- [pr](https://aihero.dev/skills-pr)는 검토된 작업이 올라가면 풀 리퀘스트 본문을 작성합니다.
- [to-spec](https://aihero.dev/skills-to-spec) 및 [to-tickets](https://aihero.dev/skills-to-tickets)는 Spec 축이 확인하는 문서를 생성하므로 모호한 spec은 해당 축을 모호하게 만듭니다.
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)는 전체 코드베이스 상대입니다. 이 스킬은 하나의 diff만 봅니다.

어느 스킬이 상황을 원하는지 확실하지 않으면 [ask-matt](https://aihero.dev/skills-ask-matt)가 전체 세트를 라우팅합니다.
