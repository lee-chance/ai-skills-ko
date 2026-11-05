# Git hosts

> 2026-10에 조사되었으며, 최신 상태가 보장되지 않습니다. 이를 사용하여 방향을 잡은 다음, 현재 옵션을 직접 조사하세요: 제품, 가격, 제한, 베타는 빠르게 변경됩니다.

## 타입

### 올인원 플랫폼

티켓 트래커, orchestrator 역할을 하는 CI 시스템, 호스팅된 러너와 함께 번들로 제공되는 git host로, 모두 하나의 이벤트 스트림과 하나의 권한 모델을 공유합니다. 하나의 제품이 git host, 티켓 트래커, orchestrator, 러너를 채우며, CI 실행 페이지가 observability platform도 종종 커버합니다. 모든 PR, 리뷰, 라벨, 체크 이벤트는 웹훅이자 네이티브 트리거이므로, 이 타입은 가장 풍부한 트리거 카탈로그를 가집니다.

**선택 조건**: 팩토리가 작게 시작하거나, 코드가 이미 그곳에 있거나, 사용자가 하나의 청구서와 하나의 로그인을 원할 때. 이것은 [SKILL.md](SKILL.md)의 "All on GitHub" 설계입니다. 벤더는 사용자의 실행과 경쟁하거나 그 중 하나로 슬롯되는 자체 에이전트도 제공합니다.

