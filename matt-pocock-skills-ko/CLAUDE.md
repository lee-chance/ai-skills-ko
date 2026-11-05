스킬은 `skills/` 아래 버킷 폴더로 구성됩니다:

- `engineering/`: 일일 코드 작업
- `productivity/`: 일일 비코드 워크플로우 도구
- `misc/`: 유지되지만 거의 사용되지 않으며 홍보되지 않음
- `in-progress/`: 베타: 의도적으로 공개, 피드백 환영, 플러그인에 포함되지 않음
- `deprecated/`: 더 이상 사용되지 않음

`engineering/` 또는 `productivity/`(**홍보된** 버킷)의 모든 스킬은 최상위 `README.md`에 참조가 있어야 하며 `.claude-plugin/plugin.json`의 `skills` 배열에 항목이 있어야 합니다(Claude Code 플러그인은 정확히 홍보된 세트를 포함함). `misc/`, `in-progress/`, `deprecated/`의 스킬은 둘 다 나타나지 않아야 합니다.

설치 명령은 [.agents/install-block.md](./.agents/install-block.md)에서 그대로 복사됩니다. `.claude-plugin/marketplace.json`은 저장소 자체의 마켓플레이스입니다. Claude Code를 제외한 모든 에이전트는 자동 업데이트를 위해 여기에서 설치하며, Claude Code는 `claude-plugins-official`을 사용합니다. 매니페스트를 수정한 후 `claude plugin validate . --strict`를 실행하세요. [ADR 0002](./.agents/adr/0002-ship-as-a-claude-code-plugin.md)가 이유를 기록합니다.

최상위 `README.md`의 각 스킬 항목은 스킬 이름을 해당 `SKILL.md`에 링크해야 합니다.

각 버킷 폴더에는 스킬 이름이 `SKILL.md`에 링크된 한 줄 설명과 함께 버킷의 모든 스킬을 나열하는 `README.md`가 있습니다. 홍보된 버킷의 `README.md`와 최상위 `README.md`는 항목을 **사용자 호출** 및 **모델 호출**로 그룹화합니다. 홍보되지 않은 버킷 `README.md`(`misc/`, `in-progress/`)는 플랫 리스트를 사용합니다.

`engineering/` 및 `productivity/`의 스킬은 `docs/<bucket>/<skill-name>.md`에 사람 대면 문서 페이지도 있습니다(문서 트리는 `skills/` 아래의 두 버킷 폴더를 미러링함). 게시된 URL은 버킷에 관계없이 `https://aihero.dev/skills-<skill-name>`입니다: 문서 경로는 저장소 구성일 뿐입니다. `engineering/` 또는 `productivity/`에서 스킬을 추가, 이름 변경 또는 동작을 변경할 때 [.agents/writing-docs.md](./.agents/writing-docs.md)를 따라 문서 페이지를 만들거나 재동기화하세요. 완성된 페이지는 네 개의 섹션을 포함합니다: **What it does**, **When to reach for it**, **Common questions**, **It's working if**. `writing-docs.md`는 템플릿, 섹션 순서, 질문을 찾을 위치를 담고 있습니다. 홍보되지 않은 버킷(`misc/`, `in-progress/`, `deprecated/`)의 스킬은 문서 페이지가 **없습니다**. 한 가지 예외는 완전히 제거된 홍보 스킬입니다: 페이지는 남아 있으며 보관됨으로 표시됩니다(`writing-docs.md` 참조).

모든 `SKILL.md`는 사용자 호출(`disable-model-invocation: true` 플러스 `agents/openai.yaml`의 `policy.allow_implicit_invocation: false`, 인간만 도달 가능) 또는 모델 호출(모델 또는 사용자가 도달 가능)입니다. [.agents/invocation.md](./.agents/invocation.md)를 참조하세요.

[`ask-matt`](./skills/engineering/ask-matt/SKILL.md)는 모든 사용자 도달 가능 스킬과 그들이 어떻게 관련되는지 매핑하는 라우터입니다. 문서 페이지를 재동기화하는 것과 동일한 트리거가 여기에 적용됩니다: 사용자 도달 가능 스킬을 추가, 이름 변경, 제거하거나 플로우에 맞는 방식을 변경할 때마다 `ask-matt`의 `SKILL.md`를 다시 읽고 업데이트하여 맵이 정확하게 유지되도록 하세요: 언급하지 않는 새 스킬이나 여전히 라우팅하는 오래된 스킬은 거짓말하는 라우터입니다.

`deprecated/` 및 `misc/` 외부의 모든 스킬을 로컬 하네스 스킬 디렉토리(`~/.claude/skills`, `~/.agents/skills`)에 (재)링크하려면 `scripts/link-skills.sh`를 실행하세요. 각 항목은 이 저장소로의 심볼릭 링크이므로 `git pull`은 설치된 스킬을 최신 상태로 유지합니다. 스킬을 추가, 제거 또는 이름 변경한 후 스크립트를 다시 실행하세요.

이 저장소의 산문(`SKILL.md` 파일, 문서, `README.md`, `CHANGELOG.md`, ADR, 변경 세트, 코드 주석)에는 em-dash가 없습니다. 문장이 em-dash에 도달하려고 하면, 대신 쉼표, 콜론, 마침표, 괄호 또는 접속사로 다시 작성하세요. 문장이 실제로 원하는 것으로 다시 작성하세요. 절대 문자를 맹목적으로 대체하지 마세요.

서브에이전트를 디스패치하는 모든 스킬은 새 컨텍스트 창으로 시작하라고 말합니다. 일부 하네스(예: Codex)는 기본적으로 상위 대화를 포크하며, 포크는 상위 컨텍스트를 상속하는데, 이것은 서브에이전트가 벗어나려고 했던 것입니다.

## Agent skills

### Triage labels

정규 이름, 변경되지 않음. `docs/agents/triage-labels.md`를 참조하세요. 이슈는 [`SCOPE.md`](./SCOPE.md)에 대해 판단됩니다.
