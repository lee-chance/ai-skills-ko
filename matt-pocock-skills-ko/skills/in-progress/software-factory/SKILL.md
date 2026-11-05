---
name: software-factory
description: "소프트웨어 팩토리를 설계하기 위한 공유 언어: 실행하는 작업과 연결되는 서비스."
disable-model-invocation: true
---

**software factory**는 티켓, PR, 일정을 사용자가 선택한 원격 인프라에 배포된 병합된 코드로 전환하는 에이전트 시스템입니다. 이 스킬은 이를 설계하기 위한 언어입니다. 팩토리를 논의하거나 화이트보딩할 때 이러한 용어만 사용하세요. 사용자가 _Avoid_ 아래의 단어를 사용하려 하면, 표준 용어를 명명하세요.

## 작업과 실행

**Task**:
팩토리가 수행하는 작업의 종류로, 한 번 정의되고 여러 번 실행됩니다: review, explore, implement, ratchet. 작업은 티켓, PR 또는 코드베이스 전체에 대해 작업할 수 있습니다.
_Avoid_: job, workflow, action

**Trigger**:
실행을 시작하는 이벤트: 티켓 트래커나 git host의 변경, orchestrator의 시계, 또는 다른 실행.

**Run**:
하나의 러너에서 하나의 작업이 트리거부터 완료까지 실행되는 것으로, 블랙박스로 취급됩니다. 실행은 orchestrator의 로직을 통해 직접적으로, 또는 티켓 트래커나 git host를 변경하여 추가 실행을 트리거합니다. 실행은 결코 사람을 기다리지 않습니다: 끝나고, 나중에 사람이 티켓 트래커나 git host를 변경하면 새 실행이 트리거됩니다.
_Avoid_: session

**Runner**:
실행이 실행되는 일회용 머신. 머신 자체가 오래 지속되더라도 실행 후 남는 것은 없습니다: 실행이 이전 실행에 대해 가진 유일한 기억은 티켓 트래커, git host, orchestrator입니다.
_Avoid_: server, host, box, compute, sandbox

## 서비스

**Ticket tracker**:
티켓이 존재하는 곳이자 팩토리의 인간 인터페이스: 사람들은 티켓을 제출하여 작업을 예약하고, 댓글에서 에이전트와 대화하며, 티켓에 대한 변경이 실행을 트리거합니다.
_Avoid_: issue tracker, ticket manager, project board

**Ticket source**:
팩토리 외부에서 티켓 트래커에 티켓을 생성하는 모든 것: 피드백 버튼, 모니터, 에러 트래커, 받은편지함.
_Avoid_: data source, trigger source, intake

**Git host**:
브랜치, PR, 리뷰가 존재하는 곳.
_Avoid_: code host, forge, repo

**Orchestrator**:
트리거를 받고, 러너에서 실행을 시작하고, 대기 중이거나, 진행 중이거나, 완료된 실행을 기록하는 컴포넌트.
_Avoid_: dispatcher, scheduler, control plane

**Observability platform**:
러너가 로그, 트레이스, 상태를 보내서, 사람이 각 실행 내부에서 무슨 일이 일어났는지 볼 수 있는 곳. 선택사항: 러너나 orchestrator 슬롯을 채우는 제품이 자체적으로 충분히 보여주는 경우가 많습니다. 실행은 티켓 트래커나 git host에 무언가 쓰여질 때까지 그것에 대해 결정하지 않습니다.
_Avoid_: observability, logs, monitoring, dashboard

## 팩토리 설계

설계는 두 부분으로 나뉩니다: 각각 제품으로 채워진 슬롯인 **서비스**와, 실행이 작업을 이동시키는 **작업**.

팩토리가 아니라 사용자의 문제에서 시작하세요: 분류되지 않은 티켓, 자동화된 리뷰를 기다리는 PR, 마이그레이션할 더 엄격한 자동화된 체크, 아무도 읽지 않는 버그. 사용자가 문제를 명명하거나 무엇을 빌드할지 모를 때, 일반적인 것을 해결하는 작업을 위해 [EXAMPLE-TASKS.md](EXAMPLE-TASKS.md)를 읽으세요.

### 천천히 시작

모든 트리거는 가속기입니다. 브레이크 없는 가속기는 slop cannon을 만듭니다. 세 가지 브레이크가 있습니다:

- **자동화된 체크**: 모든 실행이 통과해야 하는 결정적 게이트(타입, lint, 테스트).
- **자동화된 리뷰**: 코드베이스의 표준과 티켓(있는 경우)에 대해 차갑게 diff를 읽는 별도의 실행.
- **인간 리뷰**: 사람이 병합 전에 PR을 읽습니다. 그것이 잡는 것은 새로운 자동화된 체크와 더 날카로운 자동화된 리뷰가 됩니다.

한 번에 하나의 자동화된 트리거를 추가하고, 처음에는 조절하며(10개 버그 리포트 중 하나, 하루에 한 번의 시계), 모든 PR에 인간 리뷰를 포함하세요. 브레이크가 신뢰를 얻으면 조절을 열고, 사람 전에 몇 번의 시도로 모든 실행 루프를 제한하세요.

### 모든 슬롯 채우기

각 서비스는 슬롯입니다. 하나의 제품이 여러 슬롯을 채울 수 있고, 하나의 서버가 여러 서비스를 호스팅할 수 있습니다. 세 가지 설계를 나란히:

| Service                | All on GitHub                   | Linear tickets                 | Own tracker              |
| ---------------------- | ------------------------------- | ------------------------------ | ------------------------ |
| Ticket tracker         | GitHub Issues                   | Linear                         | own app                  |
| Ticket source          | feedback button                 | feedback button, monitor       | feedback button, monitor |
| Git host               | GitHub                          | GitHub                         | GitHub                   |
| Orchestrator           | GitHub Actions                  | own server + database          | own app                  |
| Runner                 | Actions runner                  | Actions, E2B, Daytona or a VPS | own app, or sandboxes    |
| Observability platform | none: Actions run pages suffice | an LLM tracing platform        | own app                  |

사용자가 슬롯에 대한 제품을 선택할 때, 해당 슬롯의 서베이를 읽어 방향을 잡은 다음, 현재 옵션을 직접 조사하세요. 각 서베이는 옵션을 타입별로 그룹화하고 슬롯을 결정하는 질문을 나열합니다:

- [TICKET-TRACKERS.md](TICKET-TRACKERS.md)
- [GIT-HOSTS.md](GIT-HOSTS.md)
- [RUNNERS.md](RUNNERS.md)
- [OBSERVABILITY-PLATFORMS.md](OBSERVABILITY-PLATFORMS.md)

서비스를 구매하고 작업을 빌드하세요: 작업은 사용자의 설계를 전달하고, 서비스는 일반적입니다. 기성 티켓 트래커를 선호하세요: 견고하고, 사람들이 이미 알고 있으며, 외부 사용자를 쉽게 받아들일 수 있습니다.

### 모든 작업에 질문

각 작업에 대해 답하세요:

1. 무엇이 트리거하나요?
2. 무엇을 하고, 어떤 서비스를 읽고 쓰나요?
3. 다음에 무엇을 트리거하나요?
4. 사람은 어디에서 재진입하나요?
5. 두 실행이 같은 작업을 하는 것을 무엇이 막나요?

각 티켓 소스에 대해 답하세요: 같은 티켓을 두 번 제출하는 것을 무엇이 막나요?

설계는 모든 슬롯이 제품을 명명하고(또는, observability platform의 경우 의도적인 none), 모든 작업과 티켓 소스가 모든 질문에 대한 답을 가질 때 완료됩니다.
