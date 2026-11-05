# Runners

> 2026-10에 조사되었으며, 최신 상태가 보장되지 않습니다. 이를 사용하여 방향을 잡은 다음, 현재 옵션을 직접 조사하세요: 제품, 가격, 제한, 베타는 빠르게 변경됩니다.

러너는 **일회용**입니다: 모든 실행은 새로운 머신에서 시작하고 아무것도 남기지 않습니다. 다섯 가지 타입이 슬롯을 채웁니다. 주로 누가 에이전트 루프를 소유하고 누가 머신을 소유하는지에 따라 다릅니다:

| Type | Agent loop | Machine | Also fills |
| --- | --- | --- | --- |
| CI runner | 사용자 것, CI 작업 내부 | CI 벤더 것, 또는 사용자 것 | orchestrator, observability platform |
| MicroVM API | 사용자 것, orchestrator 또는 러너에서 | 제공자 것 | 없음 |
| Bundled agent platform | 벤더 것 | 벤더 것 | orchestrator의 일부, observability platform |
| Bring-your-own worker | 벤더 것 | 사용자 것 | orchestrator의 일부, observability platform |
| Own VPS or containers | 사용자 것 | 사용자 것 | 없음 |

러너 선택은 실행별입니다: 리뷰 실행을 위한 저렴한 CI 러너와 implementer 실행을 위한 microVM은 정상적인 설계입니다.

## CI runners

CI 작업당 새로운 VM 또는 pod, git host 자체의 워크플로우 엔진에 의해 시작됩니다. 에이전트 CLI는 작업의 한 단계입니다. orchestrator는 워크플로우 트리거(이슈, PR, 일정, 수동 디스패치)로 실행을 시작하고, 동시성 그룹은 두 실행이 같은 티켓에서 벗어나도록 유지합니다. 호스팅된 러너는 구성상 일회용입니다. 자체 호스팅 러너는 임시 모드, 작업당 하나의 pod, 후에 삭제를 통해 그곳에 도달합니다. 비용은 분당입니다.

**선택 조건**: git host가 GitHub 또는 GitLab이고 모든 트리거가 git host 이벤트 또는 시계일 때: 워크플로우 파일이 orchestrator이고 실행 페이지가 observability platform이므로, 하나의 제품이 세 슬롯을 채웁니다.

