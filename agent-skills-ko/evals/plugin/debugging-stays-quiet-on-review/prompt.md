---
description: 'debugging 케이스와 같은 붙여 넣은 diff를, 보고된 실패 없이 코드 리뷰로 요청합니다. 붙여 넣은 diff를 모두 debugging-and-error-recovery로 보내는 것을 막습니다.'
expected_outcome: '페이징 결함을 짚는 코드 리뷰입니다. debugging-and-error-recovery는 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

머지하기 전에 이 diff를 리뷰하세요. orders 엔드포인트에 페이징을 추가합니다.

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
+  return rows.slice(start, start + size - 1);
+}
+
+module.exports = { listOrders, pageOrders };
```
