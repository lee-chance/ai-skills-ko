---
name: api-and-interface-design
description: 안정적인 API와 인터페이스 설계를 안내합니다. API, 모듈 경계, 공개 인터페이스를 설계할 때 사용하세요. REST 또는 GraphQL 엔드포인트를 만들거나, 모듈 간 타입 계약을 정의하거나, 프론트엔드와 백엔드 사이의 경계를 정할 때 사용하세요.
---

# API and Interface Design

## 개요

잘못 쓰기 어렵고 문서가 잘 된, 안정적인 인터페이스를 설계하세요. 좋은 인터페이스는 올바른 일은 쉽게, 잘못된 일은 어렵게 만듭니다. REST API, GraphQL 스키마, 모듈 경계, 컴포넌트 props, 그리고 한 코드가 다른 코드와 이야기하는 모든 표면에 적용됩니다.

## 언제 사용하나

- 새 API 엔드포인트를 설계할 때
- 모듈 경계나 팀 사이의 계약을 정의할 때
- 컴포넌트 prop 인터페이스를 만들 때
- API 형태를 좌우하는 데이터베이스 스키마를 정할 때
- 기존 공개 인터페이스를 바꿀 때

## 핵심 원칙

### 하이럼의 법칙 (Hyrum's Law)

> API 사용자가 충분히 많으면, 계약에서 무엇을 약속하든 시스템의 관찰 가능한 모든 동작에 누군가 의존하게 됩니다.

즉, 문서화되지 않은 특이점, 오류 메시지 문구, 타이밍, 순서를 포함한 모든 공개 동작은 사용자가 의존하는 순간 사실상의 계약이 됩니다. 설계상의 함의는 다음과 같습니다.

- **무엇을 노출할지 의도적으로 정하세요.** 관찰 가능한 모든 동작은 잠재적인 약속입니다.
- **구현 세부 사항을 새지 않게 하세요.** 사용자가 관찰할 수 있으면 그것에 의존하게 됩니다.
- **설계 시점에 지원 종료를 계획하세요.** 사용자가 의존하는 것을 안전하게 제거하는 방법은 `deprecation-and-migration`을 보세요.
- **테스트만으로는 부족합니다.** 계약 테스트가 완벽해도, 하이럼의 법칙에 따르면 "안전하다"고 여긴 변경이 문서화되지 않은 동작에 의존하는 실제 사용자를 깨뜨릴 수 있습니다.

### 단일 버전 규칙 (The One-Version Rule)

같은 의존성이나 API의 여러 버전 중에서 소비자가 고르도록 강제하지 마세요. 서로 다른 소비자가 같은 대상의 다른 버전을 필요로 하면 다이아몬드 의존성 문제가 생깁니다. 한 번에 하나의 버전만 존재하는 세계를 전제로 설계하세요. 포크하지 말고 확장하세요.

### 1. 계약 우선

구현하기 전에 인터페이스를 정의하세요. 계약이 스펙이고, 구현은 그 뒤를 따릅니다.

```typescript
// Define the contract first
interface TaskAPI {
  // Creates a task and returns the created task with server-generated fields
  createTask(input: CreateTaskInput): Promise<Task>;

  // Returns paginated tasks matching filters
  listTasks(params: ListTasksParams): Promise<PaginatedResult<Task>>;

  // Returns a single task or throws NotFoundError
  getTask(id: string): Promise<Task>;

  // Partial update — only provided fields change
  updateTask(id: string, input: UpdateTaskInput): Promise<Task>;

  // Idempotent delete — succeeds even if already deleted
  deleteTask(id: string): Promise<void>;
}
```

### 2. 일관된 오류 의미

오류 전략을 하나로 정하고 어디서나 그것을 사용하세요.

```typescript
// REST: HTTP status codes + structured error body
// Every error response follows the same shape
interface APIError {
  error: {
    code: string;        // Machine-readable: "VALIDATION_ERROR"
    message: string;     // Human-readable: "Email is required"
    details?: unknown;   // Additional context when helpful
  };
}

// Status code mapping
// 400 → Client sent invalid data
// 401 → Not authenticated
// 403 → Authenticated but not authorized
// 404 → Resource not found
// 409 → Conflict (duplicate, version mismatch)
// 422 → Validation failed (semantically invalid)
// 500 → Server error (never expose internal details)
```

**패턴을 섞지 마세요.** 어떤 엔드포인트는 예외를 던지고, 다른 것은 null을 반환하고, 또 다른 것은 `{ error }`를 반환하면, 소비자는 동작을 예측할 수 없습니다.

