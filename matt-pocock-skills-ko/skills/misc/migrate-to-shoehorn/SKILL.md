---
name: migrate-to-shoehorn
description: "`as` 타입 어서션을 @total-typescript/shoehorn으로 바꾸도록 테스트 파일을 마이그레이션합니다. 사용자가 shoehorn을 언급하거나, 테스트의 `as`를 교체하거나, 부분 테스트 데이터가 필요할 때 사용하세요."
---

# shoehorn으로 마이그레이션

## 왜 shoehorn인가요?

`shoehorn`을 쓰면 테스트에서 부분 데이터를 넘기면서도 TypeScript를 만족시킬 수 있습니다. `as` 어서션을 타입 안전한 대안으로 바꿉니다.

**테스트 코드에만 쓰세요.** 프로덕션 코드에서는 shoehorn을 쓰지 마세요.

테스트에서 `as`의 문제:

- 사용하지 않도록 훈련되어 있습니다
- 대상 타입을 직접 지정해야 합니다
- 의도적으로 틀린 데이터에는 이중 `as`(`as unknown as Type`)가 필요합니다

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
  // ...속성이 20개 더 있습니다
};

it("gets user by id", () => {
  // body.id만 중요하지만 Request 전체를 가짜로 채워야 합니다
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...속성 20개를 모두 가짜로 채웁니다
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
getUser({ body: { id: 123 } } as unknown as Request); // 일부러 틀린 타입
```

이후:

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 각각을 언제 쓰나요

| 함수 | 사용 사례 |
| --- | --- |
| `fromPartial()` | 타입 검사를 통과하는 부분 데이터를 넘길 때 |
| `fromAny()` | 의도적으로 틀린 데이터를 넘길 때 (자동 완성은 유지됩니다) |
| `fromExact()` | 전체 객체를 강제할 때 (나중에 `fromPartial`로 교체할 수 있습니다) |

## 워크플로우

1. **요구사항을 모으세요.** 사용자에게 묻으세요:
   - 문제를 일으키는 `as` 어서션이 있는 테스트 파일은 무엇인가요?
   - 일부 속성만 중요한 큰 객체를 다루고 있나요?
   - 오류 테스트를 위해 의도적으로 틀린 데이터를 넘겨야 하나요?

2. **설치하고 마이그레이션하세요**:
   - [ ] 설치: `npm i @total-typescript/shoehorn`
   - [ ] `as` 어서션이 있는 테스트 파일 찾기: `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] `as Type`을 `fromPartial()`로 바꾸세요
   - [ ] `as unknown as Type`을 `fromAny()`로 바꾸세요
   - [ ] `@total-typescript/shoehorn`에서 import를 추가하세요
   - [ ] 타입 체크를 실행하여 확인하세요
