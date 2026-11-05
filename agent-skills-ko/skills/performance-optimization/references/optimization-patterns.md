# 최적화 패턴

`performance-optimization` 스킬 3단계에서 이름 붙인 안티패턴의 구체적인 수정입니다. 스킬은 규칙과 찾을 시그니처를 말하고, 이 파일은 구체적인 구현 하나를 보여 줍니다. 2단계가 병목을 식별한 뒤 필요한 섹션을 여세요. 처음부터 끝까지 순서대로 읽도록 만든 문서는 아닙니다.

체크리스트, 측정 명령, TTFB 진단, 캐싱의 읽기/쓰기 전략은 `../../../references/performance-checklist.md`에 있습니다.

<a id="n1-queries-backend"></a>
## N+1 쿼리 (백엔드)

```typescript
// BAD: N+1 — one query per task for the owner
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// GOOD: Single query with join/include
const tasks = await db.tasks.findMany({
  include: { owner: true },
});
```

<a id="unbounded-data-fetching"></a>
## 제한 없는 데이터 조회

```typescript
// BAD: Fetching all records
const allTasks = await db.tasks.findMany();

// GOOD: Paginated with limits
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

<a id="queries-that-ignore-their-index"></a>
## 인덱스를 무시하는 쿼리

"인덱스를 추가하라"는 추측입니다. 쿼리 플랜이 측정입니다.

```sql
EXPLAIN ANALYZE
SELECT id, title FROM tasks
WHERE owner_id = 42 ORDER BY created_at DESC LIMIT 20;
```

출력의 세 가지가 수정을 결정합니다.

| 보이는 것 | 의미 |
|---|---|
| 인덱스를 기대했는데 큰 테이블의 `Seq Scan` | 이 조건에 쓸 수 있는 인덱스가 없습니다 |
| 추정 `rows=`가 실제와 자릿수 하나만큼 어긋남 | 통계가 오래되었습니다. 플래너가 나쁜 정보로 고르고 있습니다 |
| 스캔 위의 `Sort` 노드 | 인덱스는 필터를 커버하지만 `ORDER BY`는 커버하지 않습니다 |

인덱스는 컬럼 하나가 아니라 **쿼리의 형태**에 맞춰 거세요. 복합 인덱스에서는 동등 비교 컬럼이 먼저이고, 그다음이 범위 또는 정렬 컬럼입니다.

```sql
CREATE INDEX idx_tasks_owner_created ON tasks (owner_id, created_at DESC);
```

**인덱스가 도움이 되지 않을 때:**

| 상황 | 이유 |
|---|---|
| 낮은 선택도. 지배적 값을 조회 (`active`가 95%인 `status` 컬럼을 `active`로 필터) | 순차 스캔이 실제로 더 쌉니다. 플래너는 인덱스를 무시합니다. 드문 값을 필터하는 것은 반대 경우이고, 부분 인덱스가 그 경우를 잘 처리합니다 |
| 선행 와일드카드 (`LIKE '%term'`) | B-tree는 접두사 없이 seek할 수 없습니다. trigram 또는 전문 검색이 필요합니다 |
| 컬럼에 함수를 적용 (`WHERE lower(email) = ?`) | 일반 컬럼 인덱스는 쓸 수 없습니다. 대신 식을 인덱싱하세요 |
| 쓰기가 많은 테이블 | 모든 인덱스는 모든 `INSERT`/`UPDATE`에 대한 세금입니다. 읽기 이득과 함께 쓰기 비용도 측정하세요 |

이후에 `EXPLAIN ANALYZE`를 다시 실행하세요. 플랜을 바꾸지 못한 인덱스는 되돌리기(4단계)이며, 공짜가 아닙니다. 모든 쓰기에 여전히 비용이 듭니다.

<a id="connection-pool-exhaustion"></a>
## 커넥션 풀 고갈

시그니처는 뚜렷합니다. **모든** 엔드포인트가 한꺼번에 느려지고, 느린 시간은 실행이 아니라 커넥션 대기에 쓰이며, 데이터베이스는 대부분 유휴 세션을 보고합니다.

```typescript
// BAD: a pool per request or per module — under serverless this multiplies
// by instance count and exhausts the database's connection limit
// GOOD: one pool per process, sized against the database's ceiling
const pool = new Pool({
  max: 10,                        // instances × max must stay under max_connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000, // fail fast instead of queueing forever
});
```

**더 크다고 더 빠르지 않습니다.** 데이터베이스가 동시에 실행할 수 있는 것보다 큰 풀은 큐를 앱에서 데이터베이스로 옮길 뿐이고, 거기서는 보기가 더 어렵습니다. 인스턴스 수에 상한이 없을 때(서버리스, 오토스케일링) 고치는 방법은 `max`를 높이는 것이 아니라, 커넥션을 다중화하는 프록시(pgbouncer, RDS Proxy)입니다.

<a id="missing-image-optimization-frontend"></a>
## 빠진 이미지 최적화 (프론트엔드)

```html
<!-- BAD: No dimensions, no format optimization -->
<img src="/hero.jpg" />

<!-- GOOD: Hero / LCP image — art direction + resolution switching, high priority -->
<!--
  Two techniques combined:
  - Art direction (media): different crop/composition per breakpoint
  - Resolution switching (srcset + sizes): right file size per screen density
