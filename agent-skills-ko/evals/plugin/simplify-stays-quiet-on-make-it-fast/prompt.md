---
description: 'performance-optimization에 속하는 속도 불만과 함께 붙여 넣은 함수입니다. code-simplification 설명의 "even when the code is pasted inline"(코드가 인라인으로 붙여 넣어진 경우에도) 조항을 지킵니다. 붙여 넣은 코드를 더 빠르게 만들어 달라는 요청만으로 단순화 스킬이 발동하면 안 되기 때문입니다.'
expected_outcome: '더 빠른 조회입니다(행마다 선형 탐색하는 대신 Set 또는 Map). code-simplification은 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

행이 200만 개일 때 4초가 걸립니다. 어떻게 빠르게 만들 수 있나요?

```js
function uniqueCustomers(orders) {
  const seen = [];
  for (const order of orders) {
    if (!seen.includes(order.customerId)) {
      seen.push(order.customerId);
    }
  }
  return seen;
}
```
