# Claude Code에서의 pstack

pstack 스킬은 Cursor 이름을 사용합니다. Claude Code에서는 세션당 한 번 이 파일을 읽은 다음, 아래 표로 스킬의 각 Cursor 이름을 매핑하세요. `<pstack>`은 `skills/`와 `docs/`를 보유하는 폴더를 의미합니다. Cursor 필드에 행이 없으면 삭제하고 그렇게 말하세요. 도구 스키마가 거부하는 필드나 값을 절대 전달하지 마세요.

## 도구

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `AskQuestion` | `AskUserQuestion`. `-p` 모드에서는 없으므로 일반 텍스트로 물으세요. |
| todolist 열기 | 세션이 제공하는 경우 `TodoWrite`를 사용하세요. 그렇지 않으면 답변에 리스트를 유지하고 각 단계에서 업데이트하세요. |
| 다른 pstack 스킬 실행(`/name` 또는 "the **name** skill") | `<pstack>/skills/<name>/SKILL.md`를 `Read`하고 따르세요. `Skill` 도구는 대부분의 pstack 스킬을 거부합니다. 사용자에게 입력하라고 말할 때는 `/pstack:<name>`으로 작성하세요. |
| `Grep`, `Glob` | 세션에 `Grep`이나 `Glob`이 없을 때 `rg`와 함께 `Bash`. |

## 서브에이전트 필드

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | `subagent_type: "general-purpose"` |
| `poteto-agent`, `comment-sicko` | `pstack:poteto-agent`, `pstack:comment-sicko` |
| `readonly: true` | `subagent_type: "Explore"`. `Bash`를 유지하므로, 브리프도 "do not edit files"라고 말하고, 나중에 `git status`를 확인하세요. |
| `readonly: false` | `general-purpose`. 세션의 MCP 서버를 유지합니다. |
| `environment: "cloud"` | `isolation: "worktree"`. 워커가 체크아웃하는 브랜치나 커밋을 명명하세요. |
| `environment: "local"` | 생략. |
| `cloud_base_branch: <b>` | 워커에게 먼저 `<b>`를 체크아웃하라고 말하세요. |
| `run_in_background: true` | 생략. 서브에이전트는 기본적으로 백그라운드에서 실행되고 완료되면 알려줍니다. |
| `resume` | 새 에이전트를 생성하고 이전 결과를 브리프에 붙여넣으세요. |
| `file_attachments` | 브리프에 경로를 나열하세요. |

## 모델

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`, 예: `claude-opus-5-5-xhigh` | `model: "opus"` 및 `effort: "xhigh"`. `model`은 `opus`, `sonnet`, `haiku`, `fable`만 취합니다. `-fast` 삭제. |
| `grok-*`, `gpt-*` 또는 다른 비Claude 슬러그 | `model`을 생략하여 에이전트가 세션 모델에서 실행되도록 하고, 그렇게 말하세요. |
| `auto` 또는 `inherit-parent` | `model` 생략. |
| `pstack-models.mdc` 규칙, `~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`. Claude Code는 모든 새 세션에 로드하므로, 역할 라인이 이미 컨텍스트에 있습니다. 없으면 파일을 읽으세요. 파일이나 역할의 라인이 없으면 스킬의 기본 슬러그를 사용하세요. |
| 역할 값 `<model> <effort>`, 예: `opus high` | `model: "opus"` 및 `effort: "high"`. |

## setup-pstack

Claude Code는 `~/.claude/rules/`의 모든 `.md` 파일을 각 새 세션에 로드하므로, `setup-pstack`은 규칙을 거기에 작성합니다. 다음 변경 사항으로 단계를 따르세요:

- 감지. 감지된 모델은 `Agent` 도구 스키마가 나열하는 `model` 값이며, 각각은 `effort` 값에서 effort를 가집니다. 실제 모델을 `<model> <effort>`로 작성하세요, 예: `opus xhigh`. effort는 마지막 토큰이므로, 예산 단계는 작성된 대로 작동합니다.
- 기본값. 위의 행으로 각 기본 슬러그를 매핑하세요: `claude-opus-5-5-xhigh`는 `opus xhigh`이고, `grok-4.7-xhigh-fast`는 `inherit-parent`입니다.
- 작성. frontmatter 없이 `~/.claude/rules/pstack-models.md`를 작성한 다음, 주석 라인, `# budget` 라인, 단계 5의 역할당 한 라인. 전체 파일을 덮어쓰세요. 역할 라인을 `CLAUDE.md`나 `AGENTS.md`에 절대 넣지 마세요.

## 경로

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`, `~/.cursor/skills/` | `.claude/skills/`, `~/.claude/skills/` |
| `~/.cursor/plugins/`, `.cursor-plugin/plugin.json` | `~/.claude/plugins/`, `.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`, 항상 적용 규칙 | `CLAUDE.md`, 또는 `CLAUDE.md`가 없을 때 `AGENTS.md`. Claude Code는 `.mdc` 파일을 절대 읽지 않습니다. 모델 규칙은 예외입니다. 모델을 참조하세요. |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | 그 파일이 존재할 때 `<pstack>/<path>`. 플러그인은 스킬, `docs/guide/`, `README.md`를 제공합니다. 로컬 사본을 읽고 절대 가져오지 마세요. 링크가 필요할 때 사용자에게 URL을 제공하세요. |
| `~/.cursor/projects/<slug>/agent-transcripts/`의 트랜스크립트 | `~/.claude/projects/<slug>/<session>.jsonl`. 슬러그는 각 `/`와 `.`가 `-`로 변경된 워크스페이스 경로이므로, `/Users/you/proj`는 `-Users-you-proj`입니다. 해당 폴더에 직접 있는 가장 최신 `.jsonl`이 현재 세션입니다. 그것의 `<session>/subagents/` 폴더는 서브에이전트 트랜스크립트를 보유합니다. 이 워크스페이스의 폴더만 읽으세요. |

## Cursor 전용 기능

Claude Code에는 Cursor Automations, Bugbot, Cursor cloud agents, 또는 내장 PR 도구가 없습니다. 단계가 하나를 필요로 할 때, 답변에 한 줄을 넣으세요, `Skipped in Claude Code: <step>. <reason>.`, 그런 다음 다음 단계로 진행하세요. 멈추거나, 물어보거나, 재시도하지 마세요. 나중 단계가 건너뛴 단계가 만든 것(예: URL 또는 키)을 필요로 할 때, 자리 표시자를 남기고 라인에 명명하세요.

| Cursor | Claude Code |
| --- | --- |
| Cursor Automations: routines, `update_state` routine calls, `api2.cursor.sh/automations` webhooks, routine wakes, `SendToUser` secret requests | 라인으로 건너뛰기. |
| Bugbot | Bugbot 주석은 GitHub PR의 일반 리뷰 스레드이므로, 단계가 제공하는 forge 명령으로 분류하세요. PR에 Bugbot 체크나 주석이 없을 때 Bugbot을 시작, 대기 또는 구성하는 단계를 건너뛰세요. |
| Cursor cloud agents | `environment: "cloud"`는 서브에이전트 필드에서처럼 워크트리에 매핑됩니다. 대시보드 상태나 자체 머신과 같은 클라우드 에이전트 자체가 필요한 단계를 건너뛰세요. |
| 내장 PR 도구 | 단계가 제공하는 forge 명령을 사용하세요, 예: `gh pr create`. 그것은 건너뛰기가 아니므로 라인을 작성하지 마세요. |