시작점:
- [GitHub Actions](https://docs.github.com/en/actions/reference/limits): 올 GitHub 팩토리의 기본값; [pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing).
- [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions): 워크플로우 단계로서의 Claude Code.
- [GitLab hosted runners](https://docs.gitlab.com/ci/runners/hosted_runners/linux/): 작업당 임시 VM.
- [Actions Runner Controller](https://docs.github.com/en/actions/concepts/runners/actions-runner-controller): 자체 호스팅, 사용자의 Kubernetes에서 작업당 하나의 임시 pod.

## MicroVM APIs

SDK 호출이 약 1초 안에 격리된 microVM(벤더는 "샌드박스"라고 함)을 생성합니다. orchestrator는 그 안에서 명령을 실행하거나, 그 안에서 에이전트 CLI를 시작합니다. 비용은 vCPU 및 RAM의 초당입니다. orchestrator는 실행당 하나를 생성하고, 끝에 종료하며, 타임아웃을 백스톱으로 설정합니다. 제공자는 지속성(pause/resume, 스냅샷, 드라이브)도 판매합니다. 팩토리는 이를 캐시로 사용하고, 티켓 트래커, git host, orchestrator에서 실행 간 메모리를 유지합니다.

**선택 조건**: 팩토리가 자체 orchestrator(서버, 큐)를 가지고 있고 관리할 머신 없이 많은 단기, 병렬 실행을 원할 때. 최대 실행 길이, 동시성 상한, 모델을 기다리는 데 소비된 시간이 청구되는지 비교하세요: 2026-10 기준, Vercel은 활성 CPU만 청구하므로, 모델 대기 시간은 거기서 거의 무료입니다.

시작점: [E2B](https://e2b.dev/pricing), [Daytona](https://www.daytona.io/pricing), [Modal Sandboxes](https://modal.com/docs/guide/sandboxes), [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox/pricing).

## Bundled agent platforms

러너가 포함된 호스팅 코딩 에이전트: 벤더가 실행당 새로운 VM 또는 컨테이너를 프로비저닝하고, 자체 에이전트 루프를 그곳에서 실행하며, 브랜치 또는 PR을 푸시합니다. 브랜치만 살아남습니다. 실행은 git host 또는 티켓 트래커의 @-멘션 또는 할당, 채팅 메시지, 일정 또는 HTTP 호출에서 시작하므로, 플랫폼은 orchestrator의 많은 부분을 채웁니다. 트랜스크립트 뷰는 observability platform을 채웁니다. 비용은 좌석 또는 구독으로 통합되거나 실행당 청구됩니다.

**선택 조건**: 사용자가 가장 적은 움직이는 부품을 원하고 해당 벤더의 에이전트에 만족할 때. 트리거가 사용자의 티켓 트래커를 커버하는지 확인하세요.

시작점:
- [Claude Code cloud](https://code.claude.com/docs/en/claude-code-on-the-web), cron, API 및 GitHub 이벤트 트리거를 위한 [scheduled tasks](https://code.claude.com/docs/en/routines).
- [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview): API 우선; 환경에 대해 실행을 생성하고 이벤트를 스트리밍.
- [Codex cloud](https://developers.openai.com/codex/cloud): 작업당 컨테이너.
- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent): Copilot에게 이슈를 할당; 러너는 GitHub Actions 러너.

## Bring-your-own worker

번들된 플랫폼은 에이전트 루프와 실행 큐를 유지하지만, 도구 호출은 사용자가 호스팅하는 워커에서 실행됩니다. 워커는 벤더 아웃바운드를 폴링하고, 실행을 클레임하고, 실행하고, 종료합니다: 자체 호스팅 CI 러너와 같은 형태. 일회용성은 사용자의 작업입니다: Kubernetes 또는 microVM API 아래에서 워커를 실행하여 각 실행이 새로운 디스크를 얻도록 하세요. 비용은 벤더의 좌석 또는 사용량에 사용자의 머신을 더한 것입니다.

**선택 조건**: 사용자가 번들된 에이전트를 원하지만 실행이 개인 네트워크에 도달하거나, 사용자의 머신에 데이터를 유지하거나, 사용자 정의 하드웨어를 사용해야 할 때.

시작점: [Claude Code self-hosted environments](https://code.claude.com/docs/en/self-hosted-environments), [Cursor self-hosted pool](https://cursor.com/docs/cloud-agent/self-hosted-pool), [Copilot coding agent on ARC](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment).

## Own VPS or containers

사용자가 임대하거나 실행하는 머신으로, 실행당 새로운 컨테이너(또는 머신): 머신은 몇 달 동안 살 수 있지만, 컨테이너는 한 실행 동안 삽니다. 최대 실행 길이는 orchestrator가 설정하는 데드라인입니다. 일회용성은 `docker run --rm`, `ttlSecondsAfterFinished: 0`을 가진 Kubernetes Job, 또는 끝에 파괴된 머신에서 나옵니다. 모든 캐시는 다음 실행이 선택 사항으로 취급하는 경로에 있습니다. 비용은 월별 플랫 또는 실행 중인 초당입니다.

**선택 조건**: 실행이 길거나, 꾸준하거나, 무거울 때, 시간당 비용이 지배적이거나, 서버가 이미 orchestrator를 호스팅할 때.

시작점: [Fly Machines](https://docs.fly.io/machines/overview) ([pricing](https://docs.fly.io/about/pricing)), [Hetzner Cloud](https://www.hetzner.com/cloud/) 및 Docker, [Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/).

## 추가 조사

### 슬롯을 결정하는 질문

팩토리의 실행을 손에 들고 각 후보를 이에 대해 확인하세요:

1. **orchestrator가 어떻게 하나를 시작하는가?** 워크플로우 트리거, SDK 호출, @-멘션, HTTP 호출, 또는 워커가 클레임하는 벤더 큐. 이것이 설계가 이미 명명한 orchestrator에 맞는가?
2. **최대 실행 길이와 동시성 상한은 무엇인가?** 플랜 티어당 기본 타임아웃과 상한을 모두 찾고, 상한에서 무슨 일이 일어나는지 찾으세요. 설계의 가장 긴 실행과 가장 바쁜 버스트에 대해 유지하세요.
3. **비용 형태는 무엇인가?** 분당, vCPU 및 RAM의 초당, 활성 CPU만, 실행당, 좌석당 또는 월별 플랫. 모델을 기다리는 시간이 청구되는가? 모델 토큰이 가격 내부에 있는가 아니면 위에 있는가?
4. **일회용성은 어떻게 달성되는가?** 기본적으로 새로운, 임시 플래그, 또는 orchestrator 자체의 해체. 어떤 지속성 기능이 존재하며, 설계가 이를 캐시에 유지할 수 있는가?
5. **실행이 무엇에 도달할 수 있는가?** 개인 네트워크 액세스, 아웃바운드 방화벽 또는 허용 목록, 비밀이 러너에 도달하는 방법, 누가 그것을 읽을 수 있는가.
6. **어떤 다른 슬롯을 채우는가?** 읽는 트리거를 orchestrator 커버리지로, 그 실행 페이지 또는 트랜스크립트를 observability platform 커버리지로 세세요.

### 답이 있는 곳

- 벤더의 **제한 또는 할당량 페이지** 및 **가격 페이지**, 랜딩 페이지보다.
- 생성 호출을 위한 **SDK 또는 API 참조**: 타임아웃, 라이프사이클 및 네트워크 매개변수.
- 방화벽, 허용 목록 및 비밀 처리를 위한 **보안 또는 네트워킹 문서**.
- 베타, 프리뷰 및 GA 상태, 플랜 게이팅(Team, Enterprise)을 위한 **변경 로그 또는 릴리스 노트**.
- CI 러너의 경우, git host의 **청구 문서**.

### 가장 빨리 구식이 되는 것

- **가격 및 무료 허용량.** 2026-10 기준, GitHub는 자체 호스팅 러너에 대한 분당 요금을 발표한 다음 연기했습니다.
- **베타, 프리뷰 및 얼리 액세스 상태**, 어떤 플랜이 기능을 잠금 해제하는지. 2026-10 기준, Claude Managed Agents 및 Claude Code 자체 호스팅 환경은 모두 베타였습니다.
- **티어당 기본 타임아웃 및 최대 실행 길이**.
- 번들된 플랫폼의 **트리거 통합**: 어떤 티켓 트래커 및 채팅 도구가 실행을 시작하는지.
- **시작 시간**, 벤더 주장; 중요하다면 측정하세요.

위의 타입 특성(루프를 소유하는 사람, 머신을 소유하는 사람, 채우는 슬롯)은 천천히 변경됩니다. 여기의 모든 숫자보다 이를 신뢰하세요.
