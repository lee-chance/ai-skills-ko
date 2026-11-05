---
description: 'debugging-and-error-recovery에 속하는 "what broke"(무엇이 깨졌나) 질문과 함께 붙여 넣은 diff입니다. test-driven-development 설명의 "fix a bug in it"(그 안의 버그를 고친다) 조항을 지킵니다. 진단 요청에 버그가 언급되어도 TDD 스킬이 발동하면 안 되기 때문입니다.'
expected_outcome: 'off-by-one에 대한 진단입니다. test-driven-development는 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 변경 직후 orders 페이지 테스트가 실패하기 시작했습니다. 20행을 기대하는데 19행이 나옵니다. diff는 다음과 같습니다. 무엇이 깨졌나요?

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
