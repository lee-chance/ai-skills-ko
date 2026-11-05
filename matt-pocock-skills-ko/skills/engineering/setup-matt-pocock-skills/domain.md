# Domain Docs

코드베이스를 탐색할 때 엔지니어링 스킬이 이 저장소의 도메인 문서를 소비하는 방법.

## 탐색하기 전에 읽기

- 저장소 루트의 **`GLOSSARY.md`**, 또는
- 존재하는 경우 저장소 루트의 **`GLOSSARY-MAP.md`**: 컨텍스트당 하나의 `GLOSSARY.md`를 가리킵니다. 주제와 관련된 각각을 읽으세요.
- **`docs/adr/`**: 작업하려는 영역을 건드리는 ADR을 읽으세요. 다중 컨텍스트 저장소에서는 컨텍스트 범위 결정을 위해 `src/<context>/docs/adr/`도 확인하세요.

이러한 파일 중 존재하지 않는 것이 있으면, **조용히 진행하세요**. 부재를 플래그하지 마세요; 미리 생성하도록 제안하지 마세요. `/domain-modeling` 스킬(`/grill-with-docs`와 `/improve-codebase-architecture`를 통해 도달)은 용어나 결정이 실제로 해결될 때 지연 생성합니다.

## 파일 구조

단일 컨텍스트 저장소 (대부분의 저장소):

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

다중 컨텍스트 저장소 (루트에 `GLOSSARY-MAP.md` 존재):

```
/
├── GLOSSARY-MAP.md
├── docs/adr/                          ← 시스템 전체 결정
└── src/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← 컨텍스트 특정 결정
    └── billing/
        ├── GLOSSARY.md
        └── docs/adr/
```

## 용어집의 어휘 사용

출력이 도메인 개념을 명명할 때(이슈 제목, 리팩토링 제안, 가설, 테스트 이름), `GLOSSARY.md`에 정의된 대로 용어를 사용하세요. 용어집이 명시적으로 피하는 동의어로 표류하지 마세요.

필요한 개념이 아직 용어집에 없다면, 그것은 신호입니다: 프로젝트가 사용하지 않는 언어를 발명하고 있거나(재고하세요) 진짜 간격이 있습니다(`/domain-modeling`에 주목하세요).

## ADR 충돌 플래그

출력이 기존 ADR과 모순된다면, 조용히 재정의하지 말고 명시적으로 표시하세요:

> _ADR-0007 (event-sourced orders)과 모순되지만, ...때문에 재개할 가치가 있습니다_
