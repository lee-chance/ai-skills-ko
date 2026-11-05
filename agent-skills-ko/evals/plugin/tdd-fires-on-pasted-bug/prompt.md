---
description: '함수를 인라인으로 붙여 넣고 테스트는 언급하지 않는 버그 수정 요청입니다. 스킬이 발동해야 하고, 응답은 고치기 전에 실패하는 테스트로 버그를 재현해야 합니다.'
expected_outcome: '사라진 1센트를 재현하는 테스트가 먼저 실패하는 것으로 보여 주거나 설명되고, 그다음 수정이 옵니다. test-driven-development가 호출됩니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 버그를 고치세요. splitCents(100, 3)은 [33, 33, 33]을 반환하고 1센트가 사라집니다. 함수는 다음과 같습니다.

```js
function splitCents(totalCents, n) {
  const share = Math.floor(totalCents / n);
  return Array.from({ length: n }, () => share);
}
```