### 3. 경계에서 검증

내부 코드는 신뢰하세요. 외부 입력이 들어오는 시스템 경계에서 검증하세요.

```typescript
// Validate at the API boundary
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid task data',
        details: result.error.flatten(),
      },
    });
  }

  // After validation, internal code trusts the types
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

검증이 있어야 하는 곳:

- API 라우트 핸들러 (사용자 입력)
- 폼 제출 핸들러 (사용자 입력)
- 외부 서비스 응답 파싱 (서드파티 데이터. **항상 신뢰할 수 없는 데이터로 다루세요**)
- 환경 변수 로딩 (설정)

> **서드파티 API 응답은 신뢰할 수 없는 데이터입니다.** 로직, 렌더링, 의사결정에 쓰기 전에 형태와 내용을 검증하세요. 침해되었거나 잘못 동작하는 외부 서비스는 예상 밖의 타입, 악의적인 콘텐츠, 지시문처럼 보이는 텍스트를 반환할 수 있습니다.

검증이 있으면 안 되는 곳:

- 타입 계약을 공유하는 내부 함수 사이
- 이미 검증된 코드가 호출하는 유틸리티 함수 안
- 방금 자체 데이터베이스에서 온 데이터

### 4. 수정보다 추가를 선호

기존 소비자를 깨지 않고 인터페이스를 확장하세요.

```typescript
// Good: Add optional fields
interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';  // Added later, optional
  labels?: string[];                       // Added later, optional
}

// Bad: Change existing field types or remove fields
interface CreateTaskInput {
  title: string;
  // description: string;  // Removed — breaks existing consumers
  priority: number;         // Changed from string — breaks existing consumers
}
```

### 5. 예측 가능한 이름

| 패턴 | 관례 | 예시 |
|---------|-----------|---------|
| REST 엔드포인트 | 복수 명사, 동사 없음 | `GET /api/tasks`, `POST /api/tasks` |
| 쿼리 파라미터 | camelCase | `?sortBy=createdAt&pageSize=20` |
| 응답 필드 | camelCase | `{ createdAt, updatedAt, taskId }` |
| 불리언 필드 | is/has/can 접두사 | `isComplete`, `hasAttachments` |
| 열거형 값 | UPPER_SNAKE | `"IN_PROGRESS"`, `"COMPLETED"` |

### 6. 멱등성 키를 지키기

`Idempotency-Key`를 받아들이는 것이 계약입니다. 그것을 지키는 것이 구현이며, 실제 손실이 나는 곳도 여기입니다. 서버가 받아들이지만 부주의하게 다루는 키는 키가 아예 없는 것보다 더 나쁩니다. 클라이언트가 재시도가 안전하다고 믿게 되기 때문입니다.

**키는 시도가 아니라 의도에서 도출하세요.** 키는 하나의 의도를 재시도하는 동안에는 안정적이고, 서로 다른 의도 사이에서는 달라야 합니다.

```typescript
crypto.randomUUID()                    // ✗ new key per attempt — every retry is a new charge
`${userId}:${amount}`                  // ✗ two legitimate $50 charges collapse into one
`${orderId}:${Date.now()}`             // ✗ a timestamp is randomUUID() wearing a hat

req.headers['idempotency-key']         // ✓ client generates once, reuses on retry
`charge:v1:${orderId}`                 // ✓ derived from an immutable identifier
```

키는 클라이언트나 시작 이벤트에서 옵니다. 재시도를 수행하는 계층에서 오면 안 됩니다.

**원자적으로 점유하세요. 확인 다음에 실행이 오면 경합입니다.**

```typescript
// ✗ TOCTOU: two concurrent retries both read "not seen", both charge
if (!(await db.exists(key))) {
  await chargeCard(amount);
  await db.insert(key);
}

