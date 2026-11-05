---
name: using-agent-skills
description: "에이전트 스킬을 찾고 호출합니다. 세션을 시작할 때, 또는 지금 하는 작업에 어떤 스킬이나 워크플로우를 적용할지 정해야 할 때 사용하세요. 다른 모든 스킬을 찾고 호출하는 방식을 관장하는 메타 스킬입니다."
---

# Using Agent Skills

## 개요

Agent Skills는 개발 단계별로 정리된 엔지니어링 워크플로우 스킬 모음입니다. 각 스킬은 시니어 엔지니어가 따르는 구체적인 프로세스를 담습니다. 이 메타 스킬은 현재 작업에 맞는 스킬을 찾고 적용하도록 돕습니다.

## 스킬 찾기

작업이 도착하면 개발 단계를 파악하고 대응하는 스킬을 적용하세요.

```
Task arrives
    │
    ├── Don't know what you want yet? ──────→ interview-me
    ├── Have a rough concept, need variants? → idea-refine
    ├── New project/feature/change? ──→ spec-driven-development
    ├── No quality bar written down? ──→ constraint-driven-development
    ├── Have a spec, need tasks? ──────→ planning-and-task-breakdown
    ├── Implementing code? ────────────→ incremental-implementation
    │   ├── UI work? ─────────────────→ frontend-ui-engineering
    │   ├── API work? ────────────────→ api-and-interface-design
    │   ├── Need better context? ─────→ context-engineering
    │   ├── Need doc-verified code? ───→ source-driven-development
    │   └── Stakes high / unfamiliar code? ──→ doubt-driven-development
    ├── Writing/running tests? ────────→ test-driven-development
    │   └── Browser-based? ───────────→ browser-testing-with-devtools
    ├── Something broke? ──────────────→ debugging-and-error-recovery
    ├── Reviewing code? ───────────────→ code-review-and-quality
    │   ├── Too complex? ─────────────→ code-simplification
    │   ├── Security concerns? ───────→ security-and-hardening
    │   └── Performance concerns? ────→ performance-optimization
    ├── Committing/branching? ─────────→ git-workflow-and-versioning
    ├── CI/CD pipeline work? ──────────→ ci-cd-and-automation
    ├── Deprecating/migrating? ────────→ deprecation-and-migration
    ├── Writing docs/ADRs? ───────────→ documentation-and-adrs
    ├── Adding logs/metrics/alerts? ───→ observability-and-instrumentation
    └── Deploying/launching? ─────────→ shipping-and-launch
```

## 핵심 운영 행동

이 행동은 모든 스킬에 걸쳐 항상 적용됩니다. 타협할 수 없습니다.

### 1. 가정을 드러내세요

사소하지 않은 것을 구현하기 전에 가정을 명시적으로 말하세요.

```
내가 하는 가정:
1. [요구사항에 대한 가정]
2. [아키텍처에 대한 가정]
3. [범위에 대한 가정]
→ 지금 바로잡아 주세요. 그렇지 않으면 이대로 진행합니다.
```

모호한 요구사항을 조용히 채우지 마세요. 가장 흔한 실패는 잘못된 가정을 세우고 확인 없이 밀고 가는 것입니다. 불확실성은 일찍 드러내세요. 다시 하는 것보다 쌉니다.

### 2. 혼란을 적극적으로 다루세요

불일치, 충돌하는 요구사항, 불명확한 스펙을 만나면:

1. **멈추세요.** 추측으로 진행하지 마세요.
2. 구체적인 혼란을 이름 붙이세요.
3. 트레이드오프를 제시하거나 명확히 하는 질문을 하세요.
4. 해결될 때까지 기다린 다음 계속하세요.

**나쁨:** 해석 하나를 조용히 고르고 맞기를 바라는 것.
**좋음:** "스펙에는 X가 있는데 기존 코드에는 Y가 있습니다. 어느 쪽이 우선인가요?"

### 3. 근거가 있으면 반대하세요

무조건 동의하는 존재가 아닙니다. 접근에 분명한 문제가 있으면:

