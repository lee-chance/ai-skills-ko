# 하드닝 패턴

`security-and-hardening` 스킬을 위한 코드 패턴과 판단 보조입니다. 스킬이 각 규칙을 말하고, 이 파일은 그 규칙의 구체적인 구현을 하나 보여 줍니다. 그 코드에 도달했을 때 필요한 절을 여세요. 처음부터 끝까지 읽으라고 만든 문서가 아닙니다.

공유 체크리스트(위협 모델링, 커밋 전 검사, 보안 헤더, CORS, 패키지 매니저 매트릭스, 설치 스크립트 게이트, OWASP 빠른 참조 표)는 `../../../references/security-checklist.md`에 있습니다.

## OWASP Top 10 예방 패턴

이것은 예방 패턴이며, 순위가 아닙니다. 2021년 순서는 `../../../references/security-checklist.md#owasp-top-10-quick-reference`의 빠른 참조 표를 보세요.

### <a id="injection"></a>인젝션

```typescript
// BAD: SQL injection via string concatenation
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// GOOD: Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// GOOD: ORM with parameterized input
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### <a id="broken-authentication"></a>취약한 인증

```typescript
// Password hashing
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);
const isValid = await compare(plaintext, hashedPassword);

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,  // From environment, not code
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // Not accessible via JavaScript
    secure: true,       // HTTPS only
    sameSite: 'lax',    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
}));
```

### <a id="cross-site-scripting-xss"></a>크로스 사이트 스크립팅 (XSS)

```typescript
// BAD: Rendering user input as HTML
element.innerHTML = userInput;

// GOOD: Use framework auto-escaping (React does this by default)
return <div>{userInput}</div>;

// If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### <a id="broken-access-control"></a>취약한 접근 제어

```typescript
// Always check authorization, not just authentication
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Task not found' }
    });
  }

  // Check that the authenticated user owns this resource
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Not authorized to modify this task' }
    });
  }

  // Proceed with update
  const updated = await taskService.update(req.params.id, req.body);
  return res.json(updated);
});
```

### <a id="security-misconfiguration"></a>보안 설정 오류

```typescript
// Security headers (use helmet for Express)
import helmet from 'helmet';
app.use(helmet());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // Tighten if possible
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
  },
}));

// CORS — restrict to known origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
```

### <a id="sensitive-data-exposure"></a>민감 데이터 노출

```typescript
// Never return sensitive fields in API responses
function sanitizeUser(user: UserRecord): PublicUser {
  const { passwordHash, resetToken, ...publicFields } = user;
  return publicFields;
}

// Use environment variables for secrets
const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) throw new Error('STRIPE_API_KEY not configured');
```

### <a id="server-side-request-forgery-ssrf"></a>서버 측 요청 위조 (SSRF)

서버가 사용자가 영향을 준 URL을 가져올 때마다, 웹훅, "URL에서 가져오기", 이미지 프록시, 링크 미리보기처럼, 공격자는 그것을 내부 서비스(클라우드 메타데이터, `localhost`, 사설 IP)로 겨냥할 수 있습니다.

```typescript
// BAD: fetch whatever the user gives you
await fetch(req.body.webhookUrl);

// GOOD: allowlist scheme + host, reject if ANY resolved IP is private, forbid redirects
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

const ALLOWED_HOSTS = new Set(['hooks.example.com']);

async function assertSafeUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('https only');
  if (!ALLOWED_HOSTS.has(url.hostname)) throw new Error('host not allowed');
  // Resolve ALL records; a single private/reserved address fails the check.
  const addrs = await lookup(url.hostname, { all: true });
  if (addrs.some((a) => ipaddr.parse(a.address).range() !== 'unicast')) {
    throw new Error('private/reserved IP');
  }
  return url;
}

await fetch(await assertSafeUrl(req.body.webhookUrl), { redirect: 'error' });
```

`range() !== 'unicast'` 검사는 루프백, 링크 로컬 `169.254.169.254`(클라우드 메타데이터, SSRF 표적 1순위), 사설, 유니크 로컬 범위를 IPv4와 IPv6 모두에서 다룹니다.

**주의. 여기에도 TOCTOU 간격이 있습니다.** `fetch`는 검사 뒤에 DNS를 다시 확인하므로, TTL이 짧은 레코드를 쓰는 공격자는 검증과 연결 사이에 내부 IP로 리바인딩할 수 있습니다. 위험이 높은 표면에서는 한 번만 확인하고 고정된 IP로 연결하거나, 앞에 필터링 에이전트를 두세요 (`request-filtering-agent` / `ssrf-req-filter`).

