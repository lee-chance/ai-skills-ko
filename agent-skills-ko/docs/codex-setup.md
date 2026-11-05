# Codex에서 agent-skills 사용하기

이 저장소는 [Codex 플러그인](https://developers.openai.com/codex/plugins/build)이기도 합니다. Claude Code가 쓰는 것과 같은 루트 `skills/` 디렉터리를 Codex가 사용하므로, 파일을 복사하거나 중복으로 두지 않습니다.

## 설치

```bash
codex plugin marketplace add addyosmani/agent-skills
codex plugin add agent-skills@agent-skills
```

> Codex CLI v0.122 이상이 필요합니다. 이전 릴리스의 명령은 `codex marketplace add`였습니다. [Codex CLI 문서](https://developers.openai.com/codex/cli)를 보세요.

첫 번째 명령은 이 저장소를 `agent-skills` 마켓플레이스로 등록합니다. 두 번째 명령은 그 마켓플레이스에서 `agent-skills` 플러그인을 설치하고 활성화합니다. 설치 후에 새 Codex 세션을 시작하면 스킬이 탐색됩니다.

로컬 클론도 동작합니다.

```bash
codex plugin marketplace add /path/to/your/clone
codex plugin add agent-skills@agent-skills
```

## 사용법

설치 후 Codex 채팅에서 `@`로 스킬을 호출하거나(예: `@spec-driven-development`), 작업을 설명하고 Codex가 알맞은 스킬을 고르게 하세요. `skills/` 아래의 스킬 25개를 모두 사용할 수 있습니다.

[Codex는 점진적 공개를 사용합니다](https://developers.openai.com/codex/skills). 각 스킬의 `name`과 `description`에서 시작하고, 필요할 때 스킬을 고른 다음, 선택된 경우에만 전체 `SKILL.md`를 불러옵니다. `using-agent-skills/SKILL.md`를 `AGENTS.md`, 시스템 프롬프트, 또는 다른 상시 컨텍스트에 추가로 붙여 넣지 마세요. 그러면 팩의 메타 라우터가 Codex의 네이티브 라우터 위에 겹치고, 불필요한 라우팅 작업이 늘어납니다. 메타 스킬은 팩과 함께 설치된 상태로 두어도 됩니다. 경고는 그 전체 지시문을 미리 불러오지 말라는 점에만 해당합니다.

## 동작 방식

- `.codex-plugin/plugin.json`: 저장소 루트의 Codex 플러그인 매니페스트입니다. `skills`를 `./skills/`로 가리키고, Codex가 요구하는 메타데이터를 제공합니다.
- `.agents/plugins/marketplace.json`: 저장소 루트(`./`)를 플러그인 소스로 선언하는 마켓플레이스 항목입니다.
- `skills/<name>/SKILL.md`: 변경하지 않습니다. Codex와 Claude Code는 같은 `name` + `description` 프론트매터 형식을 공유하므로, 파일 하나로 두 플랫폼을 모두 지원합니다.

`.claude/commands/`의 슬래시 커맨드와 `agents/`의 페르소나는 Claude Code 전용입니다. `hooks/` 아래의 `SessionStart` 스크립트는 네이티브 스킬 라우팅이 없는 호스트를 위한 독립 도우미이며, 어느 플러그인에도 연결되어 있지 않습니다. Codex에서는 슬래시 커맨드 대신 기반 스킬을 직접 호출하세요. 예를 들어 `/spec` 대신 `@spec-driven-development`입니다.