- 문제를 직접 지적하세요
- 구체적인 손해를 설명하세요 (가능하면 수치로. "더 느려질 수 있습니다"가 아니라 "지연 시간이 약 200ms 늘어납니다")
- 대안을 제안하세요
- 사람이 충분한 정보를 갖고 덮어쓰면 그 결정을 받아들이세요

비위 맞추기는 실패 양식입니다. "물론이죠!" 뒤에 나쁜 아이디어를 구현하면 아무도 돕지 못합니다. 정직한 기술적 반대가 거짓 동의보다 가치 있습니다.

### 4. 단순함을 지키세요

본래 경향은 과도하게 복잡하게 만드는 쪽입니다. 적극적으로 저항하세요.

구현을 끝내기 전에 물으세요.
- 더 적은 줄로 할 수 있는가?
- 이 추상화가 그 복잡성을 감수할 만큼 가치가 있는가?
- 스태프 엔지니어가 이것을 보고 "왜 그냥 ...하지 않았지?"라고 말할 것인가?

1000줄을 만들었는데 100줄로 충분했다면 실패한 것입니다. 지루하고 명백한 해법을 선호하세요. 영리함은 비쌉니다.

### 5. 범위 규율을 유지하세요

요청받은 것만 건드리세요.

하지 마세요:
- 이해하지 못한 주석을 제거하기
- 작업과 직교하는 코드를 "정리"하기
- 부작용으로 인접 시스템을 리팩터하기
- 명시적 승인 없이, 쓰이지 않아 보이는 코드를 삭제하기
- "쓸모 있어 보인다"는 이유로 스펙에 없는 기능을 추가하기

할 일은 요청받은 범위만 외과적으로 정확히 건드리는 것입니다.

### 6. 가정하지 말고 검증하세요

모든 스킬에는 검증 단계가 있습니다. 검증이 통과하기 전에는 작업이 완료가 아닙니다. "맞아 보인다"는 결코 충분하지 않습니다. 증거(통과하는 테스트, 빌드 출력, 런타임 데이터)가 있어야 합니다.

스킬별 검증은 국소 확인입니다. 어떤 스킬이 활성인지와 관계없이 *모든* 변경에 적용되는 프로젝트 전체의 기준은 완료 정의입니다. 테스트가 통과하고, 회귀가 없고, 런타임에서 동작이 검증되고, 문서가 업데이트됩니다. `../../references/definition-of-done.md`를 보세요. 이것은 각 작업의 인수 기준을 보완하며, 대체하지 않습니다.

## 피해야 할 실패 양식

생산성처럼 보이지만 문제를 만드는 미묘한 오류입니다.

1. 확인 없이 잘못된 가정을 세움
2. 자신의 혼란을 다루지 않음. 길을 잃었는데도 밀고 감
3. 알아챈 불일치를 드러내지 않음
4. 뻔하지 않은 결정에서 트레이드오프를 제시하지 않음
5. 문제가 분명한 접근에 "물론이죠!"라며 비위를 맞춤
6. 코드와 API를 과도하게 복잡하게 만듦
7. 작업과 직교하는 코드나 주석을 수정함
8. 완전히 이해하지 못한 것을 제거함
9. "뻔하다"는 이유로 스펙 없이 만듦
10. "맞아 보인다"는 이유로 검증을 건너뜀

## 스킬 규칙

1. **작업을 시작하기 전에 적용할 스킬이 있는지 확인하세요.** 스킬은 흔한 실수를 막는 프로세스를 담습니다.

2. **스킬은 제안이 아니라 워크플로우입니다.** 단계를 순서대로 따르세요. 검증 단계를 건너뛰지 마세요.

3. **여러 스킬이 적용될 수 있습니다.** 기능 구현은 `idea-refine` → `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` → `test-driven-development` → `code-review-and-quality` → `code-simplification` → `shipping-and-launch` 순으로 이어질 수 있습니다.

4. **확신이 없으면 스펙부터 시작하세요.** 작업이 사소하지 않고 스펙이 없으면 `spec-driven-development`로 시작하세요.

## 생애주기 순서

완전한 기능의 전형적인 스킬 순서는 다음과 같습니다.

