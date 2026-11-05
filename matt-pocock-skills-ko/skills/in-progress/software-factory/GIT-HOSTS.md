# Git 호스트

> 2026-10에 조사했으며, 최신 상태를 보장하지 않습니다. 방향을 잡는 데 사용한 다음, 현재 선택지를 직접 조사하세요. 제품, 가격, 한도, 베타는 빠르게 바뀝니다.

## 유형

### 올인원 플랫폼

티켓 트래커, 오케스트레이터 역할을 하는 CI 시스템, 호스팅된 러너가 묶인 Git 호스트입니다. 하나의 이벤트 스트림과 하나의 권한 모델을 공유합니다. 제품 하나가 Git 호스트, 티켓 트래커, 오케스트레이터, 러너를 채우고, CI 런 페이지가 옵저버빌리티 플랫폼까지 덮는 경우가 많습니다. 모든 PR, 리뷰, 라벨, 체크 이벤트가 웹훅이면서 네이티브 트리거이므로, 이 유형의 트리거 목록이 가장 풍부합니다.

**이럴 때 고르세요.** 팩토리가 작게 시작하거나, 코드가 이미 거기 있거나, 사용자가 청구서 하나와 로그인 하나를 원할 때. 이것이 [SKILL.md](SKILL.md)의 "전부 GitHub" 설계입니다. 벤더도 자체 에이전트를 내놓는데, 사용자의 런과 경쟁하거나 그 런 중 하나로 끼어듭니다.

