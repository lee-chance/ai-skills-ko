---
name: performance-optimization
description: "프론트엔드, 백엔드, 쿼리, 데이터베이스에 걸친 애플리케이션 성능을 최적화합니다. 성능 요구 사항이 있을 때, 성능 회귀가 의심될 때, Core Web Vitals나 로드 시간을 개선해야 할 때, N+1 쿼리 패턴을 고쳐야 할 때, 프로파일링에서 병목이 드러날 때 사용하세요."
---

# Performance Optimization

## 개요

최적화하기 전에 측정하세요. 측정 없는 성능 작업은 추측입니다. 추측은 중요한 것을 개선하지 못한 채 복잡도만 더하는 조기 최적화로 이어집니다. 먼저 프로파일하고, 실제 병목을 식별하고, 고친 다음, 다시 측정하세요. 측정으로 중요함이 증명된 것만 최적화하세요.

## 언제 사용하나

- 스펙에 성능 요구 사항이 있을 때 (로드 시간 예산, 응답 시간 SLA)
- 사용자나 모니터링이 느린 동작을 보고할 때
- Core Web Vitals 점수가 임계값보다 낮을 때
- 어떤 변경이 회귀를 일으켰다고 의심될 때
- 큰 데이터셋이나 높은 트래픽을 다루는 기능을 만들 때

**사용하지 않을 때:** 문제의 증거가 생기기 전에 최적화하지 마세요. 조기 최적화는 얻는 성능보다 더 큰 비용을 치르는 복잡도를 더합니다.

## Core Web Vitals 목표

| 지표 | 좋음 | 개선 필요 | 나쁨 |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## 최적화 워크플로우

```
1. MEASURE  → Establish baseline with real data
2. IDENTIFY → Find the actual bottleneck (not assumed)
3. FIX      → Address the specific bottleneck
4. VERIFY   → Measure again; keep or revert
5. GUARD    → Add monitoring or tests to prevent regression
```

### 1단계: 측정

서로 보완하는 두 가지 방법을 함께 쓰세요.

- **합성 측정 (Lighthouse, DevTools Performance 탭):** 조건이 통제되어 있고 재현할 수 있습니다. CI에서 회귀를 잡고 특정 이슈를 격리하는 데 가장 적합합니다.
- **RUM (web-vitals 라이브러리, CrUX):** 실제 조건의 실사용자 데이터입니다. 수정이 실제로 사용자 경험을 개선했는지 검증하려면 필요합니다.

**프론트엔드:**
```javascript
// Synthetic: Lighthouse in Chrome DevTools (or CI)
// Chrome DevTools → Performance tab → Record
// Chrome DevTools MCP → Performance trace

// RUM: Web Vitals library in code
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

**백엔드:**
```javascript
// Response time logging
// Application Performance Monitoring (APM)
// Database query logging with timing

// Simple timing
console.time('db-query');
const result = await db.query(...);
console.timeEnd('db-query');
```

### 어디서부터 측정하나

무엇을 먼저 측정할지는 증상으로 정하세요.

```
What is slow?
├── First page load
│   ├── Large bundle? --> Measure bundle size, check code splitting
│   ├── Slow server response? --> Measure TTFB in DevTools Network waterfall
│   │   ├── DNS long? --> Add dns-prefetch / preconnect for known origins
│   │   ├── TCP/TLS long? --> Enable HTTP/2, check edge deployment, keep-alive
│   │   └── Waiting (server) long? --> Profile backend, check queries and caching
│   └── Render-blocking resources? --> Check network waterfall for CSS/JS blocking
├── Interaction feels sluggish
│   ├── UI freezes on click? --> Profile main thread, look for long tasks (>50ms)
│   ├── Form input lag? --> Check re-renders, controlled component overhead
│   └── Animation jank? --> Check layout thrashing, forced reflows
├── Page after navigation
│   ├── Data loading? --> Measure API response times, check for waterfalls
│   └── Client rendering? --> Profile component render time, check for N+1 fetches
└── Backend / API
    ├── Single endpoint slow? --> Profile database queries, check indexes
    ├── All endpoints slow? --> Check connection pool, memory, CPU
    └── Intermittent slowness? --> Check for lock contention, GC pauses, external deps