```
1.  interview-me → 사용자가 실제로 원하는 것을 끌어냅니다
2.  idea-refine → 모호한 아이디어를 다듬습니다
3.  spec-driven-development → 무엇을 만드는지 정의합니다
4.  planning-and-task-breakdown → 검증 가능한 덩어리로 나눕니다
5.  context-engineering → 올바른 맥락을 불러옵니다
6.  source-driven-development → 공식 문서와 대조해 확인합니다
7.  incremental-implementation → 조각별로 만듭니다
8.  observability-and-instrumentation → 만드는 동안 계측합니다 (7-9와 병렬로 실행하고, 그 뒤에 하지 않습니다)
9.  doubt-driven-development → 진행 중인 사소하지 않은 결정을 재검토합니다
10. test-driven-development → 각 조각이 동작함을 증명합니다
11. code-review-and-quality → 머지 전에 리뷰합니다
12. code-simplification → 동작을 유지하면서 불필요한 복잡성을 줄입니다
13. git-workflow-and-versioning → 깨끗한 커밋 이력을 만듭니다
14. documentation-and-adrs → 결정을 문서화합니다
15. deprecation-and-migration → 필요할 때 옛 시스템을 은퇴시키고 사용자를 안전하게 옮깁니다
16. shipping-and-launch → 안전하게 배포합니다
```

모든 작업에 모든 스킬이 필요하지는 않습니다. 버그 수정에는 `debugging-and-error-recovery` → `test-driven-development` → `code-review-and-quality`만 필요할 수 있습니다.

## 빠른 참조

| 단계 | 스킬 | 한 줄 요약 |
|------|------|-----------|
| 정의 | interview-me | 계획, 스펙, 코드가 생기기 전에 사용자가 실제로 원하는 것을 드러냅니다 |
| 정의 | idea-refine | 구조화된 발산적 사고와 수렴적 사고로 아이디어를 다듬습니다 |
| 정의 | spec-driven-development | 코드 전에 요구사항과 인수 기준을 둡니다 |
| 계획 | planning-and-task-breakdown | 작고 검증 가능한 작업으로 분해합니다 |
| 빌드 | incremental-implementation | 얇은 수직 슬라이스. 확장하기 전에 각각을 테스트합니다 |
| 빌드 | source-driven-development | 구현 전에 공식 문서와 대조해 확인합니다 |
| 빌드 | doubt-driven-development | 사소하지 않은 결정마다 적대적이고 새 맥락의 리뷰를 합니다 |
| 빌드 | context-engineering | 올바른 시점에 올바른 맥락 |
| 빌드 | frontend-ui-engineering | 접근성을 갖춘 프로덕션 품질의 UI |
| 빌드 | api-and-interface-design | 명확한 계약이 있는 안정적인 인터페이스 |
| 검증 | test-driven-development | 실패하는 테스트를 먼저 두고, 그다음 통과시킵니다 |
| 검증 | browser-testing-with-devtools | 런타임 검증을 위한 Chrome DevTools MCP |
| 검증 | debugging-and-error-recovery | 재현 → 국소화 → 수정 → 재발 방지 |
| 리뷰 | code-review-and-quality | 품질 게이트가 있는 5축 리뷰 |
| 리뷰 | code-simplification | 동작을 유지하면서 불필요한 복잡성을 줄입니다 |
| 리뷰 | security-and-hardening | OWASP 예방, 입력 검증, 최소 권한 |
| 리뷰 | performance-optimization | 먼저 측정하고, 중요한 것만 최적화합니다 |
| 출시 | git-workflow-and-versioning | 원자적 커밋, 깨끗한 이력 |
| 출시 | ci-cd-and-automation | 모든 변경에 자동화된 품질 게이트 |
| 출시 | deprecation-and-migration | 옛 시스템을 제거하고 사용자를 안전하게 마이그레이션합니다 |
| 출시 | documentation-and-adrs | 무엇만이 아니라 왜를 문서화합니다 |
| 출시 | observability-and-instrumentation | 구조화된 로그, RED 메트릭, 트레이스, 증상 기반 알림 |
| 출시 | shipping-and-launch | 출시 전 체크리스트, 모니터링, 롤백 계획 |
