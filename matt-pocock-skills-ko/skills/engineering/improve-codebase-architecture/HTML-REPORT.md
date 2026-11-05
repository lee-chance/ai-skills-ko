# HTML Report Format

아키텍처 검토는 OS temp 디렉터리에 단일 독립형 HTML 파일로 렌더링됩니다. Tailwind와 Mermaid는 모두 CDN에서 가져옵니다. Mermaid는 그래프 형태의 다이어그램을 안정적으로 처리합니다; 수동으로 만든 div와 인라인 SVG는 더 편집적인 시각 자료(질량 다이어그램, 단면도)를 처리합니다. 두 가지를 혼합하세요: 모든 것을 Mermaid에 의존하지 마세요. 일반적으로 보이기 시작할 것입니다.

## 스캐폴드

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 헤더

저장소 이름, 날짜, 그리고 간결한 범례: 실선 상자 = 모듈, 점선 = 심, 빨간색 화살표 = 누출, 두꺼운 어두운 상자 = 깊은 모듈. 소개 단락 없음. 바로 후보로 들어갑니다.

## 후보 카드

다이어그램이 무게를 짊어집니다. 산문은 희박하고, 평이하며, (`/codebase-design` 스킬의) 용어집 용어를 의식 없이 사용합니다.

각 후보는 하나의 `<article>`입니다:

- **제목**: 짧게, deepening을 명명 (예: "Order intake 파이프라인 축소").
- **배지 행**: 권장 강도 (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), 그리고 의존성 카테고리 태그 (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **파일들**: 고정폭 목록, `font-mono text-sm`.
- **Before / After 다이어그램**: 중심부. 두 열, 나란히. 아래 패턴 참조.
- **문제**: 한 문장. 무엇이 아픈지.
- **해결책**: 한 문장. 무엇이 변경되는지.
- **이득들**: 글머리 기호, 각각 ≤6 단어. 예: "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR 콜아웃** (해당하는 경우): 호박색 상자에 한 줄.

설명 단락 없음. 다이어그램을 이해하기 위해 단락이 필요하다면, 다이어그램을 다시 그리세요.

## 다이어그램 패턴

후보에 맞는 패턴을 선택하세요. 혼합하세요. 모든 다이어그램이 똑같아 보이게 만들지 마세요. 다양성이 포인트의 일부입니다.

### Mermaid 그래프 (의존성 / 호출 흐름의 일꾼)

"X가 Y를 호출하고 Y가 Z를 호출하며, 혼란을 보세요"가 포인트일 때 Mermaid `flowchart` 또는 `graph`를 사용하세요. Tailwind 스타일의 카드로 감싸서 낙하산처럼 느껴지지 않게 하세요. 누출 엣지를 빨간색으로, 깊은 모듈을 어둡게 색칠하기 위해 classDef로 스타일을 지정하세요. 시퀀스 다이어그램은 "이전: 6 라운드 트립; 이후: 1"에 잘 작동합니다.

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 수동 제작 상자와 화살표 (Mermaid의 레이아웃이 싸울 때)

경계와 레이블이 있는 `<div>`로 모듈. 절대 위치가 지정된 인라인 SVG `<line>` 또는 `<path>` 요소로 상대 컨테이너 위의 화살표. "after" 다이어그램이 회색 처리된 내부가 있는 하나의 두꺼운 테두리 깊은 모듈처럼 느껴지길 원할 때 이것을 사용하세요. Mermaid가 올바른 무게로 렌더링하지 않기 때문입니다.

### 단면도 (계층화된 얕음에 좋음)

호출이 통과하는 계층을 표시하기 위해 수평 밴드를 쌓으세요 (`h-12 border-l-4`). 이전: 각각 아무것도 하지 않는 6개의 얇은 계층. 이후: 통합된 책임으로 레이블이 지정된 1개의 두꺼운 밴드.

### 질량 다이어그램 ("구현만큼 넓은 인터페이스"에 좋음)

모듈당 두 개의 직사각형: 하나는 인터페이스 표면적, 하나는 구현. 이전: 인터페이스 직사각형이 구현 직사각형만큼 거의 높음 (얕음). 이후: 인터페이스 직사각형이 짧고, 구현 직사각형이 높음 (깊음).

### 호출 그래프 축소

이전: 중첩된 상자로 렌더링된 함수 호출의 트리. 이후: 하나의 상자로 축소된 동일한 트리, 이제 내부 호출이 안쪽에 흐릿하게 표시됨.

## 스타일 가이드

- 기업 대시보드가 아니라 편집적으로 기울이세요. 관대한 공백. 제목에 선택적 세리프 (`font-serif`는 stone/slate와 잘 작동합니다).
- 색상을 아껴 사용하세요: 하나의 강조 (emerald 또는 indigo) 그리고 누출을 위한 빨간색과 경고를 위한 호박색.
- before/after가 스크롤 없이 나란히 편안하게 앉을 수 있도록 다이어그램을 ~320px 높이로 유지하세요.
- 다이어그램 내부의 모듈 레이블에 `text-xs uppercase tracking-wider`를 사용하여 UI가 아니라 개략도로 읽히도록 하세요.
- 유일한 스크립트는 Tailwind CDN과 Mermaid ESM import입니다. 보고서는 그 외에는 정적입니다: 앱 코드 없음, Mermaid 자체 렌더링 외의 상호작용 없음.

## 최고 권장사항 섹션

하나의 더 큰 카드. 후보 이름, 이유에 대한 한 문장, 카드에 대한 앵커 링크. 그게 전부입니다.

## 톤

평이한 영어, 간결하지만, 아키텍처 명사와 동사는 `/codebase-design` 스킬에서 직접 가져옵니다. 간결함은 표류의 변명이 아닙니다.

**정확히 사용:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**절대 대체하지 않음:** component, service, unit (module 대신) · API, signature (interface 대신) · boundary (seam 대신) · layer, wrapper (module을 의미할 때 module 대신).

**스타일에 맞는 표현:**

- "Order intake 모듈은 얕음: 인터페이스가 구현과 거의 일치합니다."
- "Pricing이 심을 가로질러 누출됩니다."
- "Deepen: 하나의 인터페이스, 테스트할 한 곳."
- "두 어댑터가 심을 정당화: prod에서 HTTP, 테스트에서 메모리 내."

**이득 글머리 기호**는 용어집 용어로 이득을 명명합니다: *"locality: 버그가 한 모듈에 집중"*, *"leverage: 하나의 인터페이스, N개의 호출 사이트"*, *"인터페이스 축소; 구현이 래퍼를 흡수"*. *"유지 관리가 더 쉬움"* 또는 *"더 깨끗한 코드"*라고 쓰지 마세요. 그 용어들은 용어집에 없고 자리를 벌지 못하기 때문입니다.

헤징 없음, 목청 가다듬기 없음, "it's worth noting that…" 없음. 문장이 글머리 기호일 수 있다면, 글머리 기호로 만드세요. 글머리 기호를 잘라낼 수 있다면, 잘라내세요. 용어가 `/codebase-design` 용어집에 없다면, 새 용어를 발명하기 전에 있는 용어를 찾으세요.
