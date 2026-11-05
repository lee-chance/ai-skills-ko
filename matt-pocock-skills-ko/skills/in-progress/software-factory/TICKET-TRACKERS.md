# Ticket trackers

> 2026-10에 조사되었으며, 최신 상태가 보장되지 않습니다. 이를 사용하여 방향을 잡은 다음, 현재 옵션을 직접 조사하세요: 제품, 가격, 제한, 베타는 빠르게 변경됩니다.

티켓 트래커는 팩토리의 인간 인터페이스입니다. 아래의 각 타입은 시작점입니다: 그것이 무엇이고 팩토리가 언제 선택하는지 읽은 다음, [추가 조사](#추가-조사)의 질문에 대해 예제를 확인하세요.

## 타입

### 1. Git-host tracker

git host에 내장된 트래커로, 티켓, 브랜치 및 PR이 하나의 제품, 하나의 권한 모델 및 하나의 아이덴티티를 공유합니다. 팩토리가 작거나, 팀이 이미 git host에서 살거나, 저장소가 공개일 때 선택합니다. 이것은 "All on GitHub" 설계입니다: git host의 CI가 접착제 없이 orchestrator 슬롯을 채웁니다. 라벨은 신뢰할 수 있는 라우터입니다. 상태가 별도의 보드에 있기 때문입니다. 외부 개발자는 코드가 있는 곳에 제출합니다. 비개발자는 계정이 필요하므로, 피드백 버튼은 API를 통해 제출합니다. 자체 호스팅 git hosts는 트래커를 함께 가져옵니다.

- [GitHub Issues](https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents): 기본값; Copilot, Claude 및 Codex에 대한 assign-to-agent.
- [GitLab Issues](https://about.gitlab.com/blog/how-to-use-a-work-item-created-trigger/): 작업 항목에서 트리거된 Duo Agent Platform 플로우.
- [Forgejo](https://forgejo.org/2026-10-release-v17-0/): 자체 호스팅, Actions 호환.

검증할 것: 어떤 assign-to-agent 기능이 여전히 프리뷰이고 어떤 플랜이 포함하는지; 네이티브 에이전트가 나중 댓글을 읽는지 또는 할당 시 티켓만 읽는지(2026-10 기준, Copilot은 할당 시에만 읽음).

### 2. Agent-native dev tracker

에이전트를 일등 할당자로 취급하는 소프트웨어 팀을 위한 독립 SaaS 트래커로, 에이전트 API 및 자체 코딩 에이전트가 있습니다. 제품, 지원 또는 설계 직원이 작업을 예약하거나, 팀이 이미 그곳에서 살거나, 세련된 분류 및 계획 뷰를 원할 때 팩토리가 선택합니다. "Linear tickets" 설계. 상태 및 워크플로우가 일등이므로, "Ready로 이동됨"은 깨끗한 트리거입니다. 에이전트는 사람이 위임하는 앱 사용자로 나타나며, 실행은 티켓에 진행 상황을 스트리밍할 수 있습니다. 여기의 네이티브 에이전트는 모든 타입 중 가장 깊으므로, 하나가 orchestrator 및 러너 슬롯도 부분적으로 채울 수 있습니다.

- [Linear](https://linear.app/developers/agents): 가장 에이전트 형태의 트래커.
- [Jira](https://support.atlassian.com/jira-software-cloud/docs/collaborate-on-work-items-with-ai-agents/): 상태 트리거 에이전트; 이미 Atlassian에 있는 조직에 맞음.
- [Shortcut](https://www.shortcut.com/help/integrations/using-ai-agents): 스토리를 할당하거나 댓글에서 에이전트를 멘션.
- [YouTrack](https://www.jetbrains.com/youtrack/): 워크플로우-as-code; 자체 호스팅.

검증할 것: 에이전트 API 상태(Linear의 것은 2026-10 기준 개발자 프리뷰였음); 네이티브 에이전트 실행이 어떻게 측정되고 가격이 책정되는지; 에이전트 좌석 비용; 에이전트 웹훅의 확인 데드라인; 어떤 플랜이 고객 대면 양식을 잠금 해제하는지; 자체 호스팅 에디션의 종료일.

### 3. Open-source dev tracker

자체 인프라에서 실행할 수 있는 Linear 스타일 트래커로, 그 옆에 클라우드 에디션이 있습니다. 데이터가 사내에 유지되어야 하거나(에어갭, 규제) 사용자가 여전히 구매하면서 트래커의 소스를 읽고 패치하길 원할 때 팩토리가 선택합니다. 상태, 라벨 및 사용자 정의 속성에 의한 라우팅은 타입 2와 거의 같습니다. 네이티브 에이전트는 더 젊습니다.

- [Plane](https://developers.plane.so/dev-tools/agents/overview): Linear 같은; 앱당 봇 사용자; 에이전트가 댓글에서 답장.
- [Huly](https://github.com/hcengineering/huly-selfhost): GitHub 양방향 동기화가 있는 올인원 워크스페이스; 운영하기에 무거운 스택.
- [OpenProject](https://www.openproject.org/): 성숙한, 클래식 프로젝트 관리.

검증할 것: 에이전트 기능 상태(Plane의 것은 2026-10 기준 베타였음); 어떤 에디션이 게스트 역할 및 접수 양식을 가지는지; 라이선스; 자체 호스팅 스택의 운영 비용.

### 4. General work tool

데이터베이스나 작업 목록이 트래커로 두 배가 되는 작업 관리 또는 문서 도구. 이미 그곳에서 살고 있는 비엔지니어링 팀을 서비스하거나 티켓이 코드보다는 주로 콘텐츠, 운영 또는 연구일 때 팩토리가 선택합니다. 양식이 강점입니다: 링크를 가진 누구나 티켓을 제출합니다. 라우팅은 유연한 데이터베이스 속성이므로, 모든 팩토리는 자체 스키마를 발명합니다. 개발자 컨텍스트(diff, PR)는 git host에서 한 번 클릭 떨어져 있습니다. SaaS 전용.

- [Notion](https://www.notion.com/help/custom-agents): 데이터베이스-as-트래커; 에이전트가 데이터베이스 변경에 발화.
- [Asana](https://asana.com/product/ai/ai-teammates): AI Teammates가 할당된 작업을 받음.
- [ClickUp](https://clickup.com/brain/cloud-agents): Cloud Agents가 작업 스레드에서 PR을 반환.
- [Trello](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/): 보드 및 목록; 웹훅 및 Butler 자동화.

검증할 것: 웹훅 지연 및 세분성(2026-10 기준, Notion은 콘텐츠 업데이트를 일괄 처리하여 1~2분 늦게 도착); 어떤 플랜이 에이전트를 포함하는지.

### 5. Repo-native tracker

저장소의 파일로 저장된 티켓(JSONL, Markdown), 에이전트가 CLI 또는 MCP 서버를 통해 편집하고 코드처럼 병합합니다. 한 개발자가 로컬에서 에이전트를 구동하고 계획을 git에 원하거나, 실제 트래커 옆에 실행의 작업 메모리로 원할 때 팩토리가 선택합니다. git host로의 푸시가 유일한 트리거이므로, orchestrator는 파일을 diff하여 무엇이 변경되었는지 찾습니다. 아이덴티티는 git host의 것입니다. 외부 제출은 커밋 또는 PR로, 모든 타입 중 가장 약하므로, 다른 사람이 티켓을 제출하면 팩토리가 git-host 트래커로 졸업합니다.

- [Beads](https://github.com/steveyegge/beads): 의존성 추적이 있는 JSONL, 실행이 다음 차단 해제된 티켓을 선택.
- [Backlog.md](https://github.com/MrLesk/Backlog.md): Kanban 뷰 및 MCP 서버가 있는 Markdown 작업.

### 6. Build-your-own

팩토리 자체의 앱이 자체 데이터베이스에 티켓을 보유하며, 보통 orchestrator 옆에 있습니다. "Own tracker" 설계. 트래커가 *제품*이거나(내부 플랫폼, 고객 대면 지원 팩토리) 기성 모델이 맞지 않을 때 팩토리가 선택합니다. 트리거는 함수 호출이 됩니다. 아래 질문의 모든 특성이 작성하고 유지 관리할 코드가 되므로, 스킬은 구매를 선호합니다. 웹훅이 있는 [Airtable](https://airtable.com/developers/web/api/webhooks-overview) 베이스는 반쯤 빌드된 중간입니다.

## 추가 조사

이러한 질문에 대해 각 후보를 확인하세요. 슬롯을 결정합니다:

- **Triggers**: 어떤 티켓 변경(생성됨, 라벨됨, 상태 이동됨, 할당됨, 댓글됨, 멘션됨)이 orchestrator가 실행으로 전환할 수 있는 웹훅 또는 이벤트를 방출하는가? 얼마나 빠르고 얼마나 세분화되는가?
- **Routing**: 실행이 그 종류(explore, implement, rework)를 알기 위해 어떤 라벨, 상태 또는 필드를 읽을 수 있는가?
- **Thread**: 사람이 댓글에서 에이전트에 답할 수 있으며, 그 답장이 다음 실행을 트리거하는가?
- **Identity**: API 및 봇 아이덴티티가 있어, 실행이 자신으로 행동하고 사람이 에이전트와 동료를 구분할 수 있는가? 봇이 좌석 비용이 드는가?
- **Native agents**: 티켓이 에이전트에게 직접 할당될 수 있는가? 어떤 에이전트, 어떤 플랜에서, 어떻게 측정되는가? 무엇을 읽는가: 할당 시 티켓, 또는 전체 스레드?
- **Outside filing**: 티켓 소스나 고객이 티켓을 생성하는 방법: 양식, 이메일, 채팅, API? 어떤 플랜이 잠금 해제하는가?
- **Hosting**: SaaS 전용, 또는 자체 호스팅, 어떤 라이선스 아래?

답은 주요 소스에 있습니다: API 및 웹훅 참조(이벤트 목록, 페이로드, 전달 및 재시도 규칙), 에이전트 또는 앱 개발자 문서, 가격 페이지 및 플랜 비교 표, 변경 로그 또는 릴리스 노트. 블로그 게시물 및 비교 사이트보다 이를 선호하세요.

가장 오래된 것 먼저: 에이전트 기능 및 프리뷰 또는 베타 상태, 에이전트 측정 및 크레딧 가격, 에이전트 및 양식의 플랜 게이팅, 속도 제한, 자체 호스팅 에디션의 인수, 종료 및 종료일. 웹훅 이벤트 목록 및 라우팅 모델은 천천히 변경됩니다.

## 지속적인 함정

이에 의존하기 전에 각각이 여전히 유지되는지 확인하세요:

- **GitHub의 `GITHUB_TOKEN` 함정**: 기본 `GITHUB_TOKEN`으로 만들어진 변경은 새로운 워크플로우 실행을 트리거하지 않습니다. 다음 실행을 트리거하기 위해 티켓에 라벨을 붙이거나 댓글을 다는 실행은 GitHub App 토큰을 통해 행동합니다.
- **할당 시간 컨텍스트**: 일부 네이티브 에이전트는 할당될 때만 티켓을 읽으므로, 나중 컨텍스트는 PR에 갑니다.
- **에이전트 웹훅은 빠른 확인을 기대합니다**: orchestrator는 즉시 확인하고 그 후에 실행을 시작합니다.
- **일반 작업 도구의 일괄 웹훅**이 늦게 도착합니다. 신속한 실행이 필요한 팩토리는 속성 변경에 트리거하거나 다른 타입을 선택합니다.
