---
name: documentation-and-adrs
description: "결정과 문서를 기록합니다. 아키텍처 결정(ADR)이나 설계 선택의 근거를 문서화해야 할 때, 공개 API를 바꾸거나 기능을 출시할 때, 또는 미래의 엔지니어와 에이전트가 코드베이스를 이해하려면 남겨야 할 맥락을 기록해야 할 때 사용하세요."
---

# Documentation and ADRs

## 개요

코드만이 아니라 결정을 문서화하세요. 가장 가치 있는 문서는 *왜*를 담습니다. 결정에 이르게 한 맥락, 제약 조건, 트레이드오프입니다. 코드는 *무엇을* 만들었는지 보여주고, 문서는 *왜 이렇게 만들었는지*와 *어떤 대안을 검토했는지*를 설명합니다. 이 맥락은 이후 코드베이스에서 일할 사람과 에이전트에게 필수입니다.

## 언제 사용하나

- 중요한 아키텍처 결정을 내릴 때
- 경쟁하는 접근 중에서 고를 때
- 공개 API를 추가하거나 바꿀 때
- 사용자에게 보이는 동작을 바꾸는 기능을 출시할 때
- 새 팀원(또는 에이전트)을 프로젝트에 온보딩할 때
- 같은 설명을 반복하고 있다는 것을 깨달았을 때

**사용하지 말아야 할 때:** 뻔한 코드를 문서화하지 마세요. 코드가 이미 말하는 내용을 반복하는 주석을 달지 마세요. 버릴 프로토타입을 위해 문서를 쓰지 마세요.

## 아키텍처 결정 기록 (ADR)

ADR은 중요한 기술 결정의 근거를 남깁니다. 쓸 수 있는 문서 중에서 가치가 가장 높습니다.

### ADR을 쓸 때

- 프레임워크, 라이브러리, 주요 의존성을 고를 때
- 데이터 모델이나 데이터베이스 스키마를 설계할 때
- 인증 전략을 선택할 때
- API 아키텍처를 결정할 때 (REST, GraphQL, tRPC)
- 빌드 도구, 호스팅 플랫폼, 인프라 중에서 고를 때
- 되돌리는 비용이 큰 결정일 때

### 먼저 기존 관례를 맞추세요

ADR을 새로 만들기 전에, 저장소에서 쓸 수 있는 맥락을 살펴 이미 자리 잡은 관례가 있는지 확인하세요. 기존 ADR, 프로젝트 지침, ADR 관련 설정이나 도구(예: `.adr-dir` 파일)입니다. 자리 잡은 관례는 아래 기본값보다 우선합니다. 다음에 맞추세요.

- **위치와 형식.** 예: `docs/adr/*.md`, `Documentation/Decisions/*.rst`, MADR 레이아웃, `adr-tools` 설정. 기존 디렉터리, 파일 확장자, 마크업(Markdown 또는 reStructuredText)을 맞추세요.
- **번호와 이름.** 기존 순서와 파일명 패턴을 이어 가세요 (`ADR-004-Title.rst`, `0004-title.md` 등). 001부터 다시 시작하거나 두 번째 체계를 들이지 마세요.
- **섹션 제목.** 이 템플릿의 제목을 강요하지 말고 프로젝트가 쓰는 제목 집합을 재사용하세요.

쓸 수 있는 증거가 서로 충돌하면, 다른 체계를 조용히 추가하지 말고 충돌을 드러내세요. 관례를 확정할 수 없을 때만 아래 기본값을 적용하세요.

### ADR 템플릿

프로젝트에 다른 위치가 이미 있지 않다면, ADR을 `docs/decisions/`에 순번과 함께 두세요 (위를 보세요).

