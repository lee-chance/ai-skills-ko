# Command Code에서 agent-skills 사용하기

[Command Code](https://commandcode.ai)에는 네이티브 스킬 시스템이 있습니다. 내장 `cmd skills` 명령은 GitHub 저장소를 클론하고, 모든 `SKILL.md`를 재귀적으로 탐색한 뒤, 고른 스킬을 설치합니다.

Command Code 바이너리는 `cmd`로 제공됩니다(Windows 별칭은 `cmdc`이고, `command-code`도 별칭입니다). 아래 예는 `cmd`를 사용합니다.

## 설치

**프로젝트 범위** (현재 git 루트의 `.commandcode/skills/`에 설치합니다. 기본값입니다):

```bash
cmd skills add addyosmani/agent-skills
```

대화형 터미널에서는 25개 스킬 중 설치할 것을 고르는 다중 선택이 표시됩니다. 파이프나 비대화형 호출은 발견된 스킬을 모두 설치합니다.

**특정 스킬 설치:**

```bash
cmd skills add addyosmani/agent-skills -s spec-driven-development
```

**사용자 범위** (`~/.commandcode/skills/`에 설치하며, 모든 프로젝트에서 사용할 수 있습니다):

```bash
cmd skills add addyosmani/agent-skills --global
```

**지원하는 다른 형식:**

```bash
cmd skills add addyosmani/agent-skills@main            # a specific branch
cmd skills add addyosmani/agent-skills/skills/interview-me   # a specific path in the repo
cmd skills add addyosmani/agent-skills --force         # overwrite / update if already installed
```

## 관리

```bash
cmd skills list                       # list installed skills (project + user + bundled)
cmd skills remove spec-driven-development           # remove a project-scoped skill
cmd skills remove spec-driven-development --global  # remove a user-scoped skill
```

`add`에 `--force`를 붙이면 기존 스킬을 다시 받아 덮어씁니다. 최신 버전으로 업데이트하는 방법입니다.

## 사용법

설치된 스킬은 자동으로 탐색되어 TUI 슬래시 메뉴에 `[skill]` 태그와 함께 나타납니다.

```
/spec-driven-development   [skill] 코드를 작성하기 전에 스펙을 작성합니다…
```

`/`를 입력해 둘러보거나, 스킬 이름을 입력해 거르세요. `/skills`로 스킬을 켜거나 끌 수 있습니다.

## 스킬이 있는 위치

Command Code는 다음 위치에서 스킬을 탐색합니다. 프로젝트 항목은 가장 가까운 git 루트를 기준으로 해석됩니다.

| 범위 | 경로 |
|-------|------|
| 프로젝트 | `.commandcode/skills/<name>/SKILL.md` |
| 프로젝트 (agents-compat) | `.agents/skills/<name>/SKILL.md` |
| 사용자 | `~/.commandcode/skills/<name>/SKILL.md` |
| 사용자 (agents-compat) | `~/.agents/skills/<name>/SKILL.md` |

`cmd skills add`는 `.commandcode/skills/`(프로젝트) 또는 `~/.commandcode/skills/`(`--global`)에 기록합니다.
