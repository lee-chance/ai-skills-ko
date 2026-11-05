# TypeScript 패턴

`SKILL.md`의 각 규칙에 대한 코드 예제입니다. 기저 원칙은 언어와 무관합니다. **type-system-discipline**과 **boundary-discipline** 원칙 스킬을 보세요.

## 브랜드 타입

기본 타입이 섞이지 않도록 브랜드하세요. 경계에서 한 번 검증하세요. 하류 코드는 그 타입을 신뢰합니다.

```ts
type AgentId = string & { readonly __brand: "AgentId" };

function isAgentId(input: string): input is AgentId {
  return isUUID(input);
}

function parseAgentId(input: string): AgentId {
  if (!isAgentId(input)) throw new Error(`Invalid agent id: ${input}`);
  return input;
}

function focusAgent(id: AgentId): void {
  /* 입력은 신뢰됩니다 */
}
```

`readonly __brand: 'X'` 형태를 맞추세요. 새 관례를 만들지 마세요.

## 구별된 유니온

리터럴 구별자로 변형을 모델링하세요. 모든 변형이 필드 이름을 공유하고 각 변형의 값이 고유하므로, 불가능한 조합은 표현할 수 없습니다.

```ts
// 하지 마세요. 불리언과 선택적 필드는 모순된 상태가 존재하게 합니다.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// 하세요. 유효한 상태만 존재합니다.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

구별자 이름은 하나(`kind`, `type`, `tag`)만 고르고 그것을 유지하세요.

## 구성적 모델링

느슨한 타입을 런타임 검사로 제한하지 말고, 전부 합법인 부분으로 타입을 만드세요.

비어 있지 않음, 가변 튜플로:

```ts
type NonEmpty<T> = [T, ...T[]];

// 하지 마세요: 모든 호출자가 반복해야 하는 길이 검사가 붙은 T[]
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// 하세요: 이 타입의 빈 값은 존재할 수 없습니다
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

평범한 `T[]`가 들어오는 곳에서는 가드로 한 번 좁히세요. 그 사실은 그 뒤로는 타입 안에서 이동합니다.

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

짝수 길이, 쌍으로:

```ts
type Pairs<T> = [T, T][];
```

시간 범위, 시작에 기간을 더해:

```ts
// 하지 마세요: 주석이 불변 조건을 들고 있습니다
type TimeRange = { start: Date; end: Date }; // start는 end 이하

// 하세요: 음의 범위는 쓸 수 없습니다. 필요할 때 end를 도출하세요
type TimeRange = { start: Date; durationMs: number };
```

`durationMs`는 평범한 숫자로 두세요. 기간이 기대되는 곳에 그냥 숫자가 전달될 수 있을 때만 브랜드하세요 (브랜드 타입 절을 따릅니다). 반사적으로 브랜드하지 마세요. 나쁜 상태를 만들 수 없게 하는 표현을 고르고, 그 위에 필요한 읽기를 노출하세요 (`pairs.flat()`, `rangeEnd()` 헬퍼).

## 가장 단순한 총 타입

모든 것을 강화하지 마세요. 그 위의 모든 연산이 총일 때는 `T[]`를 유지하세요.

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // []은 0이라 문제없습니다
```

느슨한 타입이 사용처에서 거짓말을 강요할 때 강화하세요. 징후는 `!`, `arr[0] as T`, 그리고 "should never happen" throw입니다.

```ts
// 하지 마세요: 컴파일러를 몰래 통과한 부분성
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// 하세요: 입력을 강화하면 단언이 사라집니다
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

결과를 `Session | undefined`로 약화하는 것도 총 시그니처입니다.

## `any`보다 `unknown`

외부 데이터는 항상 `unknown`입니다. 쓰기 전에 좁히세요.

```ts
// 하지 마세요
function handle(input: any) {
  return input.foo.bar;
}

// 하세요
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // 좁혀졌습니다. 컴파일러가 접근을 검증합니다
  }
}
```

외부 소스에는 RPC 페이로드, `JSON.parse`, `postMessage`, IPC, 파일 내용, 환경 변수, 데이터베이스 결과가 있습니다.

## 손으로 쓴 가드보다 스키마

외부 데이터에 대해 속성마다 타입 가드를 쓰기 전에, 저장소의 런타임 스키마 라이브러리와 기존 스키마를 찾으세요. 검증은 스키마 하나가 맡고, TypeScript 타입은 그 스키마에서 도출하세요. 서로 어긋날 수 있는 스키마, 중복 인터페이스, 가드를 함께 유지하지 마세요.

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