- [GitHub](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api): 기본값; Issues, Actions, Apps 및 가장 큰 통합 생태계.
- [GitLab](https://about.gitlab.com/pricing/): 이슈, 머지 리퀘스트, CI/CD 및 러너가 하나의 제품에, SaaS 또는 자체 관리.

### 스위트 git hosts

더 넓은 스위트의 한 모듈로 판매되는 git host로, 티켓 트래커가 링크와 웹훅으로 연결된 형제 제품(Jira, Azure Boards)입니다. 트래커 이벤트는 두 번째 스트림에 도착하므로, orchestrator는 두 이벤트 소스를 연결합니다.

**선택 조건**: 조직이 이미 스위트를 실행하고 있고 그 사람들이 Jira나 Azure Boards에서 살 때. 팩토리는 해당 트래커를 인간 인터페이스로 상속받습니다.

- [Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/api-request-limits/): Atlassian의 git host, Jira 및 Bitbucket Pipelines와 쌍을 이룸.
- [Azure DevOps (Azure Repos)](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits): Repos, Boards, Pipelines 및 Entra 아이덴티티가 하나의 조직에 있어, 네 슬롯을 모두 채움.
- [AWS CodeCommit](https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/): IAM 아이덴티티를 가진 베어 git host; 외부 트래커 및 CI와 쌍을 이루세요.

### 자체 호스팅 git hosts

사용자가 자체 인프라에서 실행하는 git host로, 종종 같은 네트워크의 orchestrator 및 러너 옆에 있습니다. 운영자가 속도 제한을 설정하므로, 상한은 하드웨어입니다. 사용자는 채우는 모든 슬롯에 대한 업그레이드, 백업, 가동 시간을 소유합니다.

**선택 조건**: 코드가 온프레미스나 에어갭 상태로 유지되어야 하거나, 사용자가 좌석당 비용 제로를 원하거나, SaaS API 예산이 바쁜 팩토리를 조절할 때. Forgejo와 Gitea는 소규모 팀에 적합하며 이슈와 GitHub-Actions 호환 CI를 번들로 제공합니다. GitLab 자체 관리 및 GitHub Enterprise Server는 조직에 적합하며 앱과 서비스 계정을 유지합니다.

- [Forgejo](https://forgejo.org/2026-10-release-v17-0/): 커뮤니티 관리, 경량, Forgejo Actions 포함.
- [Gitea](https://about.gitea.com/): Gitea Actions를 가진 경량; 관리형으로도 판매됨.
- [GitLab self-managed](https://about.gitlab.com/install/) 및 [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@latest): 사용자 자체 인프라의 전체 플랫폼.

### 리뷰 우선 및 탈중앙화 git hosts

리뷰 모델이 브랜치-앤-PR 형태에서 벗어난 git hosts: 투표된 라벨이 있는 커밋당 패치셋, 또는 사용자 실행 노드 간에 연합된 저장소. 대부분의 팩토리 도구는 PR을 가정하므로, 더 많은 접착제를 빌드할 것으로 예상하세요. Gerrit에서, 자동화된 체크 실행은 봇 계정에서 `Verified`에 투표하고 사람은 `Code-Review`에 투표합니다.

**선택 조건**: 사용자의 팀이 이미 이런 식으로 리뷰하거나, 생태계보다 연합을 가치 있게 여길 때.

- [Gerrit](https://www.gerritcodereview.com/): 라벨 투표가 있는 패치셋 리뷰; Android 및 Chromium 모델.
- [Tangled](https://blog.tangled.org/ci/): AT Protocol의 git 호스팅, 스택된 PR 및 자체 CI 러너.

### 에이전트 네이티브 git hosts

에이전트를 주요 작성자로 하여 구축된 새로운 git hosts: 높은 커밋 처리량, 클론 대신 서버 측 읽기, 에이전트별 귀속. 전체 타입이 초기(2026-10 기준)이므로, 게이트와 속도 제한이 공개되지 않을 수 있습니다: 벤더에게 문의하세요.

**선택 조건**: 팩토리가 하나의 큰 저장소에 대해 많은 동시 실행을 실행하고 클론 시간이나 API 제한이 지배적일 때. GitHub을 폴백으로 유지하면서 단일 저장소의 미러에서 파일럿을 시도하세요.

- [Cursor Origin](https://cursor.com/origin): Graphite 팀 출신, GitHub 동기화 및 서명된 PR, 리뷰 및 푸시 웹훅.
- [GitLab next-gen SCM](https://about.gitlab.com/blog/gitlab-next-gen-scm/): 클론 없는 에이전트 API로 재구축된 GitLab 백엔드.

### 실행을 위한 Git 스토리지

수천 개로 생성되는 헤드리스, API 우선 git 저장소: 브랜치, 커밋 및 diff, PR, 리뷰 또는 게이트 없음. 실행당 민트되는 단기 저장소별 토큰으로 슬롯의 절반을 채웁니다.

**선택 조건**: 실행이 저렴한 실행당 스크래치 저장소나 포크(티켓당 포크, 에이전트의 작업 상태)가 필요하고 PR은 여전히 위 타입의 전체 git host에 착륙할 때.

- [Cloudflare Artifacts](https://www.cloudflare.com/product/artifacts/): Workers의 git 호환 스토리지; 작업당 베이스라인 포크.
- [Pierre code.storage](https://code.storage/docs): 임시 브랜치가 있는 화이트 라벨 git API.

## 추가 조사

각 후보를 이러한 질문에 대해 확인하세요:

1. **Triggers**: 어떤 이벤트(PR 열림, 푸시, 리뷰 제출, 라벨 추가, 체크 완료)가 웹훅으로 orchestrator에 도달하며, 전달이 서명되는가?
2. **Identity**: 실행이 전용 봇이나 앱 아이덴티티로 행동할 수 있는가? 그것은 실행을 귀속 가능하게 유지하고, 자동화된 리뷰 실행이 다른 아이덴티티가 작성한 PR을 승인하도록 하며, 실행 자체의 푸시가 다음 실행을 트리거하는지 결정합니다.
3. **Gates**: 필수 체크, 필수 승인 및 브랜치 보호가 사용자의 플랜 및 저장소 가시성에서 사용 가능하며, 봇이 우회 목록에 있을 수 있는가?
4. **Rate limits**: 모든 러너의 모든 실행이 공유하는 API 예산은 무엇이며, 어떤 단위(설치, 토큰, 사용자, 워크스페이스)당이며, 어떻게 확장되는가?
5. **Slots filled**: 티켓 트래커, orchestrator, 러너 및 observability platform 중 어떤 것을 같은 제품이 커버하는가?

주요 소스에서 답을 찾으세요: REST API 및 웹훅 참조, 속도 제한 페이지, 가격 및 플랜 비교 페이지, 액세스 토큰 또는 앱 문서, 변경 로그 또는 릴리스 노트.

가장 빨리 구식이 되는 것: 베타 및 프리뷰 상태(전체 에이전트 네이티브 및 git 스토리지 타입), 속도 제한 숫자, 어떤 플랜이 게이트를 잠금 해제하는지, 인수, 종료 및 재개장 후의 가용성. 예를 들어, 2026-10 기준으로 AWS CodeCommit는 새 고객에게 재개장했고 Bitbucket Data Center는 Cloud와의 하이브리드 라이선스로만 판매되었습니다.

## 지속적인 함정

설계가 이에 의존하기 전에 각각이 여전히 유지되는지 확인하세요.

- **GitHub `GITHUB_TOKEN`은 체인을 끝냅니다.** 내장 Actions 토큰으로 인한 이벤트는 새로운 워크플로우 실행을 시작하지 않습니다(`workflow_dispatch` 및 `repository_dispatch` 제외). 따라서 그것으로 푸시하는 실행은 조용히 다음 실행을 중지시킵니다. 첫날부터 실행에 GitHub App 아이덴티티를 부여하세요.
- **Gates는 종종 유료 플랜 뒤에 있습니다.** 2026-10 기준, 개인 저장소의 GitHub 룰셋은 Pro, Team 또는 Enterprise가 필요하고, GitLab 승인 규칙은 Premium이 필요하며, 강제된 Bitbucket 병합 체크는 Premium이 필요합니다.
- **Rate limits는 아이덴티티별이며, 봇의 타입이 이를 변경합니다.** 2026-10 기준, GitHub App 설치는 시간당 5,000 요청을 받는 반면 `GITHUB_TOKEN`은 1,000입니다. Bitbucket 사용자 토큰은 기본 속도에 머물지만 액세스 토큰은 확장됩니다. Azure DevOps는 액세스 레벨에 따라 봇의 예산을 올립니다.
- **스위트 트래커는 두 개의 이벤트 스트림을 의미합니다.** orchestrator는 git host 및 티켓 트래커 이벤트를 자체적으로 연결합니다.
