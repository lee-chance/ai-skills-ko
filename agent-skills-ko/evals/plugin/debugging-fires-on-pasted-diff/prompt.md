---
description: 'diff를 인라인으로 붙인 실패 테스트 진단입니다. debugging-and-error-recovery가 발동하는지, 그리고 응답이 원인을 이름 붙이고 최소 수정을 하며 확인 방법을 말하는지 확인합니다.'
expected_outcome: '원인으로 포함되지 않는 `slice` 끝을 이름 붙입니다. 수정은 `start + size`로 바꾸는 한 토큰이고, 확인 방법이 있습니다. 예를 들어 실패한 테스트를 다시 실행하거나, 가득 찬 페이지와 마지막 페이지의 경계를 단언하는 테스트를 추가합니다.'
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
