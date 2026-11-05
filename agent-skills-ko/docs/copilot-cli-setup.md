# GitHub Copilot CLI에서 agent-skills 사용하기

독립 실행형 `copilot` 명령줄 도구는 이 저장소를 플러그인으로 설치하고 `skills/`의 모든 스킬을 탐색합니다. VS Code 안의 Copilot은 [copilot-setup.md](copilot-setup.md)를 보세요. 설정과 호출 모델이 다릅니다.

## 설치

**이 저장소의 마켓플레이스에서:** 먼저 등록한 다음 거기에서 설치합니다. `addy-agent-skills`는 이 저장소가 선언한 마켓플레이스 이름이며, GitHub 전역 레지스트리가 아닙니다. 이 이름은 `marketplace add` 이후에만 해석됩니다.

```bash
copilot plugin marketplace add addyosmani/agent-skills
copilot plugin install agent-skills@addy-agent-skills
```

**저장소에서 직접**, 마켓플레이스를 등록하지 않고 설치합니다.

```bash
copilot plugin install addyosmani/agent-skills
```

**로컬 클론에서**, 세션 범위의 개발용 설치입니다.

```bash
git clone https://github.com/addyosmani/agent-skills.git
copilot --plugin-dir /path/to/agent-skills
```

`--plugin-dir`는 해당 세션에만 플러그인을 불러오며, 영구적으로 설치하지 않습니다. 스킬을 편집하는 동안 사용하세요.

## 확인

```bash
copilot plugin list   # agent-skills@addy-agent-skills
copilot skill list    # the plugin's skills, alongside the built-in ones
```

대화형 세션에서 `/skills list`는 같은 카탈로그를 보여 줍니다.

## 얻는 것과 얻지 않는 것

루트 `plugin.json`이 Copilot CLI가 읽는 매니페스트입니다. Claude Code에 속하는 `.claude-plugin/plugin.json`보다 우선합니다. `$schema` 줄은 [Agent Plugins 1.0.0](https://agent-plugins.org) 매니페스트를 선언하며, 이것이 CLI를 Agent Plugins 모드로 전환합니다. 매니페스트가 컴포넌트 경로를 지정하지 않으므로 기본값으로 돌아갑니다.

- **스킬: 사용할 수 있습니다.** 명시적 경로가 없으면 CLI는 관례적인 `skills/` 디렉터리를 쓰고, 스킬은 그곳에서 탐색됩니다.
- **라이프사이클 커맨드: 사용할 수 없습니다.** Agent Plugins 모드에서 CLI는 `com.github.copilot/commands/`에서만 커맨드를 읽습니다. 이 저장소에는 그 디렉터리가 없으므로 `/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`은 등록되지 않습니다. 해당 파일은 `.claude/commands/`에 있으며 Claude Code 커맨드입니다.

매니페스트 우선순위와 컴포넌트별 경로 기본값은 [CLI 플러그인 참고](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)와 [플러그인 만들기](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating)를 보세요.

## 사용법

원하는 스킬의 이름을 말하거나, 작업을 설명하고 에이전트가 그 스킬로 라우팅하게 하세요.

> [기능]의 스펙을 작성하려면 spec-driven-development 스킬을 사용하세요.

> test-driven-development 스킬을 사용하세요. 이 버그에 대해 실패하는 테스트를 먼저 작성한 다음 수정하세요.

> 스테이징된 변경을 리뷰하려면 code-review-and-quality 스킬을 사용하세요.

## 문제 해결

| 증상 | 확인할 것 |
|---------|---------------|
| `plugin install`이 `agent-skills@addy-agent-skills`를 해석하지 못합니다 | 먼저 `copilot plugin marketplace add addyosmani/agent-skills`를 실행하세요. 그 이름은 마켓플레이스가 등록된 뒤에만 해석됩니다. 또는 저장소를 직접 설치하세요. |
| 플러그인은 설치되었지만 스킬이 없습니다 | `copilot plugin list`로 플러그인을 확인한 다음, `copilot skill list`(또는 세션의 `/skills list`)로 무엇이 탐색되었는지 보세요. 목록이 비어 있으면 루트 `plugin.json`을 [1.0.0 스키마](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json)와 대조하세요. Agent Plugins 모드에서는 스키마 오류(예를 들어 `author`가 객체가 아니라 문자열인 경우)가 치명적이며, CLI는 스킬을 하나도 불러오지 않습니다. |
| `/spec`, `/build` 등이 없습니다 | 설치가 깨진 것이 아닙니다. 루트 매니페스트가 커맨드를 등록하지 않습니다. 스킬을 이름으로 요청하세요. |
| 스킬을 로컬에서 바꿨는데 CLI가 이전 내용을 보여 줍니다 | 새 세션을 시작하거나, `--plugin-dir`로 클론을 가리켜 실행하세요. |
