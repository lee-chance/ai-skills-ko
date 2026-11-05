# Productivity

일반 워크플로우 도구, 코드 전용이 아닙니다.

## 사용자 호출

여러분이 입력할 때만 도달 가능합니다 (Claude Code: `disable-model-invocation: true`; Codex: `agents/openai.yaml`에 `policy.allow_implicit_invocation: false`).

- **[grill-me](./grill-me/SKILL.md)**: 설계 트리의 모든 분기가 해결될 때까지 계획이나 설계에 대해 끊임없이 인터뷰를 받으세요.
- **[handoff](./handoff/SKILL.md)**: 현재 대화를 핸드오프 문서로 압축하여 다른 에이전트가 작업을 계속할 수 있도록 합니다.
- **[teach](./teach/SKILL.md)**: 현재 디렉토리를 상태 저장 교육 워크스페이스로 사용하여 여러 세션에 걸쳐 사용자에게 새로운 스킬이나 개념을 가르칩니다.
- **[to-questionnaire](./to-questionnaire/SKILL.md)**: 혼자 답할 수 없는 결정을 답할 수 있는 한 사람을 위한 Markdown 설문지로 전환합니다 (비동기식으로 작성되거나 회의 중에 함께 작성됨).
- **[wait-what](./wait-what/SKILL.md)**: 메시지가 이해되지 않는 순간 발동하세요. 에이전트가 누락된 컨텍스트로 다시 피치하며, `GLOSSARY.md` 어휘를 사용하여 평이한 영어로 설명합니다.

## 모델 호출

모델 또는 사용자가 도달 가능합니다 (모델이 도달할 수 있도록 풍부한 트리거 문구).

- **[grilling](./grilling/SKILL.md)**: 설계 트리의 모든 분기가 해결될 때까지 계획, 결정 또는 아이디어에 대해 사용자를 끊임없이 인터뷰합니다.
- **[writing-for-agents](./writing-for-agents/SKILL.md)**: 에이전트를 위한 문서 작성: 스킬, AGENTS.md/CLAUDE.md, 에이전트가 포인터로 도달하는 모든 문서.
