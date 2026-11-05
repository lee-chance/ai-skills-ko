---
name: setup-matt-pocock-skills
description: "엔지니어링 스킬을 위해 이 저장소를 구성합니다: 이슈 트래커, 트리아지 라벨 어휘, 도메인 문서 레이아웃을 설정합니다. 다른 엔지니어링 스킬의 첫 사용 전에 한 번 실행하세요."
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

엔지니어링 스킬이 가정하는 저장소별 구성을 스캐폴드합니다:

- **이슈 트래커**: 이슈가 사는 곳 (기본적으로 GitHub; 로컬 마크다운도 기본적으로 지원됨)
- **트리아지 라벨**: 다섯 가지 정규 트리아지 역할에 사용되는 문자열
- **도메인 문서**: `GLOSSARY.md`와 ADR이 사는 곳, 그것들을 읽기 위한 소비자 규칙

이것은 결정론적 스크립트가 아니라 프롬프트 구동 스킬입니다. 탐색하고, 발견한 것을 제시하고, 사용자와 확인한 다음, 작성하세요.

## 프로세스

### 1. 탐색

현재 저장소를 보고 시작 상태를 이해하세요. 존재하는 것을 읽으세요. 가정하지 마세요:

- `git remote -v`와 `.git/config`: 이것은 GitHub 저장소인가요? 어느 것?
- 저장소 루트의 `AGENTS.md`와 `CLAUDE.md`: 존재하나요? 둘 중 하나에 이미 `## Agent skills` 섹션이 있나요?
- 저장소 루트의 `GLOSSARY.md`와 `GLOSSARY-MAP.md`, 레거시 `CONTEXT.md` / `CONTEXT-MAP.md`. 레거시 파일이 존재하면, `GLOSSARY` 이름으로 `git mv`하고 `docs/agents/domain.md`에서 그 이름들을 다시 작성하도록 제안하세요.
- `docs/adr/`과 모든 `src/*/docs/adr/` 디렉토리
- `docs/agents/`: 이 스킬의 이전 출력이 이미 존재하나요?
- `.scratch/`: 로컬 마크다운 이슈 트래커 관례가 이미 사용 중이라는 신호
- `triage` 스킬이 설치되었나요? (이것 옆에 `triage` 스킬 폴더, 또는 사용 가능한 스킬에 `triage`.) 이것은 섹션 B가 전혀 실행되는지 결정합니다.
- Monorepo 신호: `pnpm-workspace.yaml`, `package.json`의 `workspaces` 필드, 또는 자체 `src/`가 있는 채워진 `packages/*`. 이것들은 진정으로 큰 다중 패키지 저장소에만 존재합니다. 그것들의 부재는 단일 컨텍스트를 의미하며, 거의 모든 저장소입니다.

### 2. 발견을 제시하고 묻기

존재하는 것과 누락된 것을 요약하세요. 그런 다음 순서대로 섹션을 취하세요. 하나의 섹션, 하나의 답변, 그런 다음 다음.

사용자가 한 단어로 받아들일 수 있도록 각 섹션을 권장 답변으로 이끄세요. 선택이 진정으로 분기할 때만 한 줄 설명을 주세요. 탐색이 이미 그것을 정착시켰을 때 섹션을 완전히 건너뛰세요(섹션 B는 `triage`가 설치되지 않았을 때, 섹션 C는 monorepo가 없을 때).

**섹션 A: 이슈 트래커.**

> 설명: "이슈 트래커"는 이 저장소의 이슈가 사는 곳입니다. `to-tickets`, `triage`, `to-spec`와 같은 스킬이 그것에서 읽고 그것에 씁니다. 그것들은 `gh issue create`를 호출할지, `.scratch/` 아래에 마크다운 파일을 작성할지, 또는 여러분이 설명하는 다른 워크플로우를 따를지 알아야 합니다. 이 저장소를 위해 실제로 작업을 추적하는 장소를 선택하세요.

기본 자세: 이 스킬들은 GitHub을 위해 설계되었습니다. `git remote`가 GitHub을 가리키면, 그것을 제안하세요. `git remote`가 GitLab(`gitlab.com` 또는 자체 호스팅 호스트)을 가리키면, GitLab을 제안하세요. 그렇지 않으면(또는 사용자가 선호하면), 제안하세요:

