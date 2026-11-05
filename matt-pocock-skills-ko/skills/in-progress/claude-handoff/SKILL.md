---
name: claude-handoff
description: "현재 대화를 즉시 작업을 이어받는 새로운 백그라운드 에이전트에게 전달하세요."
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

현재 대화의 핸드오프 요약을 작성하여 새로운 에이전트가 작업을 계속할 수 있도록 하세요. 이를 사용자 OS의 임시 디렉토리에 저장한 다음, 이를 프롬프트로 사용하는 백그라운드 에이전트를 시작하세요: `claude --bg --name "<descriptive name>" -- "$(cat <summary file>)"`. 파일을 전달하면 쉘이 요약에서 백틱을 실행하거나 `$`를 확장하지 않습니다. 현재 작업 디렉토리에서 시작하고 즉시 반환됩니다. 사용자는 `claude agents`로 관리합니다.

항상 `-n`/`--name`을 설명적인 이름과 함께 전달하세요(예: `--name "Fix login bug"`). 이는 작업 목록, 세션 선택기, 터미널 제목에 표시되는 이름을 설정합니다.

요약에 "suggested skills" 섹션을 포함하여, 다음 에이전트가 Skill 도구를 호출해야 하는 스킬을 명명하세요.

이미 다른 아티팩트(스펙, 계획, ADR, 이슈, 커밋, diff)에 캡처된 콘텐츠를 중복하지 마세요. 대신 경로나 URL로 참조하세요.

요약이 에이전트의 프롬프트가 되므로, API 키, 비밀번호 또는 개인 식별 정보와 같은 민감한 정보는 제거하세요.

사용자가 인수를 전달한 경우, 이를 다음 세션이 집중할 내용에 대한 설명으로 처리하고 그에 따라 요약을 맞추세요.
