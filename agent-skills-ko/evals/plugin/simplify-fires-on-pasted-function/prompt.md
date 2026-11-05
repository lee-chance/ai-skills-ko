---
description: '함수를 인라인으로 붙여 넣고 달리 읽을 것이 없는 단순화 요청입니다. 스킬이 발동해야 하고, 응답은 원본의 모든 동작을 유지하며 무엇을 왜 안전하게 제거했는지 말해야 합니다.'
expected_outcome: 'null 또는 undefined에 대해 여전히 []를 반환하고, 문자열을 쉼표로 나누며, 0 같은 비문자열 항목을 유지하고, 빈 항목을 버리고, 첫 등장 순서로 중복을 제거하는 더 짧은 normalizeTags입니다. 제거한 내용은 설명됩니다. code-simplification이 호출됩니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 함수를 단순화하세요. 동작은 하지만 읽기 어렵습니다.

```js
function normalizeTags(tags) {
  var out = [];
  if (tags === null || tags === undefined) { return out; }
  if (typeof tags === 'string') { tags = tags.split(','); }
  for (var i = 0; i < tags.length; i++) {
    var t = tags[i];
    if (t === null || t === undefined) { continue; }
    t = String(t);
    t = t.replace(/^\s+/, '').replace(/\s+$/, '');
    t = t.toLowerCase();
    if (t.length === 0) { continue; }
    var dup = false;
    for (var j = 0; j < out.length; j++) {
      if (out[j] === t) { dup = true; break; }
    }
    if (dup === false) { out.push(t); }
  }
  return out;
}
```
