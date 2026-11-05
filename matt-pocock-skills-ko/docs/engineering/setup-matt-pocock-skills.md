## 무엇을 하는지

`setup-matt-pocock-skills`는 하나의 리포에 대한 세 가지 질문에 답합니다: 이슈가 어디에 있는지, triage 레이블이 무엇이라고 불리는지, 그리고 도메인 문서가 어디에 있는지. 답변을 `docs/agents/` 아래에 마크다운 파일로 기록합니다.

해당 파일이 리포 간에 다른 유일한 것입니다. 스킬 자체는 어디서나 동일합니다. 실행 시 `docs/agents/issue-tracker.md`를 읽고 그것이 말하는 대로 수행합니다. 이것이 세트가 GitHub에 묶여 있지 않은 이유이며, 다른 트래커를 가리키도록 스킬 파일을 편집하지 않는 이유입니다. "스킬을 커스텀 이슈 트래커에 연결"하여 호출하면 스킬에 변경 없이 프로그래밍 방식으로 연결할 수 있는 모든 것과 작동합니다.

결정론적 스크립트가 아니라 프롬프트 기반 스킬입니다. `git remote`, `CLAUDE.md` 및 `GLOSSARY.md`를 읽고, 찾은 것을 제안하고, 무엇이든 쓰기 전에 확인을 기다립니다.

## 언제 사용하는지