-->
<picture>
  <!-- Mobile: portrait crop (8:10) -->
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.avif 400w, /hero-mobile-800.avif 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/avif"
  />
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.webp 400w, /hero-mobile-800.webp 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/webp"
  />
  <!-- Desktop: landscape crop (2:1) -->
  <source
    srcset="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-1600.avif 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/avif"
  />
  <source
    srcset="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/webp"
  />
  <img
    src="/hero-desktop.jpg"
    width="1200"
    height="600"
    fetchpriority="high"
    alt="Hero image description"
  />
</picture>

<!-- GOOD: Below-the-fold image — lazy loaded + async decoding -->
<img
  src="/content.webp"
  width="800"
  height="400"
  loading="lazy"
  decoding="async"
  alt="Content image description"
/>
```

<a id="unnecessary-re-renders-react"></a>
## 불필요한 리렌더 (React)

```tsx
// BAD: Creates new object on every render, causing children to re-render
function TaskList() {
  return <TaskFilters options={{ sortBy: 'date', order: 'desc' }} />;
}

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function TaskList() {
  return <TaskFilters options={DEFAULT_OPTIONS} />;
}

// Use React.memo for expensive components
const TaskItem = React.memo(function TaskItem({ task }: Props) {
  return <div>{/* expensive render */}</div>;
});

// Use useMemo for expensive computations
function TaskStats({ tasks }: Props) {
  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  return <div>{stats.completed} / {stats.total}</div>;
}
```

<a id="large-bundle-size"></a>
## 큰 번들 크기

```typescript
// Modern bundlers (Vite, webpack 5+) handle named imports with tree-shaking automatically,
// provided the dependency ships ESM and is marked `sideEffects: false` in package.json.
// Profile before changing import styles — the real gains come from splitting and lazy loading.

// GOOD: Dynamic import for heavy, rarely-used features
const ChartLibrary = lazy(() => import('./ChartLibrary'));

// GOOD: Route-level code splitting wrapped in Suspense
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPage />
    </Suspense>
  );
}
```

<a id="missing-caching-backend"></a>
## 빠진 캐싱 (백엔드)

만들기 비용이 크고, 바뀌는 횟수보다 훨씬 자주 읽는 것을 캐시하세요. 이미 빨랐던 쿼리를 캐시하면 유지해야 할 네트워크 홉, 스테일 버그, 퇴거 정책만 더하고, 얻는 것은 없습니다.

**계층을 의도적으로 고르세요.**

| 계층 | 보이는 범위 | 사용할 때 | 비용 |
|---|---|---|---|
| 프로세스 안 (`Map`, LRU) | 인스턴스 하나 | 작고 핫하며, 인스턴스별 스테일을 허용할 수 있을 때 | 각 인스턴스가 따로 어긋납니다. 무효화는 하나에만 닿습니다 |
| 공유 (Redis, Memcached) | 모든 인스턴스 | 인스턴스가 같은 값을 봐야 하거나, 값을 다시 계산하는 비용이 클 때 | 네트워크 홉이 생기고, 운영하고 모니터링할 서비스가 하나 더 생깁니다 |
| CDN / 엣지 | 모든 사용자, URL 단위 | 응답이 공개이고, 주어진 키에 대해 동일할 때 | 어려운 부분은 무효화입니다. 나쁜 응답을 빨리 거둬들일 수 없다고 가정하세요 |

```typescript
// Cache frequently-read, rarely-changed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedConfig: AppConfig | null = null;
let cacheExpiry = 0;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig;
  }
  cachedConfig = await db.config.findFirst();
  cacheExpiry = Date.now() + CACHE_TTL;
  return cachedConfig;
}

// HTTP caching headers for static assets
app.use('/static', express.static('public', {
  maxAge: '1y',           // Cache for 1 year
  immutable: true,        // Never revalidate (use content hashing in filenames)
}));

// Cache-Control for API responses
res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
```

**키 설계가 정확성을 결정합니다.** 응답을 바꾸는 모든 입력은 키에 들어갑니다. 테넌트, 로케일, 권한, 피처 플래그입니다. 열람자를 뺀 키는 한 사용자의 데이터가 다른 사용자에게 전달되는 경로이고, 그 상태로 성능 승리처럼 프로덕션에 나갑니다.

**무효화 전략은 세 가지를 섞지 말고 하나를 고르세요.**

| 전략 | 트레이드오프 |
|---|---|
| TTL | 가장 단순합니다. TTL까지의 스테일을 받아들이므로, 허용 구간을 명시하세요 |
| 이벤트 또는 태그 기반 | 쓸 때 최신이 됩니다. 다만 쓰는 쪽이 캐시 토폴로지를 알아야 합니다 |
| 버전이 있는 키 (`user:42:profile:v7`) | 무효화하지 않고 옛 키를 더는 읽지 않을 뿐입니다. 퇴거될 때까지 메모리를 씁니다 |

**스탬피드를 막으세요.** 핫 키가 만료되면 동시 요청이 함께 미스하고, 오리진이 한꺼번에 전체 부하를 받습니다. 캐시가 장애를 막지 못하고 장애가 되는 경로입니다. 단일 요청이 다시 계산하는 동안 스테일을 제공하거나 (`stale-while-revalidate`), 동시 미스를 하나의 진행 중 프로미스 뒤로 합치세요. 그러면 기다리는 쪽이 N개여도 재계산은 한 번입니다.

**캐시하지 마세요.** 스테일이 정확성 버그가 되는 것(잔액, 권한, 결제 시점의 재고), 그리고 사용자를 식별하지 않는 키 아래의 사용자별 데이터입니다. 요청 합치기, 쓰기 전략, 네거티브 캐싱, 캐시 체크리스트는 `../../../references/performance-checklist.md#caching-strategies`를 보세요.
