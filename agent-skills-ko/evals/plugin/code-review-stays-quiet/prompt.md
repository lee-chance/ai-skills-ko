---
description: 'test-driven-development에 속하는 테스트 우선 요청입니다. 리뷰 스킬은 발동하면 안 됩니다.'
expected_outcome: '응답이 실패하는 테스트를 먼저 제안합니다. code-review-and-quality는 호출되지 않습니다.'
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

고치기 전에 이 버그의 실패하는 테스트를 작성하세요. splitCents(100, 3)은 [33, 33, 33]을 반환하고 1센트가 사라집니다.
