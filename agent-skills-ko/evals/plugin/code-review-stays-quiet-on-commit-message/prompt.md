---
description: 'git-workflow-and-versioning에 속하는 요청과 함께 붙여 넣은 diff입니다. 리뷰 스킬 설명의 "even when the diff is pasted inline"(diff가 인라인으로 붙여 넣어진 경우에도) 조항을 지킵니다. 붙여 넣은 diff만으로는 리뷰 스킬이 발동하면 안 되기 때문입니다.'
expected_outcome: '커밋 메시지입니다. code-review-and-quality는 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 diff의 커밋 메시지를 작성하세요.

```diff
diff --git a/src/orders.js b/src/orders.js
--- a/src/orders.js
+++ b/src/orders.js
@@ -12,3 +12,9 @@ function listOrders(db) {
   return db.query('SELECT * FROM orders ORDER BY created_at DESC');
 }
-module.exports = { listOrders };
+function pageOrders(db, page, size) {
+  const rows = db.query('SELECT * FROM orders ORDER BY created_at DESC');
+  const start = (page - 1) * size;
+  return rows.slice(start, start + size);
+}
+
+module.exports = { listOrders, pageOrders };
```
