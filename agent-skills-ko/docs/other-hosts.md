# 다른 호스트

이 호스트들은 팩을 설치할 수 있지만, README의 설치 절에는 없습니다. 현재 릴리스를 그 호스트에서 실행해 본 메인테이너가 없기 때문입니다. 각 항목은 한 줄입니다. 호스트와 설치 명령입니다. 항목을 추가하려면 [호스트 추가 가이드](../CONTRIBUTING.md#adding-a-host-guide)를 보세요.

스킬은 평범한 `SKILL.md` 폴더이므로, Agent Skills 레이아웃을 읽는 에이전트라면 불러올 수 있습니다. [getting-started.md](getting-started.md)를 보세요.

- **Dojo Workspace**: `dojo skills add addyosmani/agent-skills`
- **fx**: `git clone https://github.com/addyosmani/agent-skills.git /tmp/agent-skills && mkdir -p .fx/skills && cp -R /tmp/agent-skills/skills/* .fx/skills/` (프로젝트 범위입니다. 모든 워크스페이스에 쓰려면 `~/.fx/skills/`를 사용하세요. fx 0.0.5 이상이 필요합니다)
- **Oh My Pi**: `omp plugin marketplace add addyosmani/agent-skills`, 이어서 `omp plugin install agent-skills@addy-agent-skills`
- **Pi**: `pi install git:github.com/addyosmani/agent-skills`
