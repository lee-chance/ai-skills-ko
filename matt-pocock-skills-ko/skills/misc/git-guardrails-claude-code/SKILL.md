---
name: git-guardrails-claude-code
description: "Claude Code 훅을 설정하여 실행 전에 위험한 git 명령(push, reset --hard, clean, branch -D 등)을 차단합니다. 사용자가 파괴적인 git 작업을 방지하거나, git 안전 훅을 추가하거나, Claude Code에서 git push/reset을 차단하고 싶을 때 사용하세요."
---

# Setup Git Guardrails

Claude가 실행하기 전에 위험한 git 명령을 차단하고 가로채는 PreToolUse 훅을 설정합니다.

## 차단되는 것

- `git push` (`--force` 포함 모든 변형)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

차단되면, Claude는 이러한 명령에 접근할 권한이 없다는 메시지를 봅니다.

## 단계

### 1. 범위 묻기

사용자에게 묻기: **이 프로젝트만** (`.claude/settings.json`)에 설치할지 **모든 프로젝트** (`~/.claude/settings.json`)에 설치할지?

### 2. 훅 스크립트 복사

번들된 스크립트는 다음에 있습니다: [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

범위에 따라 대상 위치에 복사:

- **프로젝트**: `.claude/hooks/block-dangerous-git.sh`
- **글로벌**: `~/.claude/hooks/block-dangerous-git.sh`

`chmod +x`로 실행 가능하게 만드세요.

### 3. 설정에 훅 추가

적절한 설정 파일에 추가:

**프로젝트** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**글로벌** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

설정 파일이 이미 존재하면, 훅을 기존 `hooks.PreToolUse` 배열에 병합하세요. 다른 설정을 덮어쓰지 마세요.

### 4. 커스터마이제이션에 대해 묻기

사용자가 차단 목록에서 패턴을 추가하거나 제거하고 싶은지 묻습니다. 그에 따라 복사된 스크립트를 편집하세요.

### 5. 검증

빠른 테스트 실행:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

코드 2로 종료하고 stderr에 BLOCKED 메시지를 출력해야 합니다.
