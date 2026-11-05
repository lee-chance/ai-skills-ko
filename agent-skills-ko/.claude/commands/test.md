---
description: TDD 워크플로우를 실행합니다. 실패하는 테스트를 작성하고, 구현하고, 검증합니다. 버그에는 Prove-It 패턴을 사용합니다.
disable-model-invocation: true
---

agent-skills:test-driven-development 스킬을 호출하세요.

새 기능:
1. 기대 동작을 서술하는 테스트를 작성하세요 (실패해야 합니다)
2. 그 테스트가 통과하도록 코드를 구현하세요
3. 테스트가 통과하는 상태를 유지하면서 리팩터하세요

버그 수정 (Prove-It 패턴):
1. 버그를 재현하는 테스트를 작성하세요 (반드시 실패해야 합니다)
2. 테스트가 실패하는지 확인하세요
3. 수정을 구현하세요
4. 테스트가 통과하는지 확인하세요
5. 회귀를 확인하려고 전체 테스트 스위트를 실행하세요

브라우저 관련 문제이면 agent-skills:browser-testing-with-devtools도 호출해 Chrome DevTools MCP로 검증하세요.
