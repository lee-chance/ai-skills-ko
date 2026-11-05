# 원칙 이름으로 조향

pstack은 24개의 원칙을 개별 스킬로 제공합니다. `/poteto-mode`는 모든 다단계 작업 시작 시 인덱스를 읽고, 작업이 트리거하는 것들을 적용하고, 적용된 각 원칙을 변경한 결정과 함께 답변에 명명합니다.

원칙을 호출하지 않습니다. 조향하기 위해 이름을 사용합니다. 각 이름은 에이전트가 이미 읽은 완전한 규칙을 가리키므로, 한 구문이 한 단락의 지시사항보다 작업을 더 정확하게 리디렉션합니다.

## 실전 조향

에이전트가 세 개의 기존 어댑터에 새 어댑터를 볼트하려고 한다고 말하세요:

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

빌드가 통과했기 때문에 성공을 주장한다고 말하세요:

```text
apply prove it works. run the real import flow and show me the written records.
```

두 개의 병렬 시도가 동일한 브랜치에 작성하려고 한다고 말하세요:

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

각 구문은 그 뒤의 규칙이 구체적이기 때문에 착지합니다. 에이전트는 여전히 답변에서 규칙이 변경한 결정을 말해야 합니다. 뒤에 결정이 없는 원칙 인용은 에이전트가 적용하지 않고 규칙을 명명했다는 의미입니다.

## 24개, 간략히

핵심 원칙은 얼마나 많이 빌드할지 그리고 언제 설계를 재고할지 결정합니다:

- [Laziness Protocol](../../skills/principle-laziness-protocol/SKILL.md)은 삭제와 문제를 해결하는 가장 작은 변경을 선호합니다.
- [Foundational Thinking](../../skills/principle-foundational-thinking/SKILL.md)은 로직을 작성하기 전에 핵심 데이터 구조를 선택합니다.
- [Redesign from First Principles](../../skills/principle-redesign-from-first-principles/SKILL.md)는 첫날부터 있었던 것처럼 새 요구사항을 통합합니다.
- [Attack the Premise](../../skills/principle-attack-the-premise/SKILL.md)는 둘 이상의 실패한 수정이 공유한 전제를 기록하고 다음 수정 전에 직접 테스트합니다.
- [Subtract Before You Add](../../skills/principle-subtract-before-you-add/SKILL.md)는 그 위에 빌드하기 전에 데드 웨이트를 제거합니다.
- [Minimize Reader Load](../../skills/principle-minimize-reader-load/SKILL.md)는 독자가 머릿속에 보유해야 하는 레이어와 숨겨진 상태를 접습니다.
- [Outcome-Oriented Execution](../../skills/principle-outcome-oriented-execution/SKILL.md)는 일회용 호환성 상태를 보존하는 대신 대상 설계로 재작성을 수렴합니다.
- [Experience First](../../skills/principle-experience-first/SKILL.md)는 구현 편의성보다 사용자의 결과를 선택합니다.
- [Exhaust the Design Space](../../skills/principle-exhaust-the-design-space/SKILL.md)는 선례가 없을 때 두세 개의 경쟁하는 프로토타입을 빌드합니다.
- [Build the Lever](../../skills/principle-build-the-lever/SKILL.md)는 작업을 수행하거나 증명하는 스크립트를 빌드하여, 리뷰어가 재실행할 수 있습니다. 에이전트가 손으로 동일한 것을 계속 수행할 때, 그것이 원했을 도구나 스킬을 작성하도록 하세요. 스크립트가 매번 같은 방식으로 단계를 수행할 수 있으면, 스크립트를 사용하고, 판단 호출을 위해 에이전트를 저장하세요.

아키텍처 원칙은 상태, 검증, 호환성이 어디에 있는지 결정합니다:

- [Model the Domain](../../skills/principle-model-the-domain/SKILL.md)는 흩어진 조건문이 아니라 하나의 구조에 반복된 규칙을 인코딩합니다.
- [Boundary Discipline](../../skills/principle-boundary-discipline/SKILL.md)는 경계에서 검증하고 내부 타입을 신뢰합니다.
- [Type System Discipline](../../skills/principle-type-system-discipline/SKILL.md)는 불법 상태를 표현 불가능하게 만듭니다.
- [Make Operations Idempotent](../../skills/principle-make-operations-idempotent/SKILL.md)는 재시도를 동일한 최종 상태로 수렴합니다.
- [Migrate Callers Then Delete Legacy APIs](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md)는 한 웨이브에서 마이그레이션하고 삭제합니다.
- [Separate Before Serializing Shared State](../../skills/principle-separate-before-serializing-shared-state/SKILL.md)는 조정을 추가하기 전에 공유를 제거합니다.

검증 원칙은 무엇이 증거로 계산되는지 정의합니다:

- [Prove It Works](../../skills/principle-prove-it-works/SKILL.md)는 프록시가 아니라 실제 아티팩트를 검증합니다.
- [Fix Root Causes](../../skills/principle-fix-root-causes/SKILL.md)는 코드를 변경하기 전에 원인을 재현하고 추적합니다.
- [Sequence Work into Verifiable Units](../../skills/principle-sequence-verifiable-units/SKILL.md)는 다음을 시작하기 전에 각 작은 단위를 체크로 끝냅니다.
- [Test Behavior, Not Implementation](../../skills/principle-test-behavior-not-implementation/SKILL.md)는 코드의 사용자가 관찰할 수 있는 것을 주장하므로, 그 동작이 깨질 때 테스트가 실패하고 내부 변경에서 살아남습니다.
- [Explain the Number](../../skills/principle-explain-the-number/SKILL.md)는 측정된 숫자를 제한하는 것을 명명하고 다른 것을 측정했다는 것을 배제한 후, 누구든지 그것을 신뢰하거나 보고하기 전에. [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)는 실제 실행에서 답하는 7개의 질문으로 바꿉니다.

위임 원칙은 병렬 작업을 온전하게 유지합니다:

- [Guard the Context Window](../../skills/principle-guard-the-context-window/SKILL.md)는 대량 읽기를 서브에이전트로 라우팅하고 발견을 메인 채팅에 유지합니다.
- [Never Block on the Human](../../skills/principle-never-block-on-the-human/SKILL.md)는 되돌릴 수 있는 작업을 진행하고 결과를 제시합니다.

그리고 하나의 메타 원칙:

- [Encode Lessons in Structure](../../skills/principle-encode-lessons-in-structure/SKILL.md)는 두 번 반복한 조언을 lint, 체크 또는 스크립트로 바꿉니다. [`/correct`](../../skills/correct/SKILL.md)는 [당신의 것으로 만들기](./09-make-it-yours.md#fix-the-environment-with-correct)에 표시된 대로 전체 리포에 적용합니다.

리스트를 외우지 마세요. 지금 훑어보고, 여기 이름이 방지했을 것을 에이전트가 하는 것을 잡을 때 다시 오세요. 그것이 어휘가 고착되는 방법입니다.

다음: [당신의 것으로 만들기](./09-make-it-yours.md).
