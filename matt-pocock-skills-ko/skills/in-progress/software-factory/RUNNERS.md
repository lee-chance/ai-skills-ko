# 러너

> 2026-10에 조사했으며, 최신 상태를 보장하지 않습니다. 방향을 잡는 데 사용한 다음, 현재 선택지를 직접 조사하세요. 제품, 가격, 한도, 베타는 빠르게 바뀝니다.

러너는 **일회용**입니다. 모든 런은 새 머신에서 시작하고 아무것도 남기지 않습니다. 다섯 유형이 슬롯을 채웁니다. 차이는 대체로 누가 에이전트 루프를 소유하고 누가 머신을 소유하는지입니다.

| 유형 | 에이전트 루프 | 머신 | 함께 채우는 슬롯 |
| --- | --- | --- | --- |
| CI 러너 | 여러분 것, CI 잡 안 | CI 벤더의 것, 또는 여러분 것 | 오케스트레이터, 옵저버빌리티 플랫폼 |
| MicroVM API | 여러분 것, 오케스트레이터 또는 러너 위 | 제공자의 것 | 없음 |
| 번들 에이전트 플랫폼 | 벤더의 것 | 벤더의 것 | 오케스트레이터의 일부, 옵저버빌리티 플랫폼 |
| 직접 가져오는 워커 | 벤더의 것 | 여러분 것 | 오케스트레이터의 일부, 옵저버빌리티 플랫폼 |
| 자체 VPS 또는 컨테이너 | 여러분 것 | 여러분 것 | 없음 |

러너 선택은 런마다입니다. 리뷰 런에는 싼 CI 러너, 구현 런에는 MicroVM. 이것이 평범한 설계입니다.

## CI 러너

CI 잡마다 새 VM 또는 파드. Git 호스트 자신의 워크플로우 엔진이 시작합니다. 에이전트 CLI는 잡 안의 한 단계입니다. 오케스트레이터는 워크플로우 트리거(이슈, PR, 스케줄, 수동 디스패치)로 런을 시작하고, 동시성 그룹이 같은 티켓에서 두 런을 막습니다. 호스팅된 러너는 구조상 일회용입니다. 셀프 호스트 러너는 ephemeral 모드, 잡당 파드 하나, 이후 삭제로 거기 도달합니다. 비용은 분당입니다.

**이럴 때 고르세요.** Git 호스트가 GitHub 또는 GitLab이고 모든 트리거가 Git 호스트 이벤트 또는 시계일 때. 워크플로우 파일이 오케스트레이터이고 런 페이지가 옵저버빌리티 플랫폼이므로, 제품 하나가 세 슬롯을 채웁니다.

