# 설치 블록

이것은 README의 설치 섹션을 위한 정규 문구입니다. 변경사항은 여기에서 한 번만 이루어지고 README에 복사됩니다.

## Claude Code

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

기본적으로 자동 업데이트됩니다.

## Codex

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

시작 시 자동 업데이트됩니다.

## GitHub Copilot (CLI와 VS Code)

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

그런 다음, 한 번만, `~/.copilot/settings.json`에 추가하세요:

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": { "source": { "source": "github", "repo": "mattpocock/skills" }, "autoUpdate": true }
  }
}
```

VS Code에서는 **Chat: Install Plugin From Source**를 실행하고 `https://github.com/mattpocock/skills`를 입력하세요. 매일 업데이트됩니다.

## Gemini CLI (수동 업데이트)

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

업데이트하려면 두 명령어를 다시 실행하세요.

## 다른 에이전트, 또는 편집 가능한 파일 (수동 업데이트)

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, opencode, devin, windsurf, amp, pi; -a를 생략하면 선택 가능
```

설치 프로그램이 어떤 스킬을 가져올지 물으면, `setup-matt-pocock-skills`를 포함하세요. 업데이트하려면 `npx skills@latest update`를 실행하고, 새 스킬을 가져오려면 `add`를 다시 실행하세요.