- [GitHub](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api): 기본값. Issues, Actions, Apps, 그리고 가장 큰 통합 생태계.
- [GitLab](https://about.gitlab.com/pricing/): 이슈, 병합 요청, CI/CD, 러너가 한 제품에 있습니다. SaaS 또는 셀프 매니지드.

### 스위트 Git 호스트

더 넓은 스위트의 한 모듈로 팔리는 Git 호스트입니다. 티켓 트래커는 링크와 웹훅으로 이어진 형제 제품(Jira, Azure Boards)입니다. 트래커 이벤트는 두 번째 스트림으로 도착하므로, 오케스트레이터가 두 이벤트 소스를 이어 붙입니다.

**이럴 때 고르세요.** 조직이 이미 그 스위트를 운영하고 사람들이 Jira나 Azure Boards에 있을 때. 팩토리는 그 트래커를 사람 인터페이스로 물려받습니다.

- [Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/api-request-limits/): Atlassian의 Git 호스트. Jira 및 Bitbucket Pipelines와 짝입니다.
- [Azure DevOps (Azure Repos)](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits): Repos, Boards, Pipelines, Entra 신원이 한 조직에 있어 네 슬롯을 모두 채웁니다.
- [AWS CodeCommit](https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/): IAM 신원이 있는 최소 Git 호스트. 외부 트래커와 CI와 짝을 이루세요.

### 셀프 호스트 Git 호스트

사용자가 자기 인프라에서 돌리는 Git 호스트이며, 종종 같은 네트워크의 오케스트레이터와 러너 옆에 있습니다. 운영자가 요청 한도를 정하므로, 천장은 하드웨어입니다. 그것이 채우는 모든 슬롯의 업그레이드, 백업, 가동 시간을 사용자가 소유합니다.

**이럴 때 고르세요.** 코드가 온프레미스이거나 에어갭이어야 할 때, 사용자가 시트당 비용 0을 원할 때, 또는 SaaS API 예산이 바쁜 팩토리를 조일 때. Forgejo와 Gitea는 작은 팀에 맞고 이슈와 GitHub Actions 호환 CI를 묶습니다. GitLab 셀프 매니지드와 GitHub Enterprise Server는 조직에 맞고 Apps와 서비스 계정을 유지합니다.

- [Forgejo](https://forgejo.org/2026-10-release-v17-0/): 커뮤니티가 운영하고, 가볍고, Forgejo Actions가 있습니다.
- [Gitea](https://about.gitea.com/): Gitea Actions가 있는 경량. 매니지드로도 팝니다.
- [GitLab 셀프 매니지드](https://about.gitlab.com/install/)와 [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@latest): 사용자 자신의 인프라 위의 전체 플랫폼.

### 리뷰 우선, 분산형 Git 호스트

리뷰 모델이 브랜치와 PR 형태에서 벗어난 Git 호스트입니다. 투표된 라벨이 있는 커밋별 패치셋, 또는 사용자가 돌리는 노드에 걸쳐 연합된 저장소. 대부분의 팩토리 도구는 PR을 가정하므로, 연결 코드를 더 많이 직접 만들 각오를 하세요. Gerrit에서는 자동 체크 런이 봇 계정에서 `Verified`에 투표하고, 사람이 `Code-Review`에 투표합니다.

**이럴 때 고르세요.** 사용자 팀이 이미 이렇게 리뷰하거나, 생태계보다 연합을 중시할 때.

- [Gerrit](https://www.gerritcodereview.com/): 라벨 투표가 있는 패치셋 리뷰. Android와 Chromium 모델.
- [Tangled](https://blog.tangled.org/ci/): AT Protocol 위의 Git 호스팅. 스택된 PR과 자체 CI 러너.

### 에이전트 네이티브 Git 호스트

에이전트를 주된 작성자로 두고 만든 새 Git 호스트입니다. 높은 커밋 처리량, 클론 대신 서버 측 읽기, 에이전트별 귀속. 유형 전체가 이릅니다 (2026-10 기준). 게이트와 요청 한도가 공개되지 않았을 수 있으니 벤더에게 묻으세요.

**이럴 때 고르세요.** 팩토리가 하나의 큰 저장소에 대해 많은 동시 런을 돌리고, 클론 시간이나 API 한도가 지배할 때. 단일 저장소의 미러에서 하나를 시험하고, GitHub를 폴백으로 유지하세요.

- [Cursor Origin](https://cursor.com/origin): Graphite 팀에서. GitHub 동기화, 그리고 PR, 리뷰, 푸시에 대한 서명된 웹훅.
- [GitLab next-gen SCM](https://about.gitlab.com/blog/gitlab-next-gen-scm/): 클론 없는 에이전트 API로 다시 만든 GitLab 백엔드.

### 런을 위한 Git 스토리지

수천 개씩 만들어지는 헤드리스, API 우선 Git 저장소입니다. 브랜치, 커밋, diff가 있고 PR, 리뷰, 게이트는 없습니다. 슬롯의 절반을 채우며, 런마다 발급되는 짧은 수명의 저장소별 토큰이 있습니다.

**이럴 때 고르세요.** 런에 싼 런별 임시 저장소나 포크(티켓당 포크, 에이전트의 작업 상태)가 필요하고, PR은 여전히 위 유형의 전체 Git 호스트에 착지할 때.

- [Cloudflare Artifacts](https://www.cloudflare.com/product/artifacts/): Workers 위의 Git 호환 스토리지. 작업마다 베이스라인을 포크합니다.
- [Pierre code.storage](https://code.storage/docs): 일시적 브랜치가 있는 화이트라벨 Git API.

## 더 조사하기

각 후보를 이 질문에 대조하세요.

1. **트리거**: 어떤 이벤트(PR 열림, 푸시, 리뷰 제출, 라벨 추가, 체크 완료)가 웹훅으로 오케스트레이터에 도달하며, 전달은 서명되나요?
2. **신원**: 런이 전용 봇 또는 앱 신원으로 행동할 수 있나요? 그래야 런을 귀속할 수 있고, 자동 리뷰 런이 다른 신원이 작성한 PR을 승인할 수 있으며, 런 자신의 푸시가 다음 런을 트리거하는지가 결정됩니다.
3. **게이트**: 필수 체크, 필수 승인, 브랜치 보호가 사용자의 플랜과 저장소 공개 범위에서 가능한가요? 봇이 우회 목록에 있을 수 있나요?
4. **요청 한도**: 모든 러너의 모든 런이 공유하는 API 예산은 무엇이며, 어떤 단위(설치, 토큰, 사용자, 워크스페이스)당이고, 어떻게 확장되나요?
5. **채우는 슬롯**: 같은 제품이 티켓 트래커, 오케스트레이터, 러너, 옵저버빌리티 플랫폼 중 무엇을 덮나요?

답은 주요 소스에서 찾으세요. REST API와 웹훅 레퍼런스, 레이트 리밋 페이지, 가격과 플랜 비교 페이지, 액세스 토큰 또는 앱 문서, 체인지로그 또는 릴리스 노트.

가장 빨리 낡는 것: 베타와 preview 상태(에이전트 네이티브와 Git 스토리지 유형 전체), 레이트 리밋 숫자, 어떤 플랜이 게이트를 여는지, 인수와 종료와 재개 이후의 가용성. 예를 들어 2026-10 기준, AWS CodeCommit은 신규 고객에게 다시 열렸고 Bitbucket Data Center는 Cloud와 함께하는 하이브리드 라이선스로만 팔렸습니다.

## 오래 남는 함정

설계가 그것에 기대기 전에 각각이 아직 맞는지 확인하세요.

- **GitHub `GITHUB_TOKEN`은 체인을 끝냅니다.** 내장 Actions 토큰이 일으킨 이벤트는 새 워크플로우 런을 시작하지 않습니다 (`workflow_dispatch`와 `repository_dispatch`는 예외). 그래서 그 토큰으로 푸시하는 런은 다음 런을 조용히 멈춥니다. 첫날부터 런에 GitHub App 신원을 주세요.
- **게이트는 종종 유료 플랜 뒤에 있습니다.** 2026-10 기준, 비공개 저장소의 GitHub ruleset은 Pro, Team 또는 Enterprise가 필요하고, GitLab 승인 규칙은 Premium이 필요하며, 강제되는 Bitbucket 병합 체크는 Premium이 필요합니다.
- **요청 한도는 신원마다이며, 봇의 유형이 한도를 바꿉니다.** 2026-10 기준, GitHub App 설치는 `GITHUB_TOKEN`의 1,000에 대해 시간당 5,000 요청을 받습니다. Bitbucket 사용자 토큰은 기본 레이트에 머물고 액세스 토큰은 확장됩니다. Azure DevOps는 액세스 수준에 따라 봇의 예산을 올립니다.
- **스위트 트래커는 이벤트 스트림이 둘이라는 뜻입니다.** 오케스트레이터가 Git 호스트와 티켓 트래커 이벤트를 스스로 이어 붙입니다.