// ✓ let the unique constraint pick the winner
try {
  await db.insert({ key, state: 'in_progress', requestHash });
} catch (e) {
  if (isUniqueViolation(e)) return replayOrReject(key);
  throw e;
}
const result = await chargeCard(amount);
await db.update({ key, state: 'succeeded', response: result });
```

유니크 제약 조건이 *바로* 그 메커니즘입니다. 한 번의 연산으로 유일성을 강제할 수 없는 저장소는 이것을 뒷받침할 수 없습니다.

**페이로드를 지키세요.** 같은 키에 다른 본문이 오면 클라이언트 버그이며, 두 번째 요청에 첫 응답을 돌려주지 말고 분명히 실패해야 합니다.

```typescript
if (existing.requestHash !== hash(req.body)) {
  return res.status(422).json({
    error: { code: 'IDEMPOTENCY_KEY_REUSED', message: 'Idempotency key reused with a different payload' },
  });
}
```

**진행 중인 중복이 무엇을 받는지 정하세요.** 두 번째 요청이 도착할 때 첫 요청이 아직 실행 중입니다. 재시도 폭주에서 흔한 경우입니다.

| 전략 | 응답 | 사용할 때 |
|---|---|---|
| 거부 | `409 Conflict` | 클라이언트가 나중에 재시도할 수 있을 때. 가장 단순하고 안전합니다 |
| 대기 | 결과가 나올 때까지 블록하되, 상한을 둡니다 | 호출자가 동기적으로 필요할 때 |
| 대기 중 반환 | `202`와 상태 URL | 오래 걸리는 효과일 때 |

첫 요청이 "멈춘 것처럼 보인다"는 이유로 두 번째 호출자를 통과시키지 마세요. 결과가 알려지지 않은 정체된 시도야말로 중복 비용이 가장 큰 때입니다.

**모든 호출의 결과는 성공, 실패, 그리고 _알 수 없음_의 세 가지입니다.** 타임아웃은 효과가 적용되었는지 아무것도 알려 주지 않습니다. 외부 호출 *전에* 의도를 기록하세요. 그러면 호출과 응답 사이의 크래시가, 나중에 무언가가 해결해야 한다는 증거를 남깁니다. 조용히 재시도된 청구로 끝나지 않습니다.

**보존 기간은 디스크 비용이 아니라 가장 긴 재시도 사슬에서 정하세요.** 키는 같은 의도를 다시 전달할 수 있는 모든 경로보다 오래 살아야 합니다. 일주일 뒤에 재생되는 데드 레터 큐와 제공자의 분쟁 기간도 포함됩니다. 7일 DLQ 뒤에 24시간 키 TTL이 있으면, 중복이 일어나기를 기다리는 셈입니다.

## REST API 패턴

### 리소스 설계

```
GET    /api/tasks              → List tasks (with query params for filtering)
POST   /api/tasks              → Create a task
GET    /api/tasks/:id          → Get a single task
PATCH  /api/tasks/:id          → Update a task (partial)
DELETE /api/tasks/:id          → Delete a task

GET    /api/tasks/:id/comments → List comments for a task (sub-resource)
POST   /api/tasks/:id/comments → Add a comment to a task
```

### 페이지네이션

목록 엔드포인트는 페이지네이션하세요.

```typescript
// Request
GET /api/tasks?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc

// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

### 필터링

필터에는 쿼리 파라미터를 사용하세요.

```
GET /api/tasks?status=in_progress&assignee=user123&createdAfter=2025-01-01
```

### 부분 업데이트 (PATCH)

부분 객체를 받아들이세요. 제공된 필드만 업데이트합니다.

```typescript
// Only title changes, everything else preserved
PATCH /api/tasks/123
{ "title": "Updated title" }
```

## TypeScript 인터페이스 패턴

### 변형에는 판별 유니온을 쓰세요

```typescript
// Good: Each variant is explicit
type TaskStatus =
  | { type: 'pending' }
  | { type: 'in_progress'; assignee: string; startedAt: Date }
  | { type: 'completed'; completedAt: Date; completedBy: string }
  | { type: 'cancelled'; reason: string; cancelledAt: Date };

// Consumer gets type narrowing
function getStatusLabel(status: TaskStatus): string {
  switch (status.type) {
    case 'pending': return 'Pending';
    case 'in_progress': return `In progress (${status.assignee})`;
    case 'completed': return `Done on ${status.completedAt}`;
    case 'cancelled': return `Cancelled: ${status.reason}`;
  }
}
```

### 입력과 출력의 분리

```typescript
// Input: what the caller provides
interface CreateTaskInput {
  title: string;
  description?: string;
}

// Output: what the system returns (includes server-generated fields)
interface Task {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### ID에는 브랜드 타입을 쓰세요

```typescript
type TaskId = string & { readonly __brand: 'TaskId' };
type UserId = string & { readonly __brand: 'UserId' };

