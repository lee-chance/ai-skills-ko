# 언제 모킹하나요

**시스템 경계**에서만 모킹하세요:

- 외부 API (결제, 이메일 등)
- 데이터베이스 (때때로 - 테스트 DB 선호)
- 시간/무작위성
- 파일 시스템 (때때로)

모킹하지 마세요:

- 자체 클래스/모듈
- 내부 협력자
- 제어하는 모든 것

## 모킹 가능성을 위한 설계

시스템 경계에서, 모킹하기 쉬운 인터페이스를 설계하세요:

**1. 의존성 주입 사용**

내부에서 생성하지 말고 외부 의존성을 전달하세요:

```typescript
// 모킹하기 쉬움
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 모킹하기 어려움
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 일반 페처보다 SDK 스타일 인터페이스 선호**

조건부 로직이 있는 하나의 일반 함수 대신 각 외부 작업에 대해 특정 함수를 만드세요:

```typescript
// 좋음: 각 함수는 독립적으로 모킹 가능
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// 나쁨: 모킹이 모의 내부의 조건부 로직을 요구
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 접근법은 다음을 의미합니다:
- 각 모의는 하나의 특정 형태를 반환
- 테스트 설정에 조건부 로직 없음
- 테스트가 어떤 엔드포인트를 행사하는지 보기 쉬움
- 엔드포인트당 타입 안전성