```markdown
# ADR-001: 주 데이터베이스로 PostgreSQL 사용

## 상태
제안 | 승인 | ADR-XXX로 대체됨 | 지원 종료

## 날짜
2025-01-15

## 맥락
작업 관리 애플리케이션의 주 데이터베이스가 필요합니다. 핵심 요구사항:
- 관계형 데이터 모델 (사용자, 작업, 관계가 있는 팀)
- 작업 상태 변경을 위한 ACID 트랜잭션
- 작업 내용에 대한 전문 검색 지원
- 매니지드 호스팅 가능 (작은 팀, 운영 여력 제한)

## 결정
PostgreSQL과 Prisma ORM을 사용합니다.

## 검토한 대안

### MongoDB
- 장점: 유연한 스키마, 시작하기 쉬움
- 단점: 데이터는 본질적으로 관계형이라 관계를 수동으로 관리해야 함
- 기각: 문서 저장소의 관계형 데이터는 복잡한 조인이나 데이터 중복으로 이어짐

### SQLite
- 장점: 설정 없음, 임베디드, 읽기가 빠름
- 단점: 동시 쓰기 지원이 제한되고, 프로덕션용 매니지드 호스팅이 없음
- 기각: 프로덕션의 다중 사용자 웹 애플리케이션에 적합하지 않음

### MySQL
- 장점: 성숙하고 널리 지원됨
- 단점: PostgreSQL이 JSON 지원, 전문 검색, 생태계 도구에서 더 나음
- 기각: 기능 요구사항에는 PostgreSQL이 더 잘 맞음

## 결과
- Prisma가 타입 안전한 데이터베이스 접근과 마이그레이션 관리를 제공함
- Elasticsearch를 추가하는 대신 PostgreSQL 전문 검색을 쓸 수 있음
- 팀에 PostgreSQL 지식이 필요함 (표준 스킬, 위험 낮음)
- 매니지드 서비스에 호스팅 (Supabase, Neon, 또는 RDS)
```

### ADR 생애주기

```
제안 → 승인 → (대체됨 또는 지원 종료)
```

- **오래된 ADR을 삭제하지 마세요.** 역사적 맥락을 담고 있습니다.
- 결정이 바뀌면, 이전 ADR을 참조하고 대체하는 새 ADR을 작성하세요.

## 인라인 문서

### 주석을 달 때

*무엇*이 아니라 *왜*에 주석을 다세요.

```typescript
// BAD: Restates the code
// Increment counter by 1
counter += 1;

// GOOD: Explains non-obvious intent
// Rate limit uses a fixed window that opens on the first request after the
// previous one expires, not on a clock schedule. Known gap: a client can spend
// the full limit just before a reset and again just after (2x in a moment)
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

### 주석을 달지 말아야 할 때

```typescript
// Don't comment self-explanatory code
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Don't leave TODO comments for things you should just do now
// TODO: add error handling  ← Just add it

// Don't leave commented-out code
// const oldImplementation = () => { ... }  ← Delete it, git has history
```

### 알려진 함정을 문서화하세요

```typescript
/**
 * IMPORTANT: This function must be called before the first render.
 * If called after hydration, it causes a flash of unstyled content
 * because the theme context isn't available during SSR.
 *
 * See ADR-003 for the full design rationale.
 */
