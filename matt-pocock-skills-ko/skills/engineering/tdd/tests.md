# 좋은 테스트와 나쁜 테스트

## 좋은 테스트

**통합 스타일**: 내부 부분의 모의가 아니라 실제 인터페이스를 통해 테스트하세요.

```typescript
// 좋음: 관찰 가능한 동작을 테스트
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

특징:

- 사용자/호출자가 신경 쓰는 동작을 테스트
- 공개 API만 사용
- 내부 리팩토링에서 살아남음
- 무엇(WHAT)을 설명하지 어떻게(HOW)가 아님
- 테스트당 하나의 논리적 어서션

## 나쁜 테스트

**구현 세부 사항 테스트**: 내부 구조에 결합.

```typescript
// 나쁨: 구현 세부 사항을 테스트
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

레드 플래그:

- 내부 협력자 모킹
- private 메서드 테스트
- 호출 횟수/순서에 어서트
- 동작 변경 없이 리팩토링할 때 테스트가 깨짐
- 테스트 이름이 무엇이 아니라 어떻게를 설명
- 인터페이스 대신 외부 수단을 통해 검증

```typescript
// 나쁨: 검증하기 위해 인터페이스를 우회
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// 좋음: 인터페이스를 통해 검증
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**동어 반복 테스트**: 예상 값이 구현을 재진술하므로, 테스트가 구성으로 통과합니다.

```typescript
// 나쁨: 예상 값이 코드가 계산하는 방식으로 재계산됨
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// 좋음: 예상 값이 독립적인, 알려진 리터럴
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