`/setup-matt-pocock-skills`를 입력하여 호출합니다; [에이전트](https://www.aihero.dev/ai-coding-dictionary/agent)가 스스로 이것을 선택하지는 않습니다. 메타데이터가 의도적으로 호출 불가능으로 표시되어 있으므로 다른 스킬이 당신을 위해 실행할 수 없습니다.

다른 엔지니어링 스킬을 처음 사용하기 전에 리포당 한 번 사용하세요. [triage](https://aihero.dev/skills-triage), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets) 또는 [wayfinder](https://aihero.dev/skills-wayfinder)가 이슈가 어디로 가는지 추측하기 시작하거나 트래커에 없는 레이블을 적용하면 이 리포는 아직 설정되지 않은 것입니다. 프로젝트 중간에 리포에서 실행할 수 있습니다. 스킬은 이미 있는 것을 읽으므로 이전 작업이 손실되지 않습니다.

## 전제 조건

실행하는 리포에 씁니다:

| 작성하는 것 | 어디 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`, `triage` 스킬이 설치된 경우에만 |
| `## Agent skills` 블록 | 이미 존재하는 `CLAUDE.md` 또는 `AGENTS.md` 중 하나 |

모두 마크다운으로 커밋합니다. 사용자 레벨 또는 글로벌 모드는 없습니다. 구성은 리포에 있으므로 모든 리포가 자체 사본을 받습니다.

## 세 가지 결정

각 섹션을 권장 답변으로 시작하며, 탐색이 이미 답한 질문은 건너뜁니다. 대부분의 실행은 두 번의 확인만 필요합니다.

| 결정 | 제안하는 것 | 언제 묻는지 |
| --- | --- | --- |
| **Issue tracker** | `git remote`와 일치하는 것 | 항상, 이것이 유일한 실제 선택이기 때문 |
| **Triage labels** | 다섯 개의 표준 이름 유지 (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) | `triage` 스킬이 설치된 경우에만 |
| **Domain docs** | single-context: 루트의 하나의 `GLOSSARY.md`와 `docs/adr/` | 모노리포 신호를 발견한 경우에만, 그런 다음 multi-context `GLOSSARY-MAP.md` 제공 |

트래커 옵션:

| 옵션 | 이슈가 사는 곳 | 필요 |
| --- | --- | --- |
| **GitHub** | 리포의 GitHub Issues | `gh` CLI |
| **GitLab** | 리포의 GitLab Issues | `glab` CLI |
| **Local markdown** | 이 리포의 `.scratch/<feature>/` 아래 파일 | 아무것도, 심지어 remote도 아님 |
| **Other** | 당신이 말하는 곳 | 워크플로우를 설명하는 한 단락 |

처음 세 개는 스킬에 템플릿으로 제공되며 즉시 작동합니다. Local markdown은 폴백이 아니라 전체 옵션입니다. 스킬은 remote 없는 솔로 프로젝트를 지원합니다. 한 가지 주의 사항: GitHub를 사용하면 local markdown을 사용하지 마세요. 대안이므로 하나를 선택하세요.

"Other"도 전체 옵션입니다. Jira, Linear, Azure DevOps 및 Beads가 모두 작동하는 방식입니다. 워크플로우를 설명하면 스킬이 산문을 `docs/agents/issue-tracker.md`에 기록하고 다운스트림 스킬이 산문을 따릅니다. 사용자는 이미 이를 빌드했습니다: Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 변형, `gh`처럼 형성된 Gitea CLI, 손으로 만든 로컬 대시보드.

## 일반적인 질문

**GitHub를 사용해야 하나요?**

아니요. GitHub, GitLab 및 `.scratch/` 아래의 local markdown은 모두 즉시 사용 가능한 템플릿으로 제공되며, 다른 모든 것은 "other" 경로를 통해 작동합니다. 이것이 가장 반복되는 질문이며, 대략 이러한 단어로: *"github에 하드 잠금"*, *"GitLab / Jira를 사용할 수 있나요"*, *"Azure DevOps는 어떤가요"*. 답변은 항상 동일합니다: 스킬이 아니라 setup이 트래커를 선택합니다.

**스킬을 업데이트한 후 다시 실행해야 하나요?**

v1.1 이후 직접적인 답변은 예였습니다. 스킬 자체의 종료 메시지는 더 부드럽습니다. 트래커를 전환하거나 다시 시작할 때만 다시 실행하라고 말합니다. 둘 다 방어 가능합니다. 시드 템플릿은 버전 간에 변경되므로 이전 릴리스의 `docs/agents/issue-tracker.md`는 이제 이를 읽는 스킬에 대해 오래될 수 있습니다. 다운스트림 스킬이 문서가 설명하는 것과 다른 것을 수행하면 setup을 다시 실행하세요. 저렴합니다.

**`CLAUDE.md`에 작성했지만 Codex를 사용하고 있습니다.**

이것은 알려진 간극이며, 여전히 열려 있습니다. 파일 선택 규칙은 "`CLAUDE.md`가 존재하면 편집, 그렇지 않으면 `AGENTS.md`"입니다. 어떤 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)가 실행되고 있는지가 아니라 어떤 파일이 존재하는지 확인합니다. Claude Code에서 남긴 `CLAUDE.md`가 있는 리포에서 스킬은 Codex가 절대 읽지 않는 파일에 `## Agent skills` 블록을 씁니다. 사용자에게 두 가지 해결 방법이 있습니다: 블록을 손으로 `AGENTS.md`로 이동하거나, `AGENTS.md`를 표준으로 유지하고 `CLAUDE.md`를 그것을 가리키는 한 줄 포인터로 만듭니다. 파일이 둘 다 존재하지 않으면 스킬은 하나를 선택하는 대신 어느 것을 생성할지 묻습니다. 이것은 결정하기를 기대한 사람들을 혼란스럽게 했습니다.

**triage 레이블을 생성하지 않았습니다.**

생성하지 않습니다. `docs/agents/triage-labels.md`는 *매핑*입니다: `/triage`에게 트래커의 어떤 문자열이 다섯 가지 표준 역할에 해당하는지 알려줍니다. `gh label create`를 실행하지 않습니다. 새로운 GitHub 리포에서 레이블은 아직 존재하지 않으며, 사용자는 이를 버그로 두 번 이상 제출했습니다. 두 가지 결과:

- 트래커가 이미 표준 이름을 사용하면 매핑은 항등 테이블이며 구성할 것이 없습니다. 이것이 의도된 일반적인 경우이며 누락된 단계가 아닙니다.
- 이 스킬은 [wayfinder](https://aihero.dev/skills-wayfinder)의 `wayfinder:map`과 `wayfinder:<type>` 레이블도 생성하지 않으며, `gh issue create --label <missing>`는 레이블을 생성하는 대신 실패합니다. GitHub 리포에서 첫 번째 wayfinder 실행 전에 손으로 생성하세요.

**여기서 다른 스킬의 동작([grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 케이던스, 질문 형식, 톤)을 구성할 수 있나요?**

아니요. 세 가지를 구성합니다: 트래커, 레이블, 문서 레이아웃. 사용자는 이를 사용자별 기본 설정의 장소로 만들 것을 요청했습니다. 답변은 스킬이 의견이 있고 사용자별 구성을 받지 않는다는 것입니다. 기본 설정은 모든 스킬이 이미 읽는 평범한 지침으로 `CLAUDE.md`에 속합니다.

**구성을 모든 리포에 커밋하는 대신 `~/.claude`에 보관할 수 있나요?**

오늘은 아닙니다. 많은 리포에 걸쳐 스킬을 실행하는 사용자는 이에 대한 열린 요청이 있지만 사용자 레벨 모드는 존재하지 않습니다. 모든 리포는 자체 `docs/agents/`를 포함합니다.

**다른 스킬을 구성하는 스킬이 있는 것이 이상하지 않나요?**

오래된 불만 하나는 예라고 말하며, 이러한 단어로: *"다른 스킬을 설정하는 스킬을 갖는 것은 나에게 올바르게 느껴지지 않습니다: 이는 LLM이 자체 스킬을 구성한다는 것을 의미합니다."* 트레이드오프는 실제입니다. setup 단계 없이 이슈를 건드리는 모든 스킬은 트래커 지침의 자체 사본이 필요할 것입니다. 출력은 읽고 편집할 수 있는 마크다운이며, 이는 위험을 제한합니다. 작성한 모든 파일을 읽고 손으로 변경할 수 있습니다. 다른 실행이 아니라 그렇게 일상적인 변경을 수행하세요.

## 제대로 작동하고 있다면

- `docs/agents/issue-tracker.md`와 `docs/agents/domain.md`가 존재하며, `triage`가 설치된 경우 `triage-labels.md`도 존재합니다.
- harness가 읽는 지침 파일에 각 파일을 가리키는 한 줄 요약과 함께 `## Agent skills` 섹션이 나타납니다.
- 제안한 트래커가 사용하는 remote와 일치하고, 레이블 문자열이 트래커에 존재하는 레이블과 일치합니다.
- 이후 `/to-tickets`는 이슈가 어디에 있는지 묻지 않고 게시하며, `/triage`는 발명하는 대신 레이블을 적용합니다.
- 스킬 파일 자체에서는 아무것도 변경되지 않았습니다. setup이 `SKILL.md`를 편집했다면 무언가 잘못되었습니다.

## 어디에 적합한지

`setup-matt-pocock-skills`는 엔지니어링 흐름의 **한 번 실행 setup**이며, 체인의 단계가 아니라 다른 모든 것이 가정하는 전제 조건입니다. 이웃은 독자입니다: 여기에 작성된 레이블 어휘를 적용하는 [triage](https://aihero.dev/skills-triage); 여기에 명명된 트래커로 게시하는 [to-spec](https://aihero.dev/skills-to-spec)과 [to-tickets](https://aihero.dev/skills-to-tickets); 그리고 맵과 자식 [티켓](https://www.aihero.dev/ai-coding-dictionary/ticket)을 저장하는 방법을 배우기 위해 동일한 트래커 파일의 "Wayfinding operations" 섹션을 읽는 [wayfinder](https://aihero.dev/skills-wayfinder). [domain-modeling](https://aihero.dev/skills-domain-modeling)은 나중에 setup이 기록하는 도메인 문서 레이아웃을 채웁니다. 용어나 결정을 해결할 때만 `GLOSSARY.md`와 ADR을 생성하므로 setup 후 도메인 문서가 없는 리포가 정상입니다. 다음에 어떤 스킬을 사용할지는 [ask-matt](https://aihero.dev/skills-ask-matt)가 전체 세트를 라우팅합니다.