시작점:
- [GitHub Actions](https://docs.github.com/en/actions/reference/limits): 전부 GitHub인 팩토리의 기본값. [가격](https://docs.github.com/en/billing/reference/actions-runner-pricing).
- [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions): 워크플로우 단계로서의 Claude Code.
- [GitLab 호스팅 러너](https://docs.gitlab.com/ci/runners/hosted_runners/linux/): 잡당 일시 VM.
- [Actions Runner Controller](https://docs.github.com/en/actions/concepts/runners/actions-runner-controller): 셀프 호스트. 사용자 Kubernetes에서 잡당 ephemeral 파드 하나.

## MicroVM API

SDK 호출이 약 1초 안에 격리된 MicroVM(벤더는 "샌드박스"라고 함)을 만듭니다. 오케스트레이터가 그 안으로 명령을 실행하거나, 그 안에서 에이전트 CLI를 시작합니다. 비용은 vCPU와 RAM의 초당입니다. 오케스트레이터는 런마다 하나를 만들고, 끝에서 죽이고, 타임아웃을 최후의 안전장치로 둡니다. 제공자는 지속성(일시정지/재개, 스냅샷, 드라이브)도 팝니다. 팩토리는 그것을 캐시로 쓰고, 런 사이의 기억은 티켓 트래커, Git 호스트, 오케스트레이터에 둡니다.

**이럴 때 고르세요.** 팩토리에 자체 오케스트레이터(서버, 큐)가 있고, 관리할 머신 없이 짧고 병렬인 런을 많이 원할 때. 최대 런 길이, 동시성 상한, 모델 대기 시간이 과금되는지를 비교하세요. 2026-10 기준, Vercel은 활성 CPU만 과금하므로 거기서는 모델 대기 시간이 거의 공짜입니다.

시작점: [E2B](https://e2b.dev/pricing), [Daytona](https://www.daytona.io/pricing), [Modal Sandboxes](https://modal.com/docs/guide/sandboxes), [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox/pricing).

## 번들 에이전트 플랫폼

러너가 포함된 호스팅 코딩 에이전트입니다. 벤더가 런마다 새 VM 또는 컨테이너를 준비하고, 거기서 자기 에이전트 루프를 돌리고, 브랜치나 PR을 푸시합니다. 브랜치만 살아남습니다. 런은 Git 호스트나 티켓 트래커의 @멘션 또는 할당, 채팅 메시지, 스케줄, 또는 HTTP 호출에서 시작합니다. 그래서 플랫폼이 오케스트레이터의 많은 부분을 채우고, 트랜스크립트 뷰가 옵저버빌리티 플랫폼을 채웁니다. 비용은 시트나 구독에 접히거나, 런당으로 청구됩니다.

**이럴 때 고르세요.** 사용자가 움직이는 부분을 가장 적게 원하고, 그 벤더의 에이전트로 만족할 때. 트리거가 사용자의 티켓 트래커를 덮는지 확인하세요.

시작점:
- [Claude Code cloud](https://code.claude.com/docs/en/claude-code-on-the-web). cron, API, GitHub 이벤트 트리거를 위한 [예약된 작업](https://code.claude.com/docs/en/routines).
- [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview): API 우선. 환경에 대해 런을 만들고 이벤트를 스트림합니다.
- [Codex cloud](https://developers.openai.com/codex/cloud): 작업당 컨테이너.
- [Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent): 이슈를 Copilot에 할당합니다. 그 러너는 GitHub Actions 러너입니다.

## 직접 가져오는 워커

번들 플랫폼이 에이전트 루프와 런 큐는 유지하고, 도구 호출은 사용자가 호스트하는 워커에서 실행됩니다. 워커는 벤더로 아웃바운드 폴링을 하고, 런을 가져가고, 실행하고, 종료합니다. 셀프 호스트 CI 러너와 같은 형태입니다. 일회용은 사용자의 일입니다. Kubernetes나 MicroVM API 아래에서 워커를 돌려 각 런이 새 디스크를 받게 하세요. 비용은 벤더의 시트 또는 사용량에 사용자 머신을 더한 것입니다.

**이럴 때 고르세요.** 사용자가 번들 에이전트를 원하지만, 런이 사설 네트워크에 닿아야 하거나, 데이터를 사용자 머신에 두어야 하거나, 맞춤 하드웨어를 써야 할 때.

시작점: [Claude Code 셀프 호스트 환경](https://code.claude.com/docs/en/self-hosted-environments), [Cursor 셀프 호스트 풀](https://cursor.com/docs/cloud-agent/self-hosted-pool), [ARC 위의 Copilot coding agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment).

## 자체 VPS 또는 컨테이너

사용자가 빌리거나 돌리는 머신. 런마다 새 컨테이너(또는 머신). 머신은 몇 달을 살 수 있고, 컨테이너는 런 하나 동안 삽니다. 최대 런 길이는 오케스트레이터가 정하는 마감입니다. 일회용은 `docker run --rm`, `ttlSecondsAfterFinished: 0`인 Kubernetes Job, 또는 끝에서 파괴되는 머신에서 옵니다. 모든 캐시는 다음 런이 선택 사항으로 취급하는 경로에 있습니다. 비용은 월 정액이거나, 도는 동안 초당입니다.

**이럴 때 고르세요.** 런이 길거나, 꾸준하거나, 무겁거나, 시간당 비용이 지배하거나, 서버가 이미 오케스트레이터를 호스트할 때.

시작점: [Fly Machines](https://docs.fly.io/machines/overview) ([가격](https://docs.fly.io/about/pricing)), [Hetzner Cloud](https://www.hetzner.com/cloud/)와 Docker, [Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/).

## 더 조사하기

### 슬롯을 결정하는 질문

팩토리의 런을 손에 들고, 각 후보를 이것에 대조하세요.

1. **오케스트레이터는 하나를 어떻게 시작하나요?** 워크플로우 트리거, SDK 호출, @멘션, HTTP 호출, 또는 워커가 가져가는 벤더 큐. 그것이 설계가 이미 이름 붙인 오케스트레이터에 맞나요?
2. **최대 런 길이와 동시성 상한은 무엇인가요?** 플랜 티어별로 기본 타임아웃과 천장, 그리고 상한에 닿으면 무슨 일이 일어나는지 찾으세요. 설계에서 가장 긴 런과 가장 바쁜 폭주에 대조하세요.
3. **비용 형태는 무엇인가요?** 분당, vCPU와 RAM의 초당, 활성 CPU만, 런당, 시트당, 또는 월 정액. 모델을 기다리는 시간이 과금되나요? 모델 토큰은 가격 안인가요, 그 위인가요?
4. **일회용은 어떻게 달성되나요?** 기본으로 새로움, ephemeral 플래그, 또는 오케스트레이터 자신의 정리. 어떤 지속성 기능이 있고, 설계가 그것들을 캐시로만 둘 수 있나요?
5. **런은 무엇에 닿을 수 있나요?** 사설 네트워크 접근, 아웃바운드 방화벽 또는 허용 목록, 시크릿이 러너에 도달하는 방법, 그리고 누가 또 그것들을 읽을 수 있는지.
6. **다른 어떤 슬롯을 채우나요?** 그것이 읽는 트리거를 오케스트레이터 커버리지로, 런 페이지나 트랜스크립트를 옵저버빌리티 플랫폼 커버리지로 세세요.

### 답이 있는 곳

- 랜딩 페이지보다 벤더의 **한도 또는 할당량 페이지**와 **가격 페이지**.
- 생성 호출의 **SDK 또는 API 레퍼런스**: 타임아웃, 수명 주기, 네트워크 매개변수.
- 방화벽, 허용 목록, 시크릿 처리를 위한 **보안 또는 네트워킹 문서**.
- 베타, preview, GA 상태와 플랜 게이팅(Team, Enterprise)을 위한 **체인지로그 또는 릴리스 노트**.
- CI 러너라면 Git 호스트의 **과금 문서**.

### 가장 빨리 낡는 것

- **가격과 무료 허용량.** 2026-10 기준, GitHub는 셀프 호스트 러너에 분당 요금을 발표했다가 연기했습니다.
- **베타, preview, 얼리 액세스 상태**, 그리고 어떤 플랜이 기능을 여는지. 2026-10 기준, Claude Managed Agents와 Claude Code 셀프 호스트 환경은 둘 다 베타였습니다.
- 티어별 **기본 타임아웃과 최대 런 길이**.
- 번들 플랫폼의 **트리거 통합**: 어떤 티켓 트래커와 채팅 도구가 런을 시작하는지.
- **시작 시간**. 벤더의 주장입니다. 중요하면 측정하세요.

위의 유형 특성(누가 루프를 소유하는지, 누가 머신을 소유하는지, 어떤 슬롯을 채우는지)은 천천히 바뀝니다. 여기의 어떤 숫자보다 그것을 신뢰하세요.
