---
name: code-simplification
description: "명확함을 위해 코드를 단순화합니다. 동작을 바꾸지 않고 명확하게 코드를 리팩터할 때 사용하세요. 코드는 동작하지만 읽기, 유지보수, 확장이 필요 이상으로 어려울 때 사용하세요. 불필요한 복잡성이 쌓인 코드를 리뷰할 때 사용하세요. 이미 동작하는 함수나 모듈을 단순화하거나, 정리하거나, 중첩을 줄여 달라는 요청이 있을 때 사용하세요. 코드가 인라인으로 붙여넣어졌고 그 밖에 바꿀 것이 없는 경우도 포함합니다."
---

# Code Simplification

> [Claude Code Simplifier 플러그인](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-simplifier/agents/code-simplifier.md)에서 영감을 받았습니다. 여기서는 어떤 AI 코딩 에이전트에도 쓰는, 모델에 묶이지 않고 프로세스 중심인 스킬로 맞춰 두었습니다.

## 개요

복잡도를 줄이면서 동작을 그대로 유지해 코드를 단순화하세요. 목표는 줄 수를 줄이는 것이 아닙니다. 읽고, 이해하고, 수정하고, 디버그하기 더 쉬운 코드입니다. 모든 단순화는 단순한 테스트를 통과해야 합니다. "새 팀원이 원본보다 이것을 더 빨리 이해할까?"

## 언제 사용하나

- 기능이 동작하고 테스트는 통과했지만, 구현이 필요 이상으로 무겁게 느껴질 때
- 코드 리뷰에서 가독성이나 복잡도 문제가 지적되었을 때
- 깊게 중첩된 로직, 긴 함수, 불명확한 이름을 만났을 때
- 시간 압박 속에 작성된 코드를 리팩터할 때
- 여러 파일에 흩어진 관련 로직을 모을 때
- 중복이나 불일치를 만든 변경을 병합한 뒤

**사용하지 않을 때:**

- 코드가 이미 깔끔하고 읽기 쉽습니다. 단순화 자체를 목적으로 단순화하지 마세요.
- 코드가 무엇을 하는지 아직 모릅니다. 단순화하기 전에 이해하세요.
- 성능이 중요한 코드이고, "더 단순한" 버전이 측정 가능하게 더 느립니다.
- 모듈 전체를 곧 다시 작성합니다. 버려질 코드를 단순화하면 노력이 낭비됩니다.

## 다섯 가지 원칙

### 1. 동작을 정확히 보존하세요

코드가 하는 일을 바꾸지 마세요. 표현하는 방식만 바꾸세요. 모든 입력, 출력, 부수 효과, 오류 동작, 엣지 케이스는 동일해야 합니다. 단순화가 동작을 보존하는지 확실하지 않으면 하지 마세요.

```
모든 변경 전에 물어보세요:
→ 모든 입력에 대해 같은 출력을 내는가?
→ 같은 오류 동작을 유지하는가?
→ 같은 부수 효과와 순서를 보존하는가?
→ 기존 테스트가 수정 없이 모두 통과하는가?
```

### 2. 프로젝트 관례를 따르세요

단순화는 코드를 코드베이스와 더 일관되게 만드는 일입니다. 외부의 선호를 강요하는 일이 아닙니다. 단순화하기 전에:

```
1. CLAUDE.md와 프로젝트 관례를 읽으세요
2. 이웃 코드가 비슷한 패턴을 어떻게 다루는지 살펴보세요
3. 다음을 프로젝트 스타일에 맞추세요:
   - 임포트 순서와 모듈 시스템
   - 함수 선언 스타일
   - 이름 관례
   - 오류 처리 패턴
   - 타입 주석의 깊이
```

프로젝트의 일관성을 깨는 단순화는 단순화가 아닙니다. 불필요한 변경입니다.

### 3. 영리함보다 명확함을 선호하세요

압축된 코드를 해석하려면 잠시 멈춰 생각해야 할 때, 명시적인 코드가 압축된 코드보다 낫습니다.

```typescript
// UNCLEAR: Dense ternary chain
const label = isNew ? 'New' : isUpdated ? 'Updated' : isArchived ? 'Archived' : 'Active';

// CLEAR: Readable mapping
function getStatusLabel(item: Item): string {
  if (item.isNew) return 'New';
  if (item.isUpdated) return 'Updated';
  if (item.isArchived) return 'Archived';
  return 'Active';
}
```