// Prevents accidentally passing a UserId where a TaskId is expected
function getTask(id: TaskId): Promise<Task> { ... }
```

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "API 문서는 나중에 쓰면 됩니다" | 타입이 곧 문서입니다. 먼저 정의하세요. |
| "지금은 페이지네이션이 필요 없습니다" | 누군가 항목이 100개를 넘는 순간 필요해집니다. 처음부터 넣으세요. |
| "PATCH는 복잡하니 PUT만 쓰겠습니다" | PUT은 매번 전체 객체를 요구합니다. 클라이언트가 실제로 원하는 것은 PATCH입니다. |
| "필요할 때 API에 버전을 매기면 됩니다" | 버전 관리 없는 호환성 깨짐 변경은 소비자를 깨뜨립니다. 처음부터 확장을 전제로 설계하세요. |
| "그 문서화되지 않은 동작은 아무도 쓰지 않습니다" | 하이럼의 법칙: 관찰 가능하면 누군가 의존합니다. 모든 공개 동작을 약속으로 취급하세요. |
| "버전 두 개만 유지하면 됩니다" | 여러 버전은 유지보수 비용을 곱하고 다이아몬드 의존성 문제를 만듭니다. 단일 버전 규칙을 선호하세요. |
| "내부 API에는 계약이 필요 없습니다" | 내부 소비자도 여전히 소비자입니다. 계약은 결합을 막고 병렬 작업을 가능하게 합니다. |
| "Idempotency-Key 헤더를 받아들이면 충분합니다" | 헤더가 계약이고, 키를 결과에 맞춰 저장하는 것이 구현입니다. 받아들이지만 지키지 않는 키는, 재시도가 안전하지 않은데 안전하다고 클라이언트에게 알립니다. |
| "우리 큐는 정확히 한 번(exactly-once) 전달을 보장합니다" | 소비자 크래시를 가로질러 그렇게 하는 큐는 없습니다. 브로커의 ack와 부작용은 하나의 트랜잭션 안에 있지 않습니다. 멱등 처리와 함께 최소 한 번(at-least-once)을 전제로 설계하세요. |
| "중복 요청은 드뭅니다" | 중복은 *서로 연관*되어 있습니다. 재시도는 의존성이 저하된 바로 그 순간에 급증합니다. 중복이 가장 일어나기 쉽고 가장 비싼 때입니다. |

## 레드 플래그

- 조건에 따라 다른 형태를 반환하는 엔드포인트
- 엔드포인트마다 일관되지 않은 오류 형식
- 경계가 아니라 내부 코드 곳곳에 흩어진 검증
- 기존 필드의 호환성 깨짐 변경 (타입 변경, 제거)
- 페이지네이션 없는 목록 엔드포인트
- REST URL 안의 동사 (`/api/createTask`, `/api/getUsers`)
- 검증이나 정제 없이 쓰는 서드파티 API 응답
- 멱등성 키에 대한 `SELECT` 다음에 오는 `INSERT`. 그것은 가드가 아니라 경합입니다
- UUID, 타임스탬프, 또는 시도마다 다시 생성되는 다른 값에서 도출된 멱등성 키
- 다른 요청 본문과 함께 같은 키를 받아들이고, 첫 응답을 조용히 반환하는 경우
- 요청을 다시 전달할 수 있는 가장 긴 경로보다 짧은 키 보존 기간

## 검증

API를 설계한 뒤:

- [ ] 모든 엔드포인트에 타입이 지정된 입력·출력 스키마가 있습니다
- [ ] 오류 응답이 하나의 일관된 형식을 따릅니다
- [ ] 검증은 시스템 경계에서만 일어납니다
- [ ] 목록 엔드포인트가 페이지네이션을 지원합니다
- [ ] 새 필드는 추가분이고 선택적입니다 (하위 호환)
- [ ] 이름이 모든 엔드포인트에서 일관된 관례를 따릅니다
- [ ] API 문서 또는 타입이 구현과 함께 커밋됩니다
- [ ] 상태를 바꾸는 엔드포인트는 멱등성 키를 지키거나, 재시도가 안전하지 않다고 문서화되어 있습니다
- [ ] 키는 유니크 제약 조건으로 지켜지는 하나의 원자적 연산에서 점유됩니다
- [ ] 다른 페이로드로 재사용된 키는 잘못된 응답을 재생하지 않고 분명히 실패합니다
- [ ] 진행 중 중복에 대한 응답은 우연히 나온 결과가 아니라 의도적인 선택입니다 (409, 대기, 또는 202)
- [ ] 키 보존 기간은 데드 레터 재생을 포함한 가장 긴 재시도 경로보다 깁니다