## 입력 검증 패턴

### <a id="schema-validation-at-boundaries"></a>경계에서의 스키마 검증

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().max(200).trim().min(1),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});

// Validate at the route handler
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.flatten(),
      },
    });
  }
  // result.data is now typed and validated
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### <a id="file-upload-safety"></a>파일 업로드 안전

```typescript
// Restrict file types and sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateUpload(file: UploadedFile) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError('File type not allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large (max 5MB)');
  }
  // Don't trust the file extension — check magic bytes if critical
}
```

### <a id="destructive-operations-on-derived-paths"></a>파생 경로에 대한 파괴적 작업

삭제, 이동, 덮어쓰기는 대상을 가리키는 값만큼만 안전합니다. 그 값을 커널, 작업 페이로드, 형제 서비스에서 읽었다는 사실은 값이 *어디서 도착했는지*만 보여줄 뿐, *누가 썼는지*는 보여 주지 않습니다. 다른 프로세스의 명령줄은 폼 필드만큼 공격자가 통제할 수 있습니다. 형태 검사("절대 경로이고, 디렉터리가 최소 한 단계 있다")는 형식이 올바른지만 증명하며, 인가로 오해되기 쉽습니다. 그래서 정리 루틴이 잎이 아니라 루트를 지웁니다.

파괴적 호출 전에 세 가지를 모두 요구하세요. 확인된 대상이 **허용된 루트** 아래에 있을 것(심볼릭 링크를 해석한 뒤에 비교하고, 원문 문자열로 비교하지 마세요). 그 루트보다 최소 한 단계 **아래**여서, 루트 자신이 대상이 되지 않을 것. **자신의 것이라는 증거**를 가질 것. 그 증거는 작업 *전에*, 그리고 그 증거를 없애는 어떤 해체보다 *전에* 읽어야 합니다. 그렇지 않으면 "없다"와 "내 것이 아니다"를 구별할 수 없습니다. 거부하면 거부된 대상을 로그하고 멈추세요. 더 넓은 기본 경로로 후퇴하는 정리는, 이 검사가 막으려는 바로 그 실패입니다. 동작 예는 `../../../references/security-checklist.md#destructive-path-operations`에 있습니다.

검사는 읽히는 것보다 약하므로, 한계가 두 가지 있습니다. 트리 안의 마커는 자기 증명입니다. 그곳에 쓸 수 있는 것은 무엇이든 마커도 쓸 수 있습니다. 그래서 기대하는 소유자는 인증된 상태에서 와야 하고, 마커가 인가로 인정되려면 무결성 보호(제한적인 소유권, 또는 MAC)가 필요합니다. 그리고 경로를 확인한 뒤 *이름*으로 작업하는 것은, 신뢰할 수 없는 프로세스가 조상 경로를 바꿀 수 있는 곳에서는 검사/사용 경합입니다. 공유 볼륨에서는 대상을 디스크립터로 붙잡고 no-follow를 쓰거나, 루트 아래에서만 동작하거나, 그 시간 동안 계층이 바뀌지 않게 하세요.

## <a id="dependency-audit-triage"></a>의존성 감사 트리아지

패키지 매니저 감사는 알려진 권고를 보고할 뿐, 패키지가 신뢰할 만하다거나 취약한 코드에 도달할 수 있다는 것을 증명하지 않습니다. 이 결정 트리를 사용하세요.

```
네이티브 패키지 매니저 감사가 취약점을 보고함
├── 심각도: critical 또는 high
│   ├── 취약한 코드가 런타임, 빌드, 테스트, 배포 경로에서 도달 가능한가?
│   │   ├── 예 --> 즉시 수정 (의존성을 업데이트, 패치, 또는 교체)
│   │   └── 아니오 (해당 경로에서 미사용이 확인됨) --> 곧 수정하되, 블로커는 아님
│   └── 수정본이 있는가?
│       ├── 예 --> 패치된 버전으로 업데이트
│       └── 아니오 --> 우회책을 확인하고, 의존성 교체를 검토하거나, 재검토 날짜와 함께 허용 목록에 추가
├── 심각도: moderate
│   ├── 프로덕션에서 도달 가능한가? --> 다음 릴리스 주기에서 수정
│   └── 개발 전용인가? --> 여유 있을 때 수정하고, 백로그에 기록
└── 심각도: low
    └── 정기 의존성 업데이트 때 추적하고 수정
```