```

### 2단계: 병목 식별

카테고리별 흔한 병목입니다.

**프론트엔드:**

| 증상 | 유력한 원인 | 조사 |
|---------|-------------|---------------|
| 느린 LCP | 큰 이미지, 렌더를 막는 리소스, 느린 서버 | 네트워크 워터폴과 이미지 크기를 확인하세요 |
| 높은 CLS | 크기가 없는 이미지, 늦게 로드되는 콘텐츠, 폰트 시프트 | 레이아웃 시프트 기여 요인을 확인하세요 |
| 나쁜 INP | 메인 스레드의 무거운 JavaScript, 큰 DOM 업데이트 | Performance 트레이스의 롱 태스크를 확인하세요 |
| 느린 초기 로드 | 큰 번들, 많은 네트워크 요청 | 번들 크기와 코드 스플리팅을 확인하세요 |

**백엔드:**

| 증상 | 유력한 원인 | 조사 |
|---------|-------------|---------------|
| 느린 API 응답 | N+1 쿼리, 빠진 인덱스, 최적화되지 않은 쿼리 | 데이터베이스 쿼리 로그를 확인하세요 |
| 메모리 증가 | 누수된 참조, 상한이 없는 캐시, 큰 페이로드 | 힙 스냅샷 분석 |
| CPU 급등 | 동기식 무거운 계산, 정규식 백트래킹 | CPU 프로파일링 |
| 높은 지연 시간 | 빠진 캐싱, 중복 계산, 네트워크 홉 | 스택을 따라 요청을 추적하세요 |

### 3단계: 병목 수정

2단계에서 식별한 한 가지만 고치세요. 그 외에는 손대지 마세요. 아래 안티패턴이 흔한 원인입니다. 각 항목은 규칙과 알아보는 시그니처를 제시하고, [references/optimization-patterns.md](references/optimization-patterns.md)의 구체적인 수정으로 연결합니다. 그 코드에 도달했을 때 필요한 항목만 여세요. 그전에는 열지 마세요.

**백엔드**

- **N+1 쿼리.** 행마다 쿼리 하나는 가장 흔한 백엔드 병목입니다. 루프 안이 아니라 같은 쿼리에서 관계를 가져오세요 (join/include). [패턴](references/optimization-patterns.md#n1-queries-backend).
- **제한 없는 데이터 조회.** 모든 목록 엔드포인트는 `limit`과 안정적인 정렬로 페이지네이션합니다. [패턴](references/optimization-patterns.md#unbounded-data-fetching).
- **인덱스를 무시하는 쿼리.** "인덱스를 추가하라"는 추측이고, `EXPLAIN ANALYZE`가 측정입니다. 인덱스를 기대했는데 `Seq Scan`이 나오거나, `rows=` 추정이 자릿수 하나만큼 빗나가거나, 스캔 위에 `Sort` 노드가 있으면 각각 다른 수정이 필요합니다. 나쁜 `rows=` 추정은 통계가 오래되었다는 뜻이므로, 인덱스를 더하지 말고 `ANALYZE`를 실행하세요. 쿼리의 형태에 맞게 인덱스를 거세요 (동등 비교 컬럼을 먼저, 그다음 범위 또는 정렬 컬럼). 일반 인덱스는 선택도가 낮은 지배적 값에 대한 쿼리(드문 값에는 부분 인덱스가 맞습니다), 선행 와일드카드(trigram 또는 전문 검색이 필요합니다), 컬럼에 적용한 함수(`WHERE lower(email) = ?`처럼 식을 인덱싱합니다)에는 도움이 되지 않습니다. 그리고 모든 인덱스는 모든 쓰기에 세금을 매깁니다. 이후에 플랜을 다시 실행하세요. 플랜을 바꾸지 못한 인덱스는 되돌립니다. [패턴](references/optimization-patterns.md#queries-that-ignore-their-index).
- **커넥션 풀 고갈.** 시그니처: *모든* 엔드포인트가 한꺼번에 느려지고, 실행이 아니라 커넥션을 기다리는 데 시간이 쓰이며, 데이터베이스는 대부분 유휴 세션을 보입니다. 풀은 프로세스당 하나이고, `instances × max`가 데이터베이스의 커넥션 상한 아래에 머물도록 크기를 정하세요. 더 크다고 더 빨라지지는 않습니다. 큐를 보기 더 어려운 데이터베이스로 옮길 뿐입니다. 인스턴스 수에 상한이 없으면(서버리스, 오토스케일링) `max`를 올리지 말고 프록시(pgbouncer, RDS Proxy)로 다중화하세요. [패턴](references/optimization-patterns.md#connection-pool-exhaustion).
- **빠진 캐싱.** 만들기 비용이 크고, 바뀌는 횟수보다 읽는 횟수가 훨씬 많은 것을 캐시하세요. 이미 빠른 쿼리를 캐시하면 아무것도 얻지 못한 채 네트워크 홉과 스테일 버그를 더합니다. 계층을 의도적으로 고르세요 (프로세스 안, 공유, CDN). 응답을 바꾸는 모든 입력은 키에 들어갑니다 (테넌트, 로케일, 권한, 피처 플래그). 열람자를 뺀 키는 한 사용자의 데이터가 다른 사용자에게 전달되는 경로입니다. 무효화 전략을 하나 고르고 (TTL, 이벤트 또는 태그 기반, 버전이 있는 키) 허용 가능한 스테일 구간을 명시하세요. 핫 키의 스탬피드를 막으세요. 한 요청이 다시 계산하는 동안 스테일을 제공하거나, 동시에 발생한 미스를 하나의 진행 중 프로미스 뒤로 합치세요. 반드시 최신이어야 하는 것(잔액, 권한, 결제 시점의 재고)은 절대 캐시하지 마세요. [패턴](references/optimization-patterns.md#missing-caching-backend). 요청 합치기, 쓰기 전략, 네거티브 캐싱은 `../../references/performance-checklist.md`에 있습니다.

**프론트엔드**

- **빠진 이미지 최적화.** 모든 이미지는 `width`와 `height`를 선언합니다 (CLS). LCP 이미지에는 `fetchpriority="high"`, `<picture>`를 통한 최신 포맷(AVIF, WebP), 해상도 전환을 위한 `srcset`/`sizes`를 줍니다. 첫 화면 아래 이미지에는 `loading="lazy"`와 `decoding="async"`를 줍니다. [패턴](references/optimization-patterns.md#missing-image-optimization-frontend).
- **불필요한 리렌더.** 렌더 중에 만든 객체나 함수는 매번 새 참조가 되고, 그것을 받는 모든 자식을 리렌더합니다. 상수는 끌어올리세요. `React.memo`와 `useMemo`는 프로파일이 비싸다고 보여 주는 작업에만 남겨 두세요. 남용 자체가 비용입니다. [패턴](references/optimization-patterns.md#unnecessary-re-renders-react).
- **큰 번들 크기.** 최신 번들러는 ESM named import를 스스로 트리 셰이킹합니다. 실제 이득은 라우트 단위 코드 스플리팅과, 무겁고 드물게 쓰는 기능을 `Suspense` 뒤에서 지연 로딩하는 데서 나옵니다. import 스타일을 바꾸기 전에 프로파일하세요. [패턴](references/optimization-patterns.md#large-bundle-size).

### 4단계: 검증 (유지 또는 되돌리기)

수정은 다시 측정하기 전까지 가설입니다. 이 단계가 그 수정을 남길지 결정합니다.

**기준선을 측정한 것과 같은 방식으로 다시 측정하세요.** 같은 명령, 같은 조건, 같은 고정 예산(실제 경과 시간, 샘플 수, 또는 요청 수)입니다. 콜드 캐시에서 잡은 기준선을 웜 캐시의 결과와 비교하면, 변경이 아니라 캐시를 측정하게 됩니다.

**한 번에 하나만 바꾸세요.** 최적화 세 가지가 함께 반영되면 숫자는 하나이고, 어디의 효과인지 귀속할 수 없습니다. 함께 반영해야 한다면, 먼저 각각을 따로 측정하세요.

**넘어야 할 것은 평균이 아니라 노이즈입니다.** 측정을 반복하고, 차이를 실행 간 편차와 비교하세요. ±5% 편차 안의 3% 향상은 향상이 아닙니다. 다른 샘플일 뿐입니다.

그다음 기준은 엄격합니다.

| 기준선 대비 결과 | 조치 |
|---|---|
| 임계값을 넘고 테스트가 녹색 | **유지.** 메시지에 전후 숫자를 넣어 커밋하세요. |
| 노이즈 안 (측정 가능한 변화 없음) | **되돌리기.** |
| 더 나쁨 | **되돌리기.** |
| 개선되었지만 테스트가 빨간색이 됨 | **되돌리기.** 승리로 위장한 회귀입니다. |

**"중립"은 유지가 아니라 되돌리기입니다.** 팀이 건너뛰는 단계가 바로 여기입니다. 변경은 이미 작성되어 있어 버리기가 낭비처럼 느껴지고, 그래서 측정 없이 반영됩니다. 코드베이스에는 아무것도 사지 못한 복잡도가 쌓입니다. 남기는 코드는 영원히 유지보수해야 합니다. 그 코드가 스스로 값을 하게 하세요.

**정확성이 지표의 관문입니다.** 스위트는 녹색을 유지하고, *동시에* 숫자도 움직여야 합니다. 제품에 필요한 일을 빼서 이기는 "최적화"(검증을 건너뛰거나, 반드시 최신이어야 하는 값을 캐시하거나, 하중을 지고 있던 `await`를 제거하는 것)는 승리가 아니라 회귀입니다.

#### 되돌린 시도를 포함해 모든 시도를 기록하세요

되돌린 작업은 Git 이력에 흔적을 남기지 않습니다. 그래서 같은 폐기된 아이디어가 다음 분기에 다시 시도됩니다. 버린 아이디어가 버린 채로 남도록 짧은 기록을 두세요.

| 아이디어 | 기준선 → 결과 | 판정 | 이유 |
|---|---|---|---|
| 행 컴포넌트를 메모이제이션 | INP 240ms → 235ms | 되돌림 | 노이즈 안(±15ms). 행이 병목이 아니었습니다. |
| 목록 가상화 | INP 240ms → 90ms | 유지 | 트레이스에서 롱 태스크가 사라졌습니다. |
| API 오리진에 preconnect | LCP 2.8s → 2.8s | 되돌림 | 이미 같은 오리진이었습니다. |

풀 리퀘스트 설명의 한 섹션이나 저장소의 `PERF.md` 모두 괜찮습니다. 중요한 것은 다음 사람(또는 다음 에이전트)이 실험을 제안하기 전에 그것을 읽고, 이미 실패한 실험을 다시 실행하지 않는 것입니다.

### 5단계: 회귀 방지

사용자가 실제로 느끼는 지표를 지키세요. 사용할 수 있는 숫자를 모두 지킬 필요는 없습니다. 수정을 정당화했던 것과 같은 LCP, INP, p95 지연 시간, 또는 다른 주요 지표를 사용하세요.

사용자에게 보이는 표면이라면 서로 보완하는 두 계층을 사용하세요.

- **합성 CI 게이트:** 성능 예산으로 병합 전에 재현 가능한 회귀를 잡으세요. 노이즈가 있는 측정은 반복하거나 중앙값 또는 추세를 비교해, 정상적인 실행 간 편차가 게이트를 불안정한 체크로 만들지 않게 하세요.
- **필드 모니터링:** RUM 데이터의 의미 있는 p75 움직임에 알림을 거세요. 원인을 찾으려면 어트리뷰션된 `web-vitals` 데이터를 사용하세요. CrUX의 롤링 윈도우는 즉시 알림이 아니라 확인으로 다루세요.

어느 가드든 발동하면 1단계로 돌아가, 다른 수정을 제안하기 전에 새 기준선을 잡으세요.

**예산을 정하고 강제하세요:**

```
JavaScript bundle: < 200KB gzipped (initial load)
CSS: < 50KB gzipped
Images: < 200KB per image (above the fold)
Fonts: < 100KB total
API response time: < 200ms (p95)
Time to Interactive: < 3.5s on 4G
Lighthouse Performance score: ≥ 90
```

**CI에서 강제하세요:**
```bash
# Bundle size check
npx bundlesize --config bundlesize.config.json

