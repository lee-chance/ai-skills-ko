# Engineering

코드 작업에 매일 사용하는 스킬입니다.

## 사용자 호출

여러분이 입력할 때만 도달 가능합니다 (Claude Code: `disable-model-invocation: true`; Codex: `agents/openai.yaml`에 `policy.allow_implicit_invocation: false`).

- **[ask-matt](./ask-matt/SKILL.md)**: 상황에 맞는 스킬이나 플로우를 물어보세요. 이 저장소의 사용자 호출 스킬에 대한 라우터입니다.
- **[grill-with-docs](./grill-with-docs/SKILL.md)**: 프로젝트의 도메인 모델을 구축하고 용어를 다듬으며 `GLOSSARY.md`와 ADR을 인라인으로 업데이트하는 그릴링 세션입니다.
- **[triage](./triage/SKILL.md)**: 트리아지 역할의 상태 머신을 통해 이슈를 이동시킵니다.
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)**: 깊게 만들 기회를 찾기 위해 코드베이스를 스캔하고 시각적 HTML 리포트로 제시한 다음, 선택한 것을 그릴합니다.
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)**: 엔지니어링 스킬을 위해 이 저장소를 구성합니다 (이슈 트래커, 트리아지 라벨, 도메인 문서 레이아웃). 저장소당 한 번 실행하세요.
- **[to-spec](./to-spec/SKILL.md)**: 현재 대화를 스펙으로 전환하고 이슈 트래커에 게시합니다.
- **[to-tickets](./to-tickets/SKILL.md)**: 모든 계획, 스펙 또는 대화를 tracer-bullet 티켓 세트로 분해합니다. 각각은 차단 엣지를 선언하며, 로컬 파일의 텍스트로 작성되거나 실제 트래커의 네이티브 차단 링크로 작성됩니다.
- **[implement](./implement/SKILL.md)**: 스펙 또는 티켓 세트에 설명된 작업을 빌드하고, 미리 합의된 심에서 `/tdd`를 구동하고 커밋하기 전에 `/code-review`로 마무리합니다.
- **[implement-spec](./implement-spec/SKILL.md)**: 하나의 통합 브랜치에서 전체 스펙을 구현합니다. 티켓을 작업 그래프로 처리하고, 최대 동시성을 위해 준비된 프론티어를 가로질러 구현자 서브에이전트를 실행한 다음, `/code-review`로 마무리합니다.
- **[wayfinder](./wayfinder/SKILL.md)**: 하나의 에이전트 세션이 담을 수 있는 것보다 더 큰 작업 덩어리를 이슈 트래커의 의사 결정 티켓 공유 맵으로 계획하고, 목적지로 가는 길이 명확해질 때까지 한 번에 하나씩 해결합니다.
- **[retro](./retro/SKILL.md)**: 세션 후 코딩 에이전트 환경(탐색, 자동 검사, 코딩 표준, 조향 파일, 도구)에 대한 개선 사항을 가장 심각한 것부터 제안합니다.

## 모델 호출

모델 또는 사용자가 도달 가능합니다 (모델이 도달할 수 있도록 풍부한 트리거 문구).

- **[prototype](./prototype/SKILL.md)**: 설계 질문에 답하기 위해 일회용 프로토타입을 빌드합니다: 상태/로직을 위한 단일 공유 가능 HTML 파일, 또는 토글 가능한 여러 UI 변형.
- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)**: 어려운 버그와 성능 회귀에 대한 규율적인 진단 루프: 이 버그에 빨간색이 되는 피드백 루프 구축 → 최소화 → 가설 세우기 → 계측 → 수정 → 회귀 테스트.
- **[research](./research/SKILL.md)**: 신뢰도 높은 주요 소스에 대해 질문을 조사하고 결과를 저장소의 인용된 Markdown 파일로 캡처합니다. 백그라운드 에이전트로 실행됩니다.
- **[tdd](./tdd/SKILL.md)**: red-green-refactor 루프가 있는 테스트 주도 개발. 한 번에 하나의 수직 슬라이스씩 기능을 빌드하거나 버그를 수정합니다.
- **[domain-modeling](./domain-modeling/SKILL.md)**: 용어를 도전하고, 시나리오로 스트레스 테스트하고, `GLOSSARY.md`와 ADR을 인라인으로 업데이트하여 프로젝트의 도메인 모델을 적극적으로 구축하고 다듬습니다.
- **[codebase-design](./codebase-design/SKILL.md)**: 깊은 모듈 설계를 위한 공유 규율과 어휘: 작은 인터페이스, 깨끗한 심, 인터페이스를 통해 테스트 가능.
- **[code-review](./code-review/SKILL.md)**: 고정 지점 이후 diff의 두 축 리뷰: **표준** (저장소의 코딩 표준과 Fowler 냄새 기준을 따르나?) 및 **스펙** (원래 이슈/스펙을 충실히 구현하나?), 병렬 서브에이전트로 실행됨.
- **[pr](./pr/SKILL.md)**: 풀 리퀘스트 본문이 취해야 하는 형태: 변경사항을 명확하게 만드는 가장 작은 시각으로서의 요약, 작동한다는 전후 증거, 병합 위험 호출 (단방향 또는 양방향 도어, 폭발 반경 포함).
- **[wizard](./wizard/SKILL.md)**: 인간만 수행할 수 있는 단계를 안내하는 대화형 bash 마법사 생성: 인프라 프로비저닝, 자격 증명 또는 CI 시크릿 설정, 익숙하지 않은 타사 대시보드 탐색, 일회성 마이그레이션 또는 전환 실행.