**핵심 질문:**
- 취약한 함수가 여러분의 코드 경로에서 실제로 호출됩니까?
- 그 의존성은 런타임 의존성입니까, 개발 전용입니까?
- 배포 맥락에서 그 취약점이 악용 가능합니까(예: 클라이언트 전용 앱 안의 서버 측 취약점)?

수정을 미룰 때는 이유를 문서화하고 재검토 날짜를 정하세요.

## <a id="rate-limiting"></a>요청 제한

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter limit for auth endpoints
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // 10 attempts per 15 minutes
}));
```

**프로세스가 둘 이상이 되면 공유 저장소에서 세세요.** `express-rate-limit`은 기본적으로 프로세스 메모리에 카운터를 둡니다. 로드 밸런서 뒤에서는 인스턴스마다 자기 카운트를 가지므로, 실효 한도는 `max × instances`입니다. 서버리스나 엣지 런타임에서는 새 호출이 0에서 시작하므로, 위의 인증 한도가 아예 발동하지 않을 수 있습니다. 공유 `store`(Redis, `rate-limit-redis` 경유)를 넘기거나, 오래 유지되는 TCP 연결이 없는 곳에서도 동작하는 HTTP 기반 리미터를 쓰세요(예: `@upstash/ratelimit`).

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),                       // UPSTASH_REDIS_REST_URL + _TOKEN
  limiter: Ratelimit.slidingWindow(10, '15 m'), // 10 attempts per 15 minutes, across all instances
});
const { success } = await authLimiter.limit(`login:${req.ip}`);
if (!success) return res.status(429).end();
```

## <a id="secrets-management"></a>시크릿 관리

```
.env 파일:
  ├── .env.example  → 커밋함 (플레이스홀더 값이 있는 템플릿)
  ├── .env          → 커밋하지 않음 (실제 시크릿이 있음)
  └── .env.local    → 커밋하지 않음 (로컬 덮어쓰기)

.gitignore에 반드시 포함할 것:
  .env
  .env.local
  .env.*.local
  *.pem
  *.key
```

**커밋하기 전에 항상 확인하세요:**
```bash
# Check for accidentally staged secrets — prints only the names of files whose
# staged diff matches, so the raw value never lands in terminal output or agent
# tool logs. Any output means review those files before committing.
git diff --cached -i -G'password|secret|api_key|token' --name-only
```

**시크릿이 한 번이라도 커밋되었다면, 그것을 교체하세요.** 줄을 지우거나 이력을 다시 쓰는 것만으로는 충분하지 않습니다. 리모트에 닿는 순간 유출된 것으로 보세요. 먼저 키를 폐기하고 다시 발급한 다음, 이력에서 지우세요.

## <a id="data-classification"></a>데이터 분류

필드를 추가할 때 개인 데이터를 분류하세요. 그래야 나중에 내보내기와 삭제 요청이 그 데이터를 찾을 수 있습니다.

| 등급 | 예 | 처리 |
|---|---|---|
| **비개인** | 집계, 익명화된 횟수 | 일반 처리 |
| **개인 (PII)** | 이름, 이메일, IP, 기기/사용자 ID | 최소화, 접근 제어, 내보내기/삭제에 포함 |
| **민감** | 건강, 금융, 위치, 생체 정보, 정부 발급 ID, 미성년자에 관한 모든 것 | 수집에 추가 근거, 더 엄격한 접근, 대개 암호화와 감사 로깅 |

## <a id="llm-output-handling"></a>LLM 출력 처리

```typescript
// BAD: trusting model output as a command or as markup
const sql = await llm.generate(`Write SQL for: ${userQuestion}`);
await db.query(sql);                                   // arbitrary query execution
container.innerHTML = await llm.reply(userMessage);   // stored XSS, via the model

// GOOD: model output is data — parse defensively, then validate, then encode
let intent;
try {
  intent = CommandSchema.parse(JSON.parse(await llm.replyJson(userMessage)));
} catch {
  throw new ValidationError('unexpected model output'); // JSON.parse or schema failed
}
await runAllowlistedAction(intent.action, intent.params);
container.textContent = await llm.reply(userMessage);
```
