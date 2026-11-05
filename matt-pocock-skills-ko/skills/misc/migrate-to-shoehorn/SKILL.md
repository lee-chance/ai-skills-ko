---
name: migrate-to-shoehorn
description: "`as` 타입 어서션에서 @total-typescript/shoehorn으로 테스트 파일을 마이그레이션합니다. 사용자가 shoehorn을 언급하거나, 테스트에서 `as`를 교체하고 싶거나, 부분 테스트 데이터가 필요할 때 사용하세요."
---

# Migrate to Shoehorn

## 왜 shoehorn인가?

`shoehorn`은 TypeScript를 행복하게 유지하면서 테스트에서 부분 데이터를 전달할 수 있게 합니다. `as` 어서션을 타입 안전 대안으로 교체합니다.

**테스트 코드 전용.** 프로덕션 코드에서는 shoehorn을 절대 사용하지 마세요.

테스트에서 `as`의 문제:

- 사용하지 않도록 훈련됨
- 대상 타입을 수동으로 지정해야 함
- 의도적으로 잘못된 데이터를 위한 이중-as (`as unknown as Type`)

## 설치

```bash
npm i @total-typescript/shoehorn
```

## 마이그레이션 패턴

### 필요한 속성이 적은 큰 객체

이전:

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // body.id만 관심 있지만 전체 Request를 가짜로 만들어야 함
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...20개 속성 모두 가짜로
  });
});
```

이후:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

이전:

```ts
getUser({ body: { id: "123" } } as Request);
```

이후:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

이전:

```ts
getUser({ body: { id: 123 } } as unknown as Request); // 의도적으로 잘못된 타입
```

이후:

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 각각을 언제 사용하는지

| Function        | Use case                                           |
| --------------- | -------------------------------------------------- |
| `fromPartial()` | 여전히 타입 체크되는 부분 데이터 전달           |
| `fromAny()`     | 의도적으로 잘못된 데이터 전달 (자동 완성 유지) |
| `fromExact()`   | 전체 객체 강제 (나중에 fromPartial로 교체)    |

## 워크플로우

1. **요구 사항 수집** - 사용자에게 묻기:
   - 어떤 테스트 파일이 문제를 일으키는 `as` 어서션을 가지고 있나요?
   - 일부 속성만 중요한 큰 객체를 다루고 있나요?
   - 에러 테스팅을 위해 의도적으로 잘못된 데이터를 전달해야 하나요?

2. **설치 및 마이그레이션**:
   - [ ] 설치: `npm i @total-typescript/shoehorn`
   - [ ] `as` 어서션이 있는 테스트 파일 찾기: `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] `as Type`을 `fromPartial()`로 교체
   - [ ] `as unknown as Type`을 `fromAny()`로 교체
   - [ ] `@total-typescript/shoehorn`에서 import 추가
   - [ ] 타입 체크를 실행하여 검증
