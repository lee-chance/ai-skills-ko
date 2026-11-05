# 접근성 체크리스트

WCAG 2.1 AA 준수를 위한 빠른 참조입니다. `frontend-ui-engineering` 스킬과 함께 사용하세요.

## 목차

- [필수 확인](#essential-checks)
- [자주 쓰는 HTML 패턴](#common-html-patterns)
- [테스트 도구](#testing-tools)
- [빠른 참조: ARIA 라이브 리전](#quick-reference-aria-live-regions)
- [흔한 안티패턴](#common-anti-patterns)

<a id="essential-checks"></a>

## 필수 확인

### 키보드 탐색
- [ ] 모든 상호작용 요소를 Tab 키로 포커스할 수 있습니다
- [ ] 포커스 순서가 시각적 순서와 논리적 순서를 따릅니다
- [ ] 포커스가 보입니다(포커스된 요소의 outline 또는 ring)
- [ ] 커스텀 위젯이 키보드를 지원합니다(Enter로 활성화, Escape로 닫기)
- [ ] 키보드 트랩이 없습니다. 사용자는 언제나 컴포넌트 밖으로 Tab 할 수 있습니다
- [ ] 페이지 상단에 본문으로 건너뛰기 링크가 있습니다. 적어도 키보드 포커스 때에는 보입니다
- [ ] 모달은 열려 있는 동안 포커스를 가두고, 닫히면 포커스를 원래 위치로 되돌립니다

### 스크린 리더
- [ ] 모든 이미지에 `alt` 텍스트가 있습니다(장식 이미지는 `alt=""`)
- [ ] 모든 폼 입력에 연결된 레이블이 있습니다(`<label>` 또는 `aria-label`)
- [ ] 버튼과 링크에 설명하는 텍스트가 있습니다. "여기를 클릭"만으로는 부족합니다
- [ ] 아이콘만 있는 버튼에 `aria-label`이 있습니다
- [ ] 페이지에 `<h1>`이 하나 있고, 제목 수준을 건너뛰지 않습니다
- [ ] 동적 콘텐츠 변경을 알립니다(`aria-live` 리전)
- [ ] 표에 scope가 있는 `<th>` 헤더가 있습니다

### 시각
- [ ] 일반 텍스트 대비는 4.5:1 이상, 큰 텍스트 대비는 3:1 이상입니다(큰 텍스트는 최소 18pt / 24 CSS px, 굵은 글씨는 14pt / 약 18.67 CSS px). 기준에 미달하는 대비 비율을 임계값까지 올려 반올림하지 마세요.
- [ ] UI 컴포넌트와 배경의 대비가 3:1 이상입니다
- [ ] 색 이외의 수단으로도 정보를 전달합니다
- [ ] 텍스트를 200%까지 키워도 레이아웃이 깨지지 않습니다
- [ ] 초당 3회를 넘겨 깜빡이는 콘텐츠가 없습니다

### 폼
- [ ] 모든 입력에 보이는 레이블이 있습니다
- [ ] 필수 필드를 표시합니다. 색만으로 표시하지 않습니다
- [ ] 오류 메시지가 구체적이고, 해당 필드와 연결되어 있습니다
- [ ] 오류 상태가 색 이외의 수단으로도 보입니다(아이콘, 텍스트, 테두리)
- [ ] 폼 제출 오류를 요약하고, 그 요약으로 포커스할 수 있습니다
- [ ] 형식이 알려진 필드는 autocomplete를 씁니다(예: `type="email" autocomplete="email"`)

### 콘텐츠
- [ ] 언어를 선언합니다(`<html lang="en">`)
- [ ] 페이지에 설명하는 `<title>`이 있습니다
- [ ] 링크가 주변 텍스트와 구분됩니다. 색만으로 구분하지 않습니다
- [ ] 모바일 터치 대상이 44x44px 이상입니다
- [ ] 빈 상태가 의미를 전달합니다. 빈 화면으로 두지 않습니다

<a id="common-html-patterns"></a>

## 자주 쓰는 HTML 패턴

### 버튼과 링크

```html
<!-- Use <button> for actions -->
<button onClick={handleDelete}>Delete Task</button>

<!-- Use <a> for navigation -->
<a href="/tasks/123">View Task</a>

<!-- NEVER use div/span as buttons -->
<div onClick={handleDelete}>Delete</div>  <!-- BAD -->
```

### 폼 레이블

```html
<!-- Explicit label association -->
<label for="email">Email address</label>
<input id="email" type="email" required />

<!-- Implicit wrapping -->
<label>
  Email address
  <input type="email" required />
</label>

<!-- Hidden label (visible label preferred) -->
<input type="search" aria-label="Search tasks" />
```

### ARIA 역할

```html
<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer links">...</nav>

<!-- Status messages -->
<div role="status" aria-live="polite">Task saved</div>

<!-- Alert messages -->
<div role="alert">Error: Title is required</div>

<!-- Modal dialogs -->
<dialog aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  ...
</dialog>

<!-- Loading states -->
<div role="status" aria-busy="true" aria-label="Loading tasks">
  <Spinner />
</div>
```

### 접근 가능한 목록

```html
<ul role="list" aria-label="Tasks">
  <li>
    <input type="checkbox" id="task-1" aria-label="Complete: Buy groceries" />
    <label for="task-1">Buy groceries</label>
  </li>
</ul>
```

<a id="testing-tools"></a>

## 테스트 도구

```bash
# Automated audit
npx --package=@axe-core/cli axe http://localhost:3000
npx pa11y             # CLI accessibility checker

# In browser
# Chrome DevTools → Lighthouse → Accessibility
# Chrome DevTools → Elements → Accessibility tree

# Screen reader testing
# macOS: VoiceOver (Cmd + F5)
# Windows: NVDA (free) or JAWS
# Linux: Orca
```

<a id="quick-reference-aria-live-regions"></a>

## 빠른 참조: ARIA 라이브 리전

| 값 | 동작 | 용도 |
|-------|----------|---------|
| `aria-live="polite"` | 다음 쉬는 지점에 읽습니다 | 상태 업데이트, 저장 확인 |
| `aria-live="assertive"` | 즉시 읽습니다 | 오류, 시간에 민감한 알림 |
| `role="status"` | `polite`와 같습니다 | 상태 메시지 |
| `role="alert"` | `assertive`와 같습니다 | 오류 메시지 |

<a id="common-anti-patterns"></a>

## 흔한 안티패턴

| 안티패턴 | 문제 | 해결 |
|---|---|---|
| `div`를 버튼으로 사용 | 포커스할 수 없고, 키보드를 지원하지 않습니다 | `<button>`을 사용하세요 |
| `alt` 텍스트 누락 | 스크린 리더에 이미지가 보이지 않습니다 | 설명하는 `alt`를 추가하세요 |
| 색만으로 나타낸 상태 | 색각 이상 사용자에게 보이지 않습니다 | 아이콘, 텍스트, 패턴을 추가하세요 |
| 자동 재생 미디어 | 혼란을 주고, 멈출 수 없습니다 | 컨트롤을 두고, 자동 재생하지 마세요 |
| ARIA 없는 커스텀 드롭다운 | 키보드와 스크린 리더로 쓸 수 없습니다 | 네이티브 `<select>`나 올바른 ARIA `listbox`를 사용하세요 |
| 포커스 아웃라인 제거 | 사용자가 현재 위치를 볼 수 없습니다 | 아웃라인은 스타일을 주고, 제거하지 마세요 |
| 빈 링크와 버튼 | 설명 없이 "링크"라고만 읽힙니다 | 텍스트나 `aria-label`을 추가하세요 |
| `tabindex > 0` | 자연스러운 Tab 순서를 깨뜨립니다 | `tabindex="0"` 또는 `-1`만 사용하세요 |