- **GitHub**: 이슈가 저장소의 GitHub Issues에 있음 (`gh` CLI 사용)
- **GitLab**: 이슈가 저장소의 GitLab Issues에 있음 ([`glab`](https://gitlab.com/gitlab-org/cli) CLI 사용)
- **Local markdown**: 이슈가 이 저장소의 `.scratch/<feature>/` 아래 파일로 있음 (솔로 프로젝트 또는 원격이 없는 저장소에 좋음)
- **Other** (Jira, Linear 등): 사용자에게 한 문단으로 워크플로우를 설명하도록 요청하세요. 스킬은 그것을 자유 형식 산문으로 기록합니다

선택을 `docs/agents/issue-tracker.md`에 기록하세요. GitHub와 GitLab 템플릿은 "PRs as a request surface" 플래그를 담으며, 기본적으로 **끔**입니다. 끄고 제기하지 마세요: 트리아지 큐에 외부 PR을 원하는 사용자는 나중에 파일에서 플래그를 뒤집을 수 있습니다.

GitHub 또는 GitLab 트래커는 도달 가능한 저장소가 필요합니다. 사용자가 하나를 선택하고 `git remote`가 해당 호스트를 가리키지 않으면, 저장소 URL을 그들에게서 얻고 더 나아가기 전에 연결하세요(`git init` 필요하면, `git remote add origin <url>`). 이 디렉토리 내부에서 `gh repo view` / `glab repo view`가 프로젝트를 인쇄할 때 완료됩니다. 할 수 없으면, 멈추고 사용자에게 무엇이 누락되었는지 말하세요.

**섹션 B: 트리아지 라벨 어휘.** `triage` 스킬이 설치되지 않았으면(탐색이 말했음) 이 섹션을 완전히 건너뛰세요. 설치되지 않은 스킬은 라벨이 필요 없습니다.

설치되었으면, 정확히 한 질문을 물어보세요:

> 기본 트리아지 라벨을 유지하고 싶으신가요? (권장: **yes**)

기본값은 다섯 가지 정규 역할이며, 각 라벨 문자열은 이름과 동일합니다: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. **yes**에서, 그대로 작성하세요. 사용자가 no라고 말할 때만, 보통 그들의 트래커가 이미 다른 이름을 사용하기 때문에(예: `needs-triage`를 위해 `bug:triage`), 재정의를 수집하여 `triage`가 중복을 만드는 대신 기존 라벨을 적용하도록 하세요.

**섹션 C: 도메인 문서.** **단일 컨텍스트**로 기본 설정하세요(저장소 루트에 하나의 `GLOSSARY.md` + `docs/adr/`). 이것은 거의 모든 저장소에 맞습니다. 묻지 않고 작성하세요.

**다중 컨텍스트**(컨텍스트별 `GLOSSARY.md` 파일을 가리키는 루트 `GLOSSARY-MAP.md`)는 탐색이 monorepo 신호를 발견했을 때만 제안하세요. 그런 다음 원하는 레이아웃을 확인하세요.

### 3. 확인 및 편집

사용자에게 초안을 보여주세요:

- 편집되고 있는 `CLAUDE.md` / `AGENTS.md` 중 하나에 추가할 `## Agent skills` 블록 (선택 규칙은 4단계 참조)
- `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, `docs/agents/triage-labels.md`의 내용 (마지막은 `triage`가 설치되었을 때만)

작성하기 전에 편집하도록 하세요.

### 4. 작성

**편집할 파일 선택:**

- `CLAUDE.md`가 존재하면, 편집하세요.
- 아니면 `AGENTS.md`가 존재하면, 편집하세요.
- 둘 다 존재하지 않으면, 사용자에게 어느 것을 만들지 물어보세요. 그들을 위해 선택하지 마세요.

`CLAUDE.md`가 이미 존재할 때 `AGENTS.md`를 절대 만들지 마세요(또는 그 반대). 항상 이미 있는 것을 편집하세요.

선택한 파일에 `## Agent skills` 블록이 이미 존재하면, 중복을 추가하는 대신 그 내용을 제자리에서 업데이트하세요. 주변 섹션에 대한 사용자 편집을 덮어쓰지 마세요.

블록:

```markdown
## Agent skills

### Issue tracker

[이슈가 추적되는 곳의 한 줄 요약]. `docs/agents/issue-tracker.md` 참조.

### Triage labels

[라벨 어휘의 한 줄 요약]. `docs/agents/triage-labels.md` 참조.

### Domain docs

[레이아웃의 한 줄 요약: "single-context" 또는 "multi-context"]. `docs/agents/domain.md` 참조.
```

`### Triage labels` 하위 블록을 포함하고, `docs/agents/triage-labels.md`를 작성하는 것은 `triage`가 설치되고 섹션 B가 실행되었을 때만입니다. 그렇지 않으면, 둘 다 생략됩니다.

섹션 B가 GitHub 또는 GitLab에서 실행되었을 때, 트래커가 부족한 각 구성된 라벨을 생성하세요(`gh label create` / `glab label create`).

그런 다음 이 스킬 폴더의 시드 템플릿을 시작점으로 사용하여 문서 파일을 작성하세요:

- [issue-tracker-github.md](./issue-tracker-github.md): GitHub 이슈 트래커
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md): GitLab 이슈 트래커
- [issue-tracker-local.md](./issue-tracker-local.md): 로컬 마크다운 이슈 트래커
- [triage-labels.md](./triage-labels.md): 라벨 매핑 (`triage`가 설치된 경우만)
- [domain.md](./domain.md): 도메인 문서 소비자 규칙 + 레이아웃

"other" 이슈 트래커의 경우, 사용자의 설명을 사용하여 처음부터 `docs/agents/issue-tracker.md`를 작성하세요.

### 5. 완료

사용자에게 설정이 완료되었고 어떤 엔지니어링 스킬이 이제 이 파일들에서 읽을지 말하세요. 나중에 `docs/agents/*.md`를 직접 편집할 수 있다고 언급하세요. 이 스킬을 다시 실행하는 것은 이슈 트래커를 전환하거나 처음부터 재시작하고 싶을 때만 필요합니다.
