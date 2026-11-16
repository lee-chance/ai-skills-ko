---
description: '동작 변경을 요청하지 않고, 함수를 인라인으로 붙여 가독성을 위한 리팩터를 요청합니다. code-simplification에 속합니다. test-driven-development 조항을 지킵니다. 그 "change its behavior"(동작을 바꾼다)와 "the fix looks too obvious to need a test"(수정이 너무 뻔해 테스트가 필요 없어 보인다)가, 동작을 바꾸지 않는 요청을 끌어들이면 안 됩니다.'
expected_outcome: '동작은 같고 더 읽기 쉬운 함수입니다. test-driven-development는 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 함수를 더 읽기 쉽게 리팩터하세요.

```js
function discountFor(user, cart) {
  let d = 0;
  if (user) {
    if (user.plan === 'pro') {
      if (cart.total > 100) { d = 0.2; } else { d = 0.1; }
    } else {
      if (cart.total > 100) { d = 0.05; } else { d = 0; }
    }
    if (user.coupon) {
      if (user.coupon.valid) { d = d + 0.05; }
    }
  }
  if (d > 0.25) { d = 0.25; }
  return d;
}
```