```typescript
// UNCLEAR: Chained reduces with inline logic
const result = items.reduce((acc, item) => ({
  ...acc,
  [item.id]: { ...acc[item.id], count: (acc[item.id]?.count ?? 0) + 1 }
}), {});

// CLEAR: Named intermediate step
const countById = new Map<string, number>();
for (const item of items) {
  countById.set(item.id, (countById.get(item.id) ?? 0) + 1);
}
```

### 4. 균형을 유지하세요

단순화에는 실패 양상이 있습니다. 과도한 단순화입니다. 다음 함정을 주의하세요.

- **너무 공격적인 인라인.** 개념에 이름을 주던 헬퍼를 없애면 호출부가 더 읽기 어려워집니다.
- **관계없는 로직을 합치기.** 단순한 함수 두 개를 복잡한 함수 하나로 합치면 더 단순하지 않습니다.
- **"필요 없어 보이는" 추상화를 제거하기.** 어떤 추상화는 복잡해서가 아니라, 확장하거나 테스트하기 쉽게 하려고 있습니다.
- **줄 수에 맞추기.** 줄 수가 적은 것이 목표가 아닙니다. 더 쉽게 이해하는 것이 목표입니다.

### 5. 변경된 범위로 한정하세요

기본은 최근에 수정한 코드를 단순화하는 것입니다. 범위를 넓히라고 명시적으로 요청받지 않았다면, 관계없는 코드를 지나가며 리팩터하지 마세요. 범위가 정해지지 않은 단순화는 diff에 잡음을 만들고, 의도하지 않은 회귀의 위험이 있습니다.

## 단순화 프로세스

### 1단계: 손대기 전에 이해하세요 (Chesterton's Fence)