export function initializeTheme(theme: Theme): void {
  // ...
}
```

## API 문서

공개 API(REST, GraphQL, 라이브러리 인터페이스)의 경우:

### 타입과 함께 인라인 (TypeScript에서 선호)

```typescript
/**
 * Creates a new task.
 *
 * @param input - Task creation data (title required, description optional)
 * @returns The created task with server-generated ID and timestamps
 * @throws {ValidationError} If title is empty or exceeds 200 characters
 * @throws {AuthenticationError} If the user is not authenticated
 *
 * @example
 * const task = await createTask({ title: 'Buy groceries' });
 * console.log(task.id); // "task_abc123"
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // ...
}
```

### REST API용 OpenAPI / Swagger

```yaml
paths:
  /api/tasks:
    post:
      summary: Create a task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskInput'
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '422':
          description: Validation error
```

## README 구조

모든 프로젝트에는 다음을 다루는 README가 있어야 합니다.

```markdown
# 프로젝트 이름

이 프로젝트가 무엇을 하는지 한 단락으로 설명합니다.

## 빠른 시작
1. 저장소를 클론합니다
2. 의존성 설치: `npm install`
3. 환경 설정: `cp .env.example .env`
4. 개발 서버 실행: `npm run dev`

## 명령
| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm test` | 테스트 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | 린터 실행 |

## 아키텍처
프로젝트 구조와 핵심 설계 결정을 짧게 개괄합니다.
자세한 내용은 ADR로 연결합니다.

## 기여
기여 방법, 코딩 표준, 풀 리퀘스트 절차.
```

## 변경 이력 유지

출시한 기능의 경우:

```markdown
# Changelog

## [1.2.0] - 2025-01-20
### 추가
- 작업 공유: 사용자가 팀원과 작업을 공유할 수 있음 (#123)
- 작업 배정에 대한 이메일 알림 (#124)

### 수정
- 생성 버튼을 빠르게 클릭하면 작업이 중복으로 나타남 (#125)

### 변경
- 사용자 경험을 개선하기 위해 작업 목록이 페이지당 50개씩 로드됨 (이전 20개) (#126)
```

## 에이전트를 위한 문서

AI 에이전트 맥락을 위한 특별 고려:

- **CLAUDE.md / 규칙 파일.** 에이전트가 따르도록 프로젝트 관례를 문서화하세요
- **스펙 파일.** 에이전트가 올바른 것을 만들도록 스펙을 최신으로 유지하세요
- **ADR.** 에이전트가 과거 결정을 왜 내렸는지 이해하게 하세요 (같은 결정을 다시 내리는 일을 막습니다)
- **인라인 함정.** 에이전트가 알려진 함정에 빠지지 않게 하세요

## 산문 검토

기술 내용을 확인한 뒤, 문서를 쓸 사람을 위해 산문을 검토하세요. 더 명확한 문장이 결정이나 그 한계를 바꾸면 안 됩니다.

1. 편집 후에도 남아야 하는 세부 사항을 표시하세요. 이름, 숫자와 단위, 명령, 경로, 링크, 조건, 트레이드오프, 불확실성입니다. 쓸 수 있는 코드와 결정 맥락과 대조하고, 근거를 댈 수 없는 것은 표시하세요.
2. 틀에 박힌 도입, 홍보성 형용사, 반복되는 요약을 독자에게 필요한 구체적 정보로 바꾸세요. 근거 없는 주장을 지어낸 예시나 더 강한 보장으로 바꾸지 마세요. 필요한 기술 반복과 프로젝트가 정해 둔 용어는 유지하세요.
3. 편집한 문서를 원문 및 출처와 비교하세요. 빠진 한정어나 주의 사항을 되돌리고, 명령과 코드 예시가 문서대로 동작하는지 확인하며, 해결되지 않은 사실 문제는 다듬어 없애지 말고 설명하세요.

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "코드가 스스로 문서화한다" | 코드는 무엇을 보여 줍니다. 왜인지, 어떤 대안이 기각됐는지, 어떤 제약 조건이 적용되는지는 보여 주지 않습니다. |
| "API가 안정되면 문서를 쓰겠다" | API는 문서화할 때 더 빨리 안정됩니다. 문서가 설계의 첫 테스트입니다. |
| "아무도 문서를 읽지 않는다" | 에이전트는 읽습니다. 미래의 엔지니어도 읽습니다. 3개월 뒤의 본인도 읽습니다. |
| "ADR은 오버헤드다" | 10분짜리 ADR이 6개월 뒤 같은 결정에 대한 2시간 논쟁을 막습니다. |
| "주석은 금방 낡는다" | *왜*에 대한 주석은 안정적입니다. *무엇*에 대한 주석이 낡습니다. 그래서 전자만 씁니다. |

## 레드 플래그

- 글로 된 근거가 없는 아키텍처 결정
- 문서나 타입이 없는 공개 API
- 프로젝트를 실행하는 방법을 설명하지 않는 README
- 삭제 대신 주석 처리된 코드
- 몇 주째 남아 있는 TODO 주석
- 중요한 아키텍처 선택이 있는데 ADR이 없는 프로젝트
- 의도를 설명하지 않고 코드를 다시 말하는 문서

## 검증

문서화한 뒤:

- [ ] 중요한 아키텍처 결정마다 ADR이 있다
- [ ] README가 빠른 시작, 명령, 아키텍처 개요를 다룬다
- [ ] API 함수에 매개변수와 반환 타입 문서가 있다
- [ ] 알려진 함정이 중요한 위치에 인라인으로 문서화되어 있다
- [ ] 주석 처리된 코드가 남아 있지 않다
- [ ] 규칙 파일(CLAUDE.md 등)이 최신이고 정확하다
- [ ] 산문 편집이 출처의 세부 사항, 결정의 트레이드오프, 한정어를 보존하고 근거 없는 보장을 추가하지 않는다
