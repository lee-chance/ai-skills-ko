---
description: 'diff를 인라인으로 붙여 넣은 커밋 메시지 요청입니다. diff에는 서로 무관한 변경이 둘 있습니다. 스킬이 발동해야 하고, 응답은 타입이 있는 제목과 이유를 말하는 본문을 주며, 두 관심사는 별도 커밋에 속한다고 말해야 합니다.'
expected_outcome: '재시도 변경에 대한 관례적 커밋 메시지와 일시적 실패라는 동기를 설명하는 본문, 그리고 formatMoney 헬퍼는 별도 관심사이므로 자체 커밋과 메시지가 필요하다는 언급입니다. git-workflow-and-versioning이 호출됩니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

이 diff의 커밋 메시지를 작성하세요.

```diff
diff --git a/src/orders.js b/src/orders.js
--- a/src/orders.js
+++ b/src/orders.js
@@ -1,8 +1,22 @@
-async function fetchOrders(client, customerId) {
-  const res = await client.get(`/customers/${customerId}/orders`);
-  return res.data;
+const RETRY_DELAYS_MS = [200, 800, 2000];
+
+async function fetchOrders(client, customerId) {
+  let lastError;
+  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
+    try {
+      const res = await client.get(`/customers/${customerId}/orders`);
+      return res.data;
+    } catch (err) {
+      lastError = err;
+      if (err.status && err.status < 500) throw err;
+      if (attempt < RETRY_DELAYS_MS.length) {
+        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
+      }
+    }
+  }
+  throw lastError;
 }
 
 module.exports = { fetchOrders };
diff --git a/src/format.js b/src/format.js
--- a/src/format.js
+++ b/src/format.js
@@ -4,3 +4,8 @@ function formatDate(d) {
   return d.toISOString().slice(0, 10);
 }
 
-module.exports = { formatDate };
+function formatMoney(cents, currency = 'USD') {
+  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
+}
+
+module.exports = { formatDate, formatMoney };
```
