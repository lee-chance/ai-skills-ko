# 브랜드 마크

장면에 알려진 제품이나 결제 수단이 보이면 현재의 실제 아트워크를 사용하세요. 서드파티 아이콘 카탈로그를 믿기 전에 공식 브랜드 출처를 확인하세요. 카탈로그는 오래된 색과 로고를 유지합니다. `BrandMark`에는 흔한 연동과 결제 행을 위한 작은 로컬 레지스트리가 있습니다. SVG는 키트와 함께 제공되고, 원래 색과 비율을 유지하며, 런타임에 아이콘 서비스를 호출하지 않습니다.

```tsx
import { BrandMark } from './kit'

<BrandMark brand="google-calendar" size={28} />
<BrandMark brand="visa" size={20} tile={false} />
<BrandMark name="Your product" src="/assets/product.svg" size={28} />
```

`size`는 풋프린트의 높이입니다. 앱 마크는 정사각 풋프린트를, 넓은 결제 마크는 비례하는 너비를 갖습니다. Amex는 파란 카드 타일 위의 흰 워드마크를 쓰고, 타일 없이는 공식 블루박스 로고를 씁니다. 단색 정사각 면 위의 글리프로 제공되는 마크(Dropbox)는 다른 앱 마크와 같은 흰 타일 위에, 브랜드 색의 글리프만으로 보여 줍니다. 둥근 흰 사각형 안의 각진 파란 사각형은 결코 옳지 않고, 단색 파란 타일은 행의 나머지 옆에서 소리칩니다. `width`는 제품 행에 고정 트랙이 있을 때 풋프린트를 덮어씁니다. 아트워크는 항상 `object-fit: contain`이며, 정사각형을 채우도록 늘어나지 않습니다. 포함된 마크는 광학 스케일 조정을 가지므로, 좁은 Figma 마크와 가득 찬 Gmail 마크가 같은 존재감을 갖습니다.

`surface`는 Stage의 라이트 또는 다크 테마를 따릅니다. 다크 Stage 안의 흰 카드에는 `surface="light"`를 넘기세요. 다크 변형은 제공된 곳에서 자동으로 선택됩니다. 다크 변형이 없는 풀컬러 아트워크는 어두운 표면에서 흰 타일을 유지합니다. 타일을 제거하면 맨 마크를 실제 배경과 대조하세요. 모노크롬 UI에서도 원래 색을 유지하세요. 크립토 마크는 납작하며, 동전 베벨이나 금속 음영이 없습니다.

`name`은 접근성 레이블을 덮어씁니다. 아트워크 없는 커스텀 `name`은 가상 제품을 위해 중립 이니셜 타일을 유지합니다. 제공된 실제 마크 자리에 이니셜이나 손으로 그린 근사를 쓰지 마세요. 최소 충실도는 다른 콘텐츠와 함께 아트워크를 숨깁니다.

장면에 이름이 있는 실제 회사(Chase, Wells Fargo, Stripe, Slack)는 브랜드 색 타일의 이니셜이 아니라 `kit/brands/`의 실제 마크를 달고 있습니다. 그것은 실제 이름 옆의 지어낸 로고이며, 필름은 `invented mark`로 표시합니다. 키트는 결제 네트워크, 흔한 제품 마크, 은행 일곱 곳(Chase, Wells Fargo, Bank of America, Barclays, HSBC, Monzo, Revolut, `kit/brands/`의 Banks 범주)을 담습니다. 키트에 그 회사의 마크가 없으면, 있는 회사를 이름 짓거나 중립 이니셜 타일이 있는 가상 회사를 쓰세요. 실제 이름과 가짜 마크가 함께 있는 것은 절대 내보내지 않는 한 가지입니다.

| 그룹 | `brand` 값 |
|---|---|
| 결제 | `visa`, `mastercard`, `amex`, `discover`, `paypal`, `stripe` |
| 크립토 | `bitcoin`, `ethereum`, `solana`, `usdc`, `tether` |
| 은행 | `chase`, `wellsfargo`, `bankofamerica`, `barclays`, `hsbc`, `monzo`, `revolut` |
| 앱 | `notion`, `gmail`, `google-calendar`, `google-docs`, `1password`, `figma`, `slack`, `github`, `linear`, `dropbox`, `google-drive`, `google-sheets`, `google-slides`, `google-meet`, `zoom`, `vercel`, `shopify` |

장면이 필요로 하는 연동이나 결제 수단만 사용하세요. 작은 행은 관계를 설명합니다. 여백을 로고로 채우지 않습니다. 행 트랙을 같게 두고 마크를 눈으로 정렬하세요. 실루엣이 다르다는 것은 들쭉날쭉한 레이블이나 고르지 않은 간격의 변명이 아닙니다.

`examples/brand-marks/`는 포함된 모든 마크를 라이트와 다크 표면에 보여 줍니다. `brandMarks`와 `BrandName`은 타입이 있는 선택기나 레지스트리 조회를 위해 내보내집니다. `kit/brands/SOURCES.md`에 고정된 아트워크 출처와 라이선스가 있습니다.

이미지 상자가 아니라 렌더된 아트워크를 살펴보세요. 키가 큰 마크는 위아래에 실제 공기가 필요하고, 넓은 마크는 전체가 보여야 합니다. 중앙 정렬된 플렉스 레이아웃 안에서 이미지에 확정된 상자를 주세요. 고유 그리드 트랙의 퍼센트 이미지 치수는 예상 밖으로 커져 고르지 않은 인셋을 남길 수 있습니다. 테마 속성이 아니라 실제 라이트와 다크 배경을 확인하세요.
