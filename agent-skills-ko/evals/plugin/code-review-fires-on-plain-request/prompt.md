---
description: '축을 이름 붙이지 않고 diff를 인라인으로 붙인, 가장 단순한 리뷰 요청입니다. #612는 이 표현을 9개 중 3개로 남겼고, 이 케이스는 그 조항을 위한 것입니다.'
expected_outcome: '판정과 심각도 라벨이 붙은 발견이 있는 리뷰이며, 그 안에 pageOrders의 off-by-one이 있습니다. code-review-and-quality가 호출됩니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

머지하기 전에 이 diff를 리뷰하세요.

```diff
diff --git a/src/orders.js b/src/orders.js
--- a/src/orders.js
+++ b/src/orders.js
@@ -12,3 +12,15 @@ function listOrders(db) {
   return db.query('SELECT * FROM orders ORDER BY created_at DESC');
 }
-module.exports = { listOrders };
+function pageOrders(db, page, size) {
+  const rows = db.query('SELECT * FROM orders ORDER BY created_at DESC');
+  const start = (page - 1) * size;
+  return rows.slice(start, start + size - 1);
+}
+
+app.get('/orders', (req, res) => {
+  const page = Number(req.query.page) || 1;
+  const size = Number(req.query.size) || 20;
+  res.json(pageOrders(db, page, size));
+});
+
+module.exports = { listOrders, pageOrders };
```
