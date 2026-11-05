---
type: llm
---

리뷰가 `rows.slice(start, start + size - 1)`은 모든 페이지에서 `size`보다 한 행 적게 반환한다(slice의 끝 인덱스는 포함되지 않습니다)는 점을 지적하고, 머지 전에 반드시 고쳐야 할 문제로 다루면 PASS입니다. 예를 들어 Critical로 표시하거나, 접두어 없이 필수 변경으로 두는 경우입니다.

페이지가 한 행 모자라게 돌아온다는 점을 언급하지 않거나, 그 발견을 Nit, Optional, Consider, FYI로 분류하면 FAIL입니다.
