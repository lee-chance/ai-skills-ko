---
description: '축을 이름까지 밝히고 짧은 diff를 인라인으로 붙인 리뷰 요청입니다. 스킬이 발동해야 하며(리뷰 커맨드를 통하거나 직접), 응답에는 그 심각도 라벨이 있어야 합니다.'
expected_outcome: '판정이 있는 구조화된 리뷰, 스킬의 심각도 분류로 라벨이 붙은 발견 사항, 그리고 pageOrders의 off-by-one을 필수 변경으로 다룹니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

머지하기 전에 이 diff를 정확성, 가독성, 보안, 성능 축으로 코드 리뷰하세요. orders 엔드포인트에 페이징을 추가합니다.

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
