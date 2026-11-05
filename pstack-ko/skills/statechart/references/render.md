# 차트 렌더링

보여주는 각 `.mmd` 파일은 npm 패키지 `pele@1.9.0`으로 렌더링하고, 사용자에게 SVG를 주세요. Pele는 저장소 밖에서 한 번 설치하세요. 각 SVG는 같은 이름으로, 해당하는 `.mmd` 파일 옆에 쓰세요. API는 https://pele.run/api 에 있습니다. `render`의 옵션으로 `{ limit: 1_000_000, outputLimit: 8_000_000, maxEdges: 10_000 }`을 넘기세요. Pele의 기본값은 상태 500개인 차트가 될 수 있는 크기보다 작습니다. Pele가 `PeleError`를 던지면, 사용자에게 Mermaid 텍스트와 그 오류를 보여 주세요.

## 색

Pele는 Mermaid의 `theme`과 `themeVariables`를 무시합니다. `.pele`에 `--pele-*` CSS 변수를 설정하세요. https://pele.run/theming 에 목록이 있습니다. 명령은 각 상태에 그 그룹의 색 클래스를 줍니다. `class sN teal`처럼. 나쁜 각 상태는 `class sN breaks` 또는 `class sN mayBreak`로 표시합니다. 버그까지 최단 경로 위의 각 상태는 `class sN bugPath`로, PROPERTY 반례가 영원히 반복하는 각 상태는 `class sN repeats`로 표시합니다. Pele는 이 클래스를 상태의 노드에 붙입니다. CSS로 클래스에 색을 주세요.

`.mmd` 파일에는 `breaks`와 `mayBreak`용 `classDef` 줄이 있어서, 어떤 Mermaid 뷰어에서든 버그 표시가 보입니다. 그룹 색, `bugPath`, `repeats`용 `classDef`는 없습니다. Pele는 각 `classDef` 색을 노드의 `style` 속성으로 쓰고, `style` 속성은 일반 CSS 규칙보다 우선합니다. 그래서 아래 표시용 규칙은 `!important`를 씁니다. 이것이 없으면 다크 테마에서도 라이트 표시 색이 남습니다. 버그 표시는 채우기와 텍스트를 정하고, `bugPath`와 `repeats`는 테두리를 정합니다. 표시 규칙은 그룹 색 뒤에 두세요. 그러면 표시가 그룹 색 위에 나타납니다.

이 색은 제안입니다. 이전 스킬의 색입니다. 각 SVG 시작 부분의 `<style>` 요소에 넣으세요. 그러면 각 SVG는 뷰어의 라이트 또는 다크 설정을 따릅니다.

```css
.pele {
  --pele-bg: #ffffff;
  --pele-fg: #1c1c1c;
  --pele-muted: #656565;
  --pele-line: #808080;
  --pele-surface: #fcfcfc;
  --pele-surface-alt: #f1f1f1;
  --pele-border: #c9c9c9;
}
.pele .blue rect { fill: #c3e0ff; }
.pele .orange rect { fill: #f0d3bf; }
.pele .purple rect { fill: #e3d5ff; }
.pele .yellow rect { fill: #f0dcbf; }
.pele .teal rect { fill: #bfe3df; }
.pele .tan rect { fill: #e5d9ce; }
.pele .pink rect { fill: #ffcbe6; }
.pele .breaks rect {
  fill: #ffecee !important;
  stroke: #e72e3b !important;
  stroke-width: 2.5px !important;
}
.pele .breaks text {
  fill: #cd2834 !important;
}
.pele .mayBreak rect {
  fill: #fff3e6 !important;
  stroke: #e8730c !important;
  stroke-width: 2.5px !important;
}
.pele .mayBreak text {
  fill: #b85a06 !important;
}
.pele .bugPath rect {
  stroke: #1680f3 !important;
  stroke-width: 2.5px !important;
}
.pele .repeats rect {
  stroke: #9b35d6 !important;
  stroke-width: 2.5px !important;
  stroke-dasharray: 6 3;
}
@media (prefers-color-scheme: dark) {
  .pele {
    --pele-bg: #1f1f1f;
    --pele-fg: #f5f5f5;
    --pele-muted: #acacac;
    --pele-line: #939393;
    --pele-surface: #121212;
    --pele-surface-alt: #2c2c2c;
    --pele-border: #4e4e4e;
  }
  .pele .blue rect { fill: #1b3857; }
  .pele .orange rect { fill: #573117; }
  .pele .purple rect { fill: #3c2e57; }
  .pele .yellow rect { fill: #573d17; }
  .pele .teal rect { fill: #174641; }
  .pele .tan rect { fill: #3d3127; }
  .pele .pink rect { fill: #57233e; }
  .pele .breaks rect {
    fill: #2e2021 !important;
    stroke: #cf2b35 !important;
  }
  .pele .breaks text {
    fill: #ff6463 !important;
  }
  .pele .mayBreak rect {
    fill: #2e2619 !important;
    stroke: #d0700f !important;
  }
  .pele .mayBreak text {
    fill: #ffa257 !important;
  }
  .pele .bugPath rect {
    stroke: #116dd2 !important;
  }
  .pele .repeats rect {
    stroke: #9a3fcf !important;
  }
}
```
