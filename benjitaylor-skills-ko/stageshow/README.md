# Stageshow

제품 일러스트, 커서 스토리, 모션 디자인을 위한 스킬이자 작은 React 키트입니다. `SKILL.md`에서 시작하세요. 당장의 작업에 맞는 링크를 따르세요.

## 미리보기

Node 20.19 이상이 필요합니다. 이 폴더에서:

```sh
npm install
npm run dev
```

macOS와 Linux에서는 **http://stageshow.localhost:1355**를 여세요. Windows에서는
Vite가 바로 시작합니다. 인쇄하는 로컬 URL을 여세요(보통 **http://127.0.0.1:5173**).
지원되는 플랫폼에서는 Portless가 자동으로 설치됩니다. macOS나 Linux에서 npm이
선택 의존성을 건너뛰었다면 `npm install --include=optional`을 실행하세요.

플레이그라운드에는 골드
예시, 시각 스타일 아홉 가지, 레이블이 있는 나쁨/좋음 교육 쌍이 있습니다.
일시정지, 다시 재생, 느리게, 또는 한 프레임 진행하세요. Phone은 사용 가능한
너비를 358px로 바꿉니다. Reduced motion은 각 장면의 스틸을 보여 줍니다. 뷰어와
컨트롤은 예시의 격리된 시계 밖에 있습니다.

## 키트 사용

`kit/`를 React 프로젝트에 복사하세요. 컴포넌트는 자기 CSS를 임포트합니다.

```tsx
import { Stage, Window, type Act } from './kit'
```

예시를 시작점으로 복사하세요. 상대 키트 임포트를 유지하고, 임포트하는
에셋을 복사하며, 구성과 룩을 제품에 맞게 바꾸세요. 이것은
저작된 일러스트입니다. 스크립트된 `a.click()`이 피드백을 그리고, `a.set()`이
장면을 바꿉니다. 실제 애플리케이션 컨트롤을 자동화하지 않습니다.

실제 제품 연구(Figma, Linear, Slack, Raycast 등)는
`examples/`에 포함되고 플레이그라운드의 **실제 제품** 아래에 나열됩니다. 일부는
플레이그라운드가 설치하는 `lucide-react`를 임포트합니다. 연구를
다른 프로젝트로 복사할 때는 로컬 에셋을 유지하고 해당 아이콘 의존성을 설치하거나
아이콘을 맞추세요.

키트는 React 18 이상을 지원합니다. 서드파티 애니메이션 런타임이 필요 없습니다.
플레이그라운드는 Vite를 쓰고, 촬영은 `playwright-core`와 로컬에 설치된
Chrome(또는 `CHROME_PATH`)을 씁니다. 그 도구는 데모의 런타임 의존성이 아닙니다.

## 검증

```sh
npm run typecheck
npm run check:css
node scripts/film.mjs '<your URL>' --select '.your-demo' --gate
node scripts/film.mjs '<your URL>' --select '.your-demo' --width 390 --gate
node scripts/film.mjs '<your URL>' --select '.your-demo' --states --gate
```

포함된 뷰어에는 촬영 URL로 `?capture=hero-demo`를 쓰세요. 보통
뷰어는 iframe을 포함합니다. 네이티브 시계에서는 직접 캡처 경로를 쓰세요.
커버리지, 휴대폰, 호버, 모션 감소, 시각
리뷰는 `references/rehearse.md`를 보세요. 자동화된 깨끗한 결과가 모션을 보는 것을 대신하지는 않습니다.

## 내용

- `kit/`: 이식 가능한 React 소스와 스타일.
- `examples/`: 골드 장면과 참조 표본.
- `teaching/`: 골드와 분리된, 명시적으로 결함이 있거나 교정된 쌍.
- `references/`: 디자인 판단, API, 검증 가이드.
- `assets/`: 예시가 쓰는 로컬 아이콘 에셋.
- `scripts/`: 호스트 마크업과 독립된 검증 도구.
- `playground/`: 독립 로컬 뷰어.

스킬, 키트, 예시, 검증 도구가 이 폴더에 포함됩니다.
서드파티 이름과 선택 에셋은 `NOTICE.md`를 보세요.
