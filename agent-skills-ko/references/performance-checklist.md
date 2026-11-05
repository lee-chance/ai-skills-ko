# 성능 체크리스트

웹 애플리케이션 성능을 위한 빠른 참조 체크리스트입니다. `performance-optimization` 스킬과 함께 사용하세요.

## 목차

- [Core Web Vitals 목표](#core-web-vitals-목표)
- [TTFB 진단](#ttfb-진단)
- [프론트엔드 체크리스트](#프론트엔드-체크리스트)
- [백엔드 체크리스트](#백엔드-체크리스트)
- [캐시 전략](#캐시-전략)
- [측정 명령](#측정-명령)
- [흔한 안티 패턴](#흔한-안티-패턴)

## Core Web Vitals 목표

| 지표 | 좋음 | 개선 필요 | 나쁨 |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## TTFB 진단

TTFB가 느릴 때(> 800ms), DevTools Network 워터폴에서 각 구간을 확인하세요.

- [ ] **DNS 조회**가 느림: 알려진 오리진에 `<link rel="dns-prefetch">` 또는 `<link rel="preconnect">`를 추가하세요
- [ ] **TCP/TLS 핸드셰이크**가 느림: HTTP/2를 켜고, 엣지 배포를 검토하고, keep-alive를 확인하세요
- [ ] **서버 처리**가 느림: 백엔드를 프로파일하고, 느린 쿼리를 확인하고, 캐시를 추가하세요

## 프론트엔드 체크리스트

### 이미지
- [ ] 이미지가 최신 포맷(WebP, AVIF)을 사용합니다
- [ ] 이미지가 반응형 크기(`srcset`와 `sizes`)로 제공됩니다
- [ ] 이미지와 `<source>` 요소에 명시적인 `width`와 `height`가 있습니다 (아트 디렉션에서 CLS를 막습니다)
- [ ] 폴드 아래 이미지는 `loading="lazy"`와 `decoding="async"`를 사용합니다
- [ ] 히어로/LCP 이미지는 `fetchpriority="high"`를 쓰고 지연 로딩을 쓰지 않습니다

### JavaScript
- [ ] 번들 크기가 gzip 기준 200KB 미만입니다 (초기 로드)
- [ ] 라우트와 무거운 기능에 동적 `import()`로 코드를 나눕니다
- [ ] 트리 셰이킹이 켜져 있습니다 (의존성이 ESM을 제공하고 `sideEffects: false`를 표시하는지 확인하세요)
- [ ] `<head>`에 렌더를 막는 JavaScript가 없습니다 (`defer` 또는 `async`를 사용하세요)
- [ ] 무거운 계산은 Web Workers로 넘깁니다 (해당되는 경우)
- [ ] 같은 props로 다시 렌더되는 비싼 컴포넌트에 `React.memo()`를 씁니다
- [ ] `useMemo()` / `useCallback()`은 프로파일링에서 이득이 확인된 곳에만 씁니다
- [ ] 긴 작업(> 50ms)을 쪼개 메인 스레드를 비워 둡니다. INP의 주요 수단입니다
- [ ] 오래 도는 루프 안에 `yieldToMain` 패턴을 써서, 청크 사이에 입력 이벤트가 실행되게 합니다
- [ ] 가능한 곳에서 최신 스케줄링 API를 사용합니다: `scheduler.yield()`(우선), 우선순위가 있는 `scheduler.postTask()`, 필요할 때만 양보하는 `isInputPending()`
- [ ] 미룰 수 있는 긴급하지 않은 작업(분석 플러시, prefetch, 워밍업)에 `requestIdleCallback`을 씁니다
- [ ] 중요하지 않은 작업(예: 분석, 로깅)을 이벤트 핸들러 밖으로 미뤄, 상호작용에 대한 응답이 지연되지 않게 합니다
- [ ] 서드파티 스크립트는 `async` / `defer`로 로드하고 크기를 감사합니다. 무거울 때는 파사드를 앞에 둡니다 (채팅 위젯, 임베드)

### CSS
- [ ] 크리티컬 CSS를 인라인하거나 preload합니다
- [ ] 중요하지 않은 스타일에 렌더를 막는 CSS가 없습니다
- [ ] 프로덕션에 CSS-in-JS 런타임 비용이 없습니다 (추출을 사용하세요)

### 폰트
- [ ] 폰트 패밀리는 2–3개, 각각 웨이트 2–3개로 제한합니다 (웨이트가 하나 늘 때마다 요청이 하나 늘니다)
- [ ] WOFF2 포맷만 사용합니다 (가장 작고 지원이 보편적입니다. WOFF/TTF/EOT는 건너뛰세요)
- [ ] 가능하면 자체 호스팅합니다 (서드파티 폰트 CDN은 DNS + TCP + TLS 왕복을 더합니다)
- [ ] LCP에 중요한 폰트는 preload합니다: `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- [ ] FOIT가 렌더를 막지 않도록 `font-display: swap`(중요하지 않으면 `optional`)을 씁니다
- [ ] `unicode-range`로 서브셋하여, 각 페이지에 필요한 글리프만 보냅니다
- [ ] 여러 웨이트/스타일이 필요하면 가변 폰트를 검토합니다 (파일 하나가 여러 파일을 대체합니다)
- [ ] 폰트 교체 시 CLS를 줄이도록 `size-adjust`, `ascent-override`, `descent-override`로 폴백 폰트 메트릭을 조정합니다
- [ ] 커스텀 폰트 전에 시스템 폰트 스택을 검토합니다

### 네트워크
- [ ] 정적 자산은 긴 `max-age`와 콘텐츠 해시로 캐시합니다
- [ ] 적절한 곳의 API 응답은 캐시합니다 (`Cache-Control`)
- [ ] HTTP/2 또는 HTTP/3가 켜져 있습니다
- [ ] 알려진 오리진에 리소스를 preconnect합니다 (`<link rel="preconnect">`)
- [ ] 중요한 이미지가 아닌 리소스에도 `fetchpriority`를 사용합니다 (예: 핵심 `<link rel="preload">`, 폴드 위 `<script>`). `<img>`에만 쓰지 마세요
- [ ] 불필요한 리다이렉트가 없습니다

### 렌더링
- [ ] 레이아웃 스래싱이 없습니다 (강제 동기 레이아웃)
- [ ] 애니메이션은 `transform`과 `opacity`를 사용합니다 (GPU 가속)
- [ ] 긴 목록은 가상화를 사용합니다 (예: `react-window`)
- [ ] 불필요한 전체 페이지 리렌더가 없습니다
- [ ] 화면 밖 섹션은 `content-visibility: auto`와 `contain-intrinsic-size`로, 보이지 않는 영역의 레이아웃과 페인트를 건너뜁니다
- [ ] HTML 응답에 `unload` 이벤트 핸들러와 `Cache-Control: no-store`를 두지 않습니다. 뒤로/앞으로 캐시(bfcache) 자격을 유지합니다

## 백엔드 체크리스트

### 데이터베이스
- [ ] N+1 쿼리 패턴이 없습니다 (즉시 로딩(eager loading) / join을 사용하세요)
- [ ] 쿼리에 적절한 인덱스가 있습니다
- [ ] 목록 엔드포인트는 페이지네이션합니다 (`SELECT * FROM table`은 쓰지 마세요)
- [ ] 커넥션 풀링이 구성되어 있습니다
- [ ] 슬로우 쿼리 로깅이 켜져 있습니다

#### 쿼리 플랜
- [ ] `EXPLAIN ANALYZE`를 수정 **전에** 캡처합니다. 수정 후에만 하지 마세요. 이것이 기준선입니다
- [ ] 큰 테이블의 `Seq Scan`을 이해합니다. 인덱스가 없거나, 쓸 수 없거나, 정말로 가치가 없는 경우입니다
- [ ] 추정 `rows=`와 실제 `rows=`가 10배(한 자릿수 배) 이내입니다 (아니면 인덱스를 건드리기 전에 통계를 갱신하세요)
- [ ] 복합 인덱스가 흡수할 수 있는 `Sort` 노드가 없습니다
- [ ] 변경 후 플랜을 다시 확인합니다. 플랜을 바꾸지 못한 인덱스는 되돌리세요

#### 인덱스 전략
- [ ] 복합 인덱스 컬럼 순서는 동등 조건이 먼저, 그다음 범위/정렬입니다
- [ ] 인덱스가 쿼리 형태(필터 + 정렬)를 덮습니다. 한 컬럼만 따로 보지 마세요
- [ ] 핫한 읽기 경로에는 커버링 인덱스를 검토합니다 (인덱스 전용 스캔은 힙 페치를 피합니다)
- [ ] 선택도가 낮은 컬럼을 *지배적인 값* 때문에 인덱싱하지 않습니다. 부분 인덱스는 드문 값 쿼리(`WHERE status = 'failed'`)를 여전히 처리합니다
- [ ] 쿼리가 함수를 적용하는 곳에는 표현식 인덱스를 사용합니다 (`lower(email)`)
- [ ] 앞쪽 와일드카드 검색에는 B-tree가 아니라 전문 검색 또는 trigram 인덱스를 사용합니다
- [ ] 쓰기가 많은 테이블에서 쓰기 비용을 측정합니다 (인덱스는 모든 `INSERT`/`UPDATE`에 비용을 더합니다)
- [ ] 쓰이지 않는 인덱스와 중복 인덱스는 제거합니다 (쓰기에 비용만 들고 얻는 것이 없습니다)

#### 커넥션 풀링
- [ ] 프로세스당 풀 하나입니다. 요청마다 또는 모듈마다 만들지 마세요
- [ ] `instances × pool max`가 데이터베이스의 `max_connections` 아래를 유지합니다
- [ ] `connectionTimeoutMillis`를 설정해, 고갈 시 영원히 대기하지 않고 빠르게 실패하게 합니다
- [ ] 크기를 바꾸기 전에 고갈 원인을 진단합니다. 커넥션을 붙잡는 것(긴 트랜잭션, 빠진 `await`, 누수된 클라이언트)을 찾으세요
- [ ] 서버리스 / 오토스케일링은 더 큰 풀 대신 다중화 프록시(pgbouncer, RDS Proxy)를 앞에 둡니다

### API
- [ ] 응답 시간이 200ms 미만입니다 (p95)
- [ ] 요청 핸들러에 동기적인 무거운 계산이 없습니다
- [ ] 개별 호출을 루프로 돌리지 않고 일괄 작업을 사용합니다
- [ ] 응답을 압축합니다 (gzip/brotli)
- [ ] 적절한 캐싱이 있습니다 (인메모리, Redis, CDN)

### 인프라
- [ ] 정적 자산용 CDN이 있습니다
- [ ] 서버가 사용자와 가깝습니다 (또는 엣지 배포)
- [ ] 수평 확장이 구성되어 있습니다 (필요한 경우)
- [ ] 로드 밸런서용 헬스 체크 엔드포인트가 있습니다

## 캐시 전략

어느 계층을 쓸지, 어느 무효화 전략을 쓸지, 무엇을 절대 캐시하지 않을지에 대한 판단 자료는 `performance-optimization` 스킬에 있습니다. 이 절은 읽기/쓰기 패턴과 체크리스트를 다룹니다.

### 읽기와 쓰기 패턴

| 패턴 | 동작 방식 | 쓸 때 | 주의할 점 |
|---|---|---|---|
| **Cache-aside** (지연) | 앱이 캐시를 확인하고, 미스면 원본을 읽어 채웁니다 | 기본 선택입니다. 읽기가 많고, 첫 조회가 차가워도 됩니다 | 미스마다 원본을 치므로 스탬피드 보호가 필요합니다 |
| **Read-through** | 캐시 계층이 미스 시 스스로 로드합니다 | 로드 경로를 호출 지점마다 두지 않고 한곳에 두고 싶을 때 | 원본 지연 시간을 숨깁니다. 느린 원본이 느린 캐시처럼 보입니다 |
| **Write-through** | 쓰기가 캐시와 원본에 함께, 동기적으로 갑니다 | 쓰기 이후 읽기가 절대 낡은 값을 보면 안 될 때 | 모든 쓰기에 캐시 지연 시간을 더합니다 |
| **Write-behind** (write-back) | 쓰기는 캐시에 닿고, 원본은 비동기로 갱신됩니다 | 쓰기가 많고 원본이 병목일 때 | 플러시 전에 캐시가 죽으면 데이터 손실 구간이 생깁니다. 방어할 수 있는 내구성이 필요합니다 |

### 네거티브 캐싱

결과의 *없음*도 캐시하세요. 조회할 때마다 미스하는 키(루프에서 찔러 보는 존재하지 않는 사용자 ID, 404 자산)는 모든 요청을 원본으로 보냅니다. 그런 캐시는 정상 경로만 보호합니다.

- 있는 항목보다 **더 짧은** TTL로 명시적인 "없음" 센티널을 저장하세요
- 새로 만들어진 레코드가 곧 나타나도록 네거티브 TTL을 충분히 짧게 유지하세요
- 원본 *오류*가 네거티브 캐시 항목이 되게 두지 마세요. 실패한 1분이 여러 번이 됩니다

### 요청 합치기 (스탬피드 보호)

재계산은 한 번, 대기자는 N명입니다. 핫 키가 만료될 때 동시 부하 전체가 원본으로 전달되지 않게 합니다.

```typescript
const inFlight = new Map<string, Promise<unknown>>();

function loadOnce<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const p = fetcher().finally(() => inFlight.delete(key));
  inFlight.set(key, p);
  return p;
}
```

공유 캐시에서는 같은 아이디어에 분산 락이 필요하거나, 대기자가 막히지 않고 낡은 값을 제공하도록 `stale-while-revalidate`가 필요합니다.

### 캐시 체크리스트
- [ ] 캐시할 호출이 비싼지 먼저 측정했습니다 (빠른 호출을 캐시하면 홉만 늘고 얻는 것이 없습니다)
- [ ] 읽기/쓰기 비율이 캐시를 정당화합니다 (쓰는 횟수보다 다시 읽는 횟수가 훨씬 많습니다)
- [ ] 캐시 키에 응답이 달라지는 모든 입력이 들어갑니다: 테넌트, 뷰어, 로케일, 권한, 피처 플래그
- [ ] 사용자를 식별하지 않는 키 아래에 사용자별 데이터를 캐시하지 않습니다
- [ ] 무효화 전략을 하나 골랐습니다 (TTL, 이벤트/태그, 또는 버전이 있는 키). 우연히 섞지 않습니다
- [ ] 허용할 수 있는 낡음 구간을 적어 두었습니다. 입력한 TTL이 암시하는 대로 두지 않습니다
- [ ] 핫 키에 스탬피드 보호가 있습니다 (합치기, 락, 또는 `stale-while-revalidate`)
- [ ] 네거티브 결과는 더 짧은 TTL로 캐시합니다. 원본 오류는 절대 캐시하지 않습니다
- [ ] 제거 정책과 메모리 상한을 설정했습니다 (상한 없는 캐시는 메모리 누수입니다)
- [ ] 적중률을 모니터링합니다. 아무도 측정하지 않는 캐시는 가정이고, 낮은 적중률은 순수한 오버헤드입니다
- [ ] 낡음이 정확성 버그가 되는 것은 캐시하지 않습니다 (잔액, 권한, 결제 시점의 재고)

## 측정 명령

### INP 필드 데이터와 DevTools 워크플로우

1. **필드 데이터부터.** 최적화하기 전에 실제 사용자 INP를 [CrUX Vis](https://developer.chrome.com/docs/crux/vis) 또는 RUM 도구에서 확인하세요
2. **느린 상호작용을 식별하세요.** DevTools → Performance 패널을 열고, 상호작용하는 동안 기록하세요. 클릭과 키 입력으로 발생한 긴 작업을 찾으세요
3. **중급 Android에서 테스트하세요.** INP 문제는 느린 하드웨어에서만 드러나는 경우가 많습니다. 실제 기기나 DevTools CPU 스로틀링(4×–6× 감속)을 사용하세요

```bash
# Lighthouse CLI
npx lighthouse http://localhost:3000 --output json --output-path ./report.json

# Bundle analysis
npx webpack-bundle-analyzer stats.json
# or for Vite:
npx vite-bundle-visualizer

# Check bundle size
npx bundlesize
```

```javascript
// Web Vitals in code
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);

// INP with interaction-level detail (attribution build). The attribution build
// exports the same names, so alias it when both builds share a module.
import { onINP as onINPWithAttribution } from 'web-vitals/attribution';
onINPWithAttribution(({ value, attribution }) => {
  const { interactionTarget, inputDelay, processingDuration, presentationDelay } = attribution;
  console.log({ value, interactionTarget, inputDelay, processingDuration, presentationDelay });
});
```

## 흔한 안티 패턴

| 안티 패턴 | 영향 | 해결 |
|---|---|---|
| N+1 쿼리 | DB 부하가 선형으로 늘어납니다 | join, include, 또는 배치 로딩을 사용하세요 |
| 상한 없는 쿼리 | 메모리 고갈, 타임아웃 | 항상 페이지네이션하고 LIMIT을 더하세요 |
| 빠진 인덱스 | 데이터가 늘수록 읽기가 느려집니다 | 필터/정렬 컬럼에 인덱스를 추가하세요 |
| 플랜을 읽지 않고 인덱싱 | 쓰기 비용은 치르고 읽기 이득은 입증되지 않습니다 | 전후로 `EXPLAIN ANALYZE`를 보세요. 플랜이 그대로면 되돌리세요 |
| 중복 / 미사용 인덱스 | 모든 쓰기가 비용을 냅니다 | 사용 통계를 감사하고, 아무도 읽지 않는 것을 제거하세요 |
| 요청마다 커넥션 풀 | 부하에서 `max_connections`를 고갈시킵니다 | 프로세스당 풀 하나. 서버리스는 프록시를 두세요 |
| 캐시 키에 뷰어가 빠짐 | 한 사용자의 데이터가 다른 사용자에게 제공됩니다 | 테넌트, 뷰어, 로케일, 권한으로 키를 구성하세요 |
| 상한 없는 캐시 | 최적화로 위장한 메모리 누수입니다 | 제거 정책과 메모리 상한을 설정하세요 |
| 핫 키의 캐시 스탬피드 | 만료 시 원본이 동시 부하 전체를 받습니다 | 미스를 합치거나 `stale-while-revalidate`를 쓰세요 |
| 레이아웃 스래싱 | 버벅임, 프레임 드롭 | DOM 읽기를 모은 다음 쓰기를 모으세요 |
| 최적화되지 않은 이미지 | 느린 LCP, 낭비되는 대역폭 | WebP, 반응형 크기, 지연 로딩을 사용하세요 |
| 큰 번들 | 느린 Time to Interactive | 코드를 나누고, 트리 셰이킹하고, 의존성을 감사하세요 |
| 메인 스레드 차단 | 나쁜 INP, 응답 없는 UI | `scheduler.yield()` / `yieldToMain`으로 긴 작업을 나누고, Web Workers로 넘기세요 |
| 메모리 누수 | 메모리가 늘고, 결국 크래시합니다 | 리스너, 인터벌, ref를 정리하세요 |