무엇을 바꾸거나 제거하기 전에, 그것이 왜 있는지 이해하세요. 이것이 체스터턴의 울타리(Chesterton's Fence)입니다. 길을 가로지르는 울타리가 보이는데 왜 있는지 모르겠다면, 헐지 마세요. 먼저 이유를 이해하고, 그 이유가 아직 유효한지 판단하세요.

```
단순화하기 전에 답하세요:
- 이 코드의 책임은 무엇인가?
- 무엇이 이것을 호출하는가? 이것은 무엇을 호출하는가?
- 엣지 케이스와 오류 경로는 무엇인가?
- 기대 동작을 정의하는 테스트가 있는가?
- 왜 이렇게 작성되었을 수 있는가? (성능? 플랫폼 제약? 역사적 이유?)
- git blame을 확인하세요. 이 코드의 원래 맥락은 무엇이었나?
```

이것들에 답할 수 없다면 단순화할 준비가 되지 않은 것입니다. 먼저 맥락을 더 읽으세요.

### 2단계: 단순화 기회를 찾으세요

다음 패턴을 찾으세요. 각각은 막연한 냄새가 아니라 구체적인 신호입니다.

**구조적 복잡도:**

| 패턴 | 신호 | 단순화 |
|---------|--------|----------------|
| 깊은 중첩 (3단계 이상) | 제어 흐름을 따라가기 어려움 | 조건을 가드 절이나 헬퍼 함수로 추출 |
| 긴 함수 (50줄 이상) | 책임이 여러 개임 | 이름만 봐도 역할이 보이는, 한 가지에 집중한 함수로 나눔 |
| 중첩된 삼항 연산자 | 해석하려면 머릿속 스택이 필요함 | if/else 연쇄, switch, 조회 객체로 바꿈 |
| 불리언 매개변수 플래그 | `doThing(true, false, true)` | 옵션 객체나 별도 함수로 바꿈 |
| 반복되는 조건 | 같은 `if` 검사가 여러 곳에 있음 | 이름이 잘 붙은 조건 함수로 추출 |

**이름과 가독성:**

| 패턴 | 신호 | 단순화 |
|---------|--------|----------------|
| 일반적인 이름 | `data`, `result`, `temp`, `val`, `item` | 내용을 말하도록 이름을 바꿈: `userProfile`, `validationErrors` |
| 축약된 이름 | `usr`, `cfg`, `btn`, `evt` | 보편적인 축약(`id`, `url`, `api`)이 아니면 온전한 단어를 씀 |
| 오해를 부르는 이름 | 상태도 바꾸는데 이름이 `get`인 함수 | 실제 동작을 반영하도록 이름을 바꿈 |
| "무엇"을 설명하는 주석 | `count++` 위의 `// increment counter` | 주석을 삭제함. 코드가 충분히 분명함 |
| "왜"를 설명하는 주석 | `// Retry because the API is flaky under load` | 이런 주석은 남김. 코드가 표현하지 못하는 의도를 담음 |

**중복:**

| 패턴 | 신호 | 단순화 |
|---------|--------|----------------|
| 중복된 로직 | 여러 곳에 같은 5줄 이상이 있음 | 공유 함수로 추출 |
| 데드 코드 | 도달할 수 없는 분기, 쓰지 않는 변수, 주석 처리된 블록 | 정말로 죽은 코드인지 확인한 뒤 제거 |
| 불필요한 추상화 | 가치를 더하지 않는 래퍼 | 래퍼를 인라인하고, 감싸고 있던 함수를 직접 호출 |
| 과하게 설계된 패턴 | 팩토리를 만드는 팩토리, 전략이 하나뿐인 전략 | 단순한 직접 방식으로 바꿈 |
| 중복된 타입 단언 | 이미 추론된 타입으로 캐스팅 | 단언을 제거 |

### 3단계: 변경을 점진적으로 적용하세요

한 번에 단순화 하나만 하세요. 각 변경 뒤에 테스트를 실행하세요. **리팩터 변경은 기능 변경이나 버그 수정과 분리해서 제출하세요.** 리팩터와 기능 추가가 함께 있는 풀 리퀘스트는 풀 리퀘스트 두 개입니다. 나누세요.

```
각 단순화마다:
1. 변경을 적용하세요
2. 테스트 스위트를 실행하세요
3. 테스트가 통과하면 → 커밋하세요 (또는 다음 단순화로 계속)
4. 테스트가 실패하면 → 되돌리고 다시 생각하세요
```

여러 단순화를 테스트하지 않은 변경 하나로 묶지 마세요. 무언가 깨지면 어떤 단순화가 원인인지 알아야 합니다.

**500줄 규칙:** 리팩터가 500줄을 넘게 건드린다면, 손으로 고치지 말고 자동화(codemod, sed 스크립트, AST 변환)에 투자하세요. 그 규모의 수동 편집은 실수가 나기 쉽고, 리뷰하기도 지칩니다.

### 4단계: 결과를 검증하세요

모든 단순화가 끝난 뒤, 한 걸음 물러나 전체를 평가하세요.

```
전과 후를 비교하세요:
- 단순화된 버전이 정말로 이해하기 더 쉬운가?
- 코드베이스와 맞지 않는 새 패턴을 도입했는가?
- diff가 깔끔하고 리뷰할 수 있는가?
- 팀원이 이 변경을 승인할 것인가?
```

"단순화한" 버전이 이해하거나 리뷰하기 더 어렵다면 되돌리세요. 단순화 시도가 모두 성공하는 것은 아닙니다.

## 언어별 지침

### TypeScript / JavaScript

```typescript
// SIMPLIFY: Unnecessary async wrapper
// Before
async function getUser(id: string): Promise<User> {
  return await userService.findById(id);
}
// After
function getUser(id: string): Promise<User> {
  return userService.findById(id);
}

// SIMPLIFY: Verbose conditional assignment
// Before
let displayName: string;
if (user.nickname) {
  displayName = user.nickname;
} else {
  displayName = user.fullName;
}
// After
const displayName = user.nickname || user.fullName;

// SIMPLIFY: Manual array building
// Before
const activeUsers: User[] = [];
for (const user of users) {
  if (user.isActive) {
    activeUsers.push(user);
  }
}
// After
const activeUsers = users.filter((user) => user.isActive);

// SIMPLIFY: Redundant boolean return
// Before
function isValid(input: string): boolean {
  if (input.length > 0 && input.length < 100) {
    return true;
  }
  return false;
}
// After
function isValid(input: string): boolean {
  return input.length > 0 && input.length < 100;
}
```

### Python

```python
# SIMPLIFY: Verbose dictionary building
# Before
result = {}
for item in items:
    result[item.id] = item.name
# After
result = {item.id: item.name for item in items}

# SIMPLIFY: Nested conditionals with early return
# Before
def process(data):
    if data is not None:
        if data.is_valid():
            if data.has_permission():
                return do_work(data)
            else:
                raise PermissionError("No permission")
        else:
            raise ValueError("Invalid data")
    else:
        raise TypeError("Data is None")
# After
def process(data):
    if data is None:
        raise TypeError("Data is None")
    if not data.is_valid():
        raise ValueError("Invalid data")
    if not data.has_permission():
        raise PermissionError("No permission")
    return do_work(data)
```

### React / JSX

```tsx
// SIMPLIFY: Verbose conditional rendering
// Before
function UserBadge({ user }: Props) {
  if (user.isAdmin) {
    return <Badge variant="admin">Admin</Badge>;
  } else {
    return <Badge variant="default">User</Badge>;
  }
}
// After
function UserBadge({ user }: Props) {
  const variant = user.isAdmin ? 'admin' : 'default';
  const label = user.isAdmin ? 'Admin' : 'User';
  return <Badge variant={variant}>{label}</Badge>;
}

// SIMPLIFY: Prop drilling through intermediate components
// Before — consider whether context or composition solves this better.
// This is a judgment call — flag it, don't auto-refactor.
```

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "동작하니 건드릴 필요가 없다" | 읽기 어려운 채로 동작하는 코드는, 깨졌을 때 고치기도 어렵습니다. 지금 단순화하면 이후의 모든 변경에서 시간이 절약됩니다. |
| "줄 수가 적으면 항상 더 단순하다" | 한 줄짜리 중첩 삼항은 다섯 줄짜리 if/else보다 단순하지 않습니다. 단순함은 줄 수가 아니라 이해하는 속도입니다. |
| "이 관계없는 코드도 잠깐 단순화하겠다" | 범위 없는 단순화는 잡음이 많은 diff를 만들고, 바꾸려던 것이 아닌 코드에서 회귀를 일으킬 위험이 있습니다. 범위에 머무르세요. |
| "타입이 있으니 스스로 문서가 된다" | 타입은 구조를 문서화합니다. 의도는 문서화하지 않습니다. 이름이 잘 붙은 함수는, 타입 시그니처가 *무엇*을 설명하는 것보다 *왜*를 더 잘 설명합니다. |
| "이 추상화는 나중에 쓸모 있을 수 있다" | 추측에 기댄 추상화를 남겨 두지 마세요. 지금 쓰이지 않으면 가치 없는 복잡도입니다. 제거하고, 필요할 때 다시 넣으세요. |
| "원래 작성자에게는 이유가 있었을 것이다" | 그럴 수 있습니다. `git blame`을 확인하고 체스터턴의 울타리를 적용하세요. 하지만 쌓인 복잡도에는 이유가 없는 경우가 많습니다. 압박 속에서 반복한 잔여물일 뿐입니다. |
| "이 기능을 추가하면서 리팩터하겠다" | 리팩터를 기능 작업과 분리하세요. 섞인 변경은 리뷰하고, 되돌리고, 이력에서 이해하기 더 어렵습니다. |

## 레드 플래그

- 통과시키려고 테스트를 수정해야 하는 단순화 (동작을 바꿨을 가능성이 큽니다)
- 원본보다 더 길고 따라가기 어려운 "단순화된" 코드
- 프로젝트 관례가 아니라 자신의 선호에 맞춰 이름을 바꾸는 것
- "코드가 더 깔끔해지니까"라는 이유로 오류 처리를 제거하는 것
- 완전히 이해하지 못한 코드를 단순화하는 것
- 많은 단순화를 리뷰하기 어려운 큰 커밋 하나로 묶는 것
- 요청받지 않고 현재 작업 범위 밖의 코드를 리팩터하는 것

## 검증

단순화 한 차례를 마친 뒤:

- [ ] 기존 테스트가 수정 없이 모두 통과한다
- [ ] 빌드가 성공하고 새 경고가 없다
- [ ] 린터와 포매터가 통과한다 (스타일 회귀가 없다)
- [ ] 각 단순화가 리뷰할 수 있는 점진적 변경이다
- [ ] diff가 깔끔하다. 관계없는 변경이 섞여 있지 않다
- [ ] 단순화된 코드가 프로젝트 관례를 따른다 (`CLAUDE.md` 또는 그에 해당하는 문서와 대조)
- [ ] 오류 처리가 제거되거나 약해지지 않았다
- [ ] 데드 코드가 남아 있지 않다 (쓰지 않는 임포트, 도달할 수 없는 분기)
- [ ] 팀원이나 리뷰 에이전트가 이 변경을 전체적으로 나아진 변경으로 승인할 것이다