실패가 예상된 분기일 때 `safeParse`를 사용하세요. 저장소가 다른 스키마 라이브러리를 쓰면 그에 해당하는 추론 헬퍼를 사용하세요. 가드 하나를 위해 새 스키마 의존성을 추가하지 마세요. 이 규칙은 코드베이스가 이미 신뢰하는 스키마 시스템을 선호합니다.

## `as` 캐스트 없음

모든 `as`는 런타임 크래시가 될 수 있습니다. 타입 시스템이 그 주장을 확인한 뒤에만 캐스트하세요.

```ts
import { z } from "zod";

// 하지 마세요
const user = data as User;

// 하지 마세요
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

// 하세요
const userSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof userSchema>;

function parseUser(data: unknown): User {
  return userSchema.parse(data);
}
```

타입이 먼저 오면, 검증자가 증명하는 타입으로 검증자에 주석을 다세요. 그러면 컴파일러는 그 타입보다 적게 증명하는 검증자를 거부합니다. 아래 객체에서 `name`을 빼면 할당이 컴파일되지 않습니다.

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

기존 코드에서 `as`를 들어낼 때, TypeScript가 추론하지 못하는 이유를 찾으세요.

- 구별자 누락: 하나를 추가하고 구별된 유니온으로 바꾸세요.
- 지나치게 넓은 소스 타입 (예: `Record<string, unknown>`): 좁히세요.
- 타입이 없는 경계: 그 형태를 소유한 스키마로 파싱하세요. 스키마가 없는 곳에만 스키마를 추가하세요.
- 정말로 표현할 수 없음: 브랜드 타입이나 `satisfies`를 사용하세요.

## 좁히기 계층

가장 좋은 방법에서 최후의 수단까지:

1. **구별된 유니온 switch / if.** 컴파일러가 자동으로 좁힙니다.
2. **`in` 연산자.** `"key" in obj`는 그 키를 가진 변형으로 좁힙니다.
3. **`typeof` / `instanceof`.** 원시 값과 클래스 인스턴스에 씁니다.
4. **사용자 정의 타입 가드.** 위로는 부족할 때.
5. **`as` 캐스트.** 검증 뒤에만.

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // circle로 좁혀짐
  return s.width * s.height; // rect로 좁혀짐
}
```

## 타입 가드

가드는 주장을 실제로 검증해야 합니다. 거짓말하는 가드는 `as`보다 나쁩니다.

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

가능하면 구별자로 좁히세요.

## 철저함

기본 팔에서는 구별자를 `never` 타입의 지역 변수에 할당하세요.

```ts
// 값을 반환하는 switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// void switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

값을 반환하는 switch에서는 return 스타일, 문장 switch에서는 void 스타일입니다.

## `as`보다 `satisfies`

`satisfies`는 리터럴 타입을 넓히지 않고 검증합니다.

```ts
// 하지 마세요. 넓어지고 리터럴 타입을 잃습니다.
const config = { theme: "dark", cols: 3 } as Config;

// 하세요. 검증하면서 리터럴 타입을 보존합니다.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme은 "dark"(리터럴)이며 string이 아닙니다
```

## 경계 검증

데이터가 들어오는 곳에서 한 번 검증하세요. 안에서는 타입을 신뢰하세요. **boundary-discipline** 원칙 스킬을 보세요.

- **와이어 형식** (proto, JSON-RPC): 앞으로의 호환 변경이 옛 클라이언트를 깨지 않도록 `ignoreUnknownFields`로 파싱하세요.
- **영속화된 JSON:** 버전이 있는 blob이고, 파싱은 try/catch로 감쌉니다.
- **다시 검증하지 마세요.** 호출 체인 깊은 곳에서.

## 스키마 파생 타입

`.proto`, OpenAPI 스펙, GraphQL 스키마, 데이터베이스 마이그레이션이 이미 형태를 정의하면, 중복하지 말고 생성된 타입에서 도출하세요.

```ts
// 하지 마세요. 형태를 중복하면 스키마가 바뀔 때 어긋납니다.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary) {
  /* ... */
}

// 하세요. 생성된 스키마 타입에서 도출하세요.
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">) {
  /* ... */
}
```

새 인터페이스를 쓰기 전에 `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof`에 먼저 도달하세요.

## 객체 인수

```ts
// 하지 마세요. 인수 둘을 바꿔도 여전히 컴파일됩니다.
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// 하세요. 순서와 무관하고, 스스로 문서화됩니다.
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

핫 패스에서는 건너뛰세요. 프레임당 렌더, 토크나이저, 파서, 할당 비용이 중요한 타이트 루프의 모든 것.