# Lighthouse CI. The CLI package is @lhci/cli; unscoped `lhci` on npm is not it.
npx --package=@lhci/cli lhci autorun
```

## 참고

자세한 성능 체크리스트, 최적화 명령, 안티패턴 참조는 `../../references/performance-checklist.md`를 보세요.

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "나중에 최적화하면 됩니다" | 성능 부채는 복리로 쌓입니다. 명백한 안티패턴은 지금 고치고, 미시 최적화는 미루세요. |
| "내 머신에서는 빠릅니다" | 본인의 머신은 사용자의 머신이 아닙니다. 대표적인 하드웨어와 네트워크에서 프로파일하세요. |
| "이 최적화는 뻔합니다" | 측정하지 않았다면 아는 것이 아닙니다. 먼저 프로파일하세요. |
| "100ms는 사용자가 알아채지 못합니다" | 연구에 따르면 100ms 지연은 전환율에 영향을 줍니다. 사용자는 생각보다 더 잘 알아챕니다. |
| "프레임워크가 성능을 처리합니다" | 프레임워크는 일부 이슈를 막지만 N+1 쿼리나 과도하게 큰 번들은 고치지 못합니다. |
| "쿼리가 느리면 인덱스를 추가하면 됩니다" | 먼저 플랜을 읽으세요. 인덱스가 이미 있는데 쓸 수 없을 수 있고, 모든 인덱스는 쓰기에 영원히 세금을 매깁니다. |
| "그냥 캐시하면 됩니다" | 이미 싼 호출을 캐시하면 아무것도 얻지 못하고 스테일 버그만 더합니다. 비싸고, *동시에* 쓰인 횟수보다 훨씬 많이 다시 읽히는 것을 캐시하세요. |
| "커넥션이 모자라니 풀 크기를 올리세요" | 데이터베이스가 감당할 수 있는 것보다 큰 풀은 큐를 덜 보이는 곳으로 옮깁니다. 커넥션을 붙잡고 있는 대상을 찾으세요. |
| "도움이 크진 않지만 해롭지도 않습니다" | 중립적인 변경은 되돌립니다. 그 코드의 유지보수 비용은 영원히 내고, 돌려받는 것은 없습니다. |
| "이미 작성했으니 그냥 둡시다" | 매몰 비용입니다. 측정은 그 변경을 쓰는 데 얼마나 걸렸는지 상관하지 않습니다. |
| "개선이 뻔하니 다시 측정할 필요 없습니다" | 그렇다면 다시 측정하는 비용은 작고, 그 측정이 개선을 증명합니다. 측정하지 않은 승리가 중립적인 복잡도를 코드에 남기는 경로입니다. |

## 레드 플래그

- 정당화할 프로파일링 데이터 없는 최적화
- 데이터 조회의 N+1 쿼리 패턴
- 전후 쿼리 플랜으로 정당화하지 않고 추가한 인덱스
- 응답이 의존하는 입력(테넌트, 로케일, 열람자)을 뺀 캐시 키
- 명시한 스테일 구간도 무효화 전략도 없는 캐시
- 커넥션을 붙잡는 대상을 찾지 않은 채, 고갈에 대응해 올린 커넥션 풀 크기
- 페이지네이션이 없는 목록 엔드포인트
- 크기, 지연 로딩, 반응형 크기가 없는 이미지
- 리뷰 없이 커지는 번들 크기
- 프로덕션에 성능 모니터링이 없음
- 곳곳의 `React.memo`와 `useMemo` (남용은 부족만큼 나쁩니다)
- 정당화하는 재측정 없이 유지된 최적화
- 여러 최적화가 측정 하나에 묶여, 어느 한 변경도 귀속할 수 없음
- 테스트를 바꾸거나, 건너뛰거나, 삭제해야 했던 "승리"
- 첫 시도를 아무도 기록하지 않아 한 번 넘게 시도된, 같은 실패 최적화

## 검증

성능 관련 변경 뒤:

- [ ] 전후 측정이 있습니다 (구체적인 숫자)
- [ ] 결과를 기준선과 같은 방식으로 다시 측정했습니다 (같은 명령, 같은 조건)
- [ ] 개선 폭이 실행 간 편차를 넘습니다. 평균만 넘는 것으로는 부족합니다
- [ ] 기준선을 넘지 못한 변경은 중립으로 남기지 않고 되돌렸습니다
- [ ] 유지한 시도와 되돌린 시도를 모두 기록해, 폐기된 아이디어를 다시 실행하지 않습니다
- [ ] 특정 병목을 식별하고 다루었습니다
- [ ] Core Web Vitals가 "좋음" 임계값 안에 있습니다
- [ ] 번들 크기가 크게 늘지 않았습니다
- [ ] 새 데이터 조회 코드에 N+1 쿼리가 없습니다
- [ ] 새 인덱스는 전후 쿼리 플랜으로 정당화되고, 쓰기 비용을 고려했습니다
- [ ] 새 캐시는 키에 무엇을 넣고 어떻게 스테일해지는지 밝힙니다
- [ ] 측정한 사용자 대면 지표에, 회귀를 탐지할 수 있는 합성 예산 또는 필드 모니터가 있습니다
- [ ] 기존 테스트가 여전히 통과합니다 (최적화가 동작을 깨지 않았습니다)
