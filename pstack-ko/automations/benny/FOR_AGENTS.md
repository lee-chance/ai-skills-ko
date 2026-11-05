# benny automation 의도

## 자동화하고 싶은 것

하나의 Slack 이슈 채널에서 함께 작동하는 두 개의 Cursor 자동화를 원합니다.

### 자동화 1: 이슈 보고서 분류

- 트리거: 누군가가 구성된 소스 Slack 채널에 새 최상위 보고서를 게시할 때, 이 자동화가 그 보고서에서 시작하고 원래 스레드 좌표를 유지하기를 원합니다.
- 동작: 스레드와 첨부를 읽고, 보고서를 버그 또는 성능 이슈, 피처 요청, 질문 또는 피드백, 또는 재라우팅으로 분류하며, 라우팅 전 소유 가능성이 높은 레이어를 추적하기를 원합니다.
- 추적기: 구성된 추적기에서 중복을 검색하고, 확신하는 중복을 업데이트하며, 명확한 순새 버그에 대해서만 티켓을 생성하기를 원합니다.
- 도구: Slack 스레드 읽기 및 답장 액세스, 구성된 추적기 통합, 선택적 라우팅 맵을 원합니다.
- 결과: 짧은 판정과 `[benny:bug]`, `[benny:performance]`, 또는 `[benny:other]`를 가진 소스 스레드에 정확히 하나의 답장을 원합니다. 버그 또는 성능 마커는 추적기 URL을 포함할 수 있습니다.
- 경계: 이 자동화가 소스 채널에 루트 메시지를 절대 게시하지 않기를 원합니다.

### 자동화 2: 확인된 버그 재현 및 수정

- 트리거: 이 자동화가 같은 새 최상위 보고서에서 시작하거나, 설정 중 선택된 다른 지원 트리거에서 시작한 다음, 원래 스레드에서 신뢰할 수 있는 분류 마커를 기다리기를 원합니다.
- 게이트: 누군가가 수정을 명확히 소유할 때 중단하기를 원합니다. 기존 풀 리퀘스트나 병합된 커밋이 보고서를 수정할 수 있으면, 경쟁 변경 대신 검증을 원합니다.
- 동작: 구성된 제어 어댑터와 피처 맵을 사용하고, 실제 UI를 통해 정확한 증상을 두 번 재현하며, 스크린샷, 비디오, 읽기 전용 상태 교차 검사를 캡처하기를 원합니다.
- 수정: 기존 풀 리퀘스트를 검증하되 그 위에 저작하지 않기를 원합니다. 확인된 재현 후, 하나의 제한된 근본 원인 수정을 시도하고, 테스트가 저렴할 때 TDD를 사용하며, 폭발 반경을 smoke하고, 전후 증명이 통과할 때만 초안 풀 리퀘스트를 열 수 있습니다.
- 도구: Slack 스레드 읽기 및 답장 액세스, 리포지토리 및 히스토리 액세스, 초안 풀 리퀘스트 생성, 구성된 추적기, 제어 어댑터를 원합니다.
- 결과: 소스 또는 선택적 작업 스레드에 증거와 검증된 결과, 선택적 초안 풀 리퀘스트를 원합니다. 업데이트는 간결해야 합니다.
- 경계: 이 자동화가 소스 채널에 루트 메시지를 절대 게시하지 않기를 원합니다.

### 공유 규칙

- 소스 채널과 루트 스레드 좌표가 전체 실행 동안 불변으로 유지되기를 원합니다.
- 유틸리티와 디버그 봇을 증거로 취급하지 위임이나 수정 소유권으로 취급하지 않습니다.
- 하위 에이전트가 돕도록 허용하지만, Slack에 게시하거나 Slack 자격 증명을 받을 수 없습니다.
- 이 전체 팩이 타깃 리포지토리의 `.cursor/automations/benny/`에 커밋되기를 원합니다. 그것의 `SKILL.md` 파일들은 등록된 플러그인 스킬이 아니라 직접 자동화 지시입니다.
- pstack이 `how`, `why`, `tdd`, `unslop`, 필요한 원칙 스킬 같은 공유 종속성에 대해서만 타깃 리포지토리의 커밋된 `.cursor/settings.json`을 통해 활성화되기를 원합니다.
- 각 라이브 자동화 프롬프트가 커밋된 운영 파일을 직접 읽기를 원합니다. 플러그인 캐시 경로, 복사된 발췌, 또는 슬래시 스킬 발견을 원하지 않습니다.
- 팩 새로 고침이 그것들을 덮어쓸 수 없도록 사용자 소유 구성, 피처 맵, 라우팅 맵, 비밀을 `.cursor/automations/benny/` 외부에 유지합니다.
- 채널 좌표, 추적기 액세스, 제어 어댑터, 또는 피처 맵이 누락되거나 불확실할 때 두 자동화 모두 닫힌 상태로 실패하기를 원합니다.
- 초안 풀 리퀘스트만 원합니다. 병합하거나 배포하지 마세요.

### 내 구성

- 소스 Slack 채널: `<channel>`
- 선택적 작업 채널: `<channel or none>`
- 리포지토리와 기본 브랜치: `<repo>`, `<branch>`
- 추적기: `<type, team, project, labels, intake status>`
- 라우팅 맵: `<path or none>`
- 분류 신원: `<slack identity>`
- 제어 스킬: `<configured skill or adapter>`
- 피처 맵: `<committed same-repo path outside the copied pack, or behavior to paraphrase>`
- 모델: `<triage, reproduce, code, media review>`
- 상태 이모지 문자열: `<seen, reproducing, reproduced, blocked, fixing, failed, pull request opened>`
- 예산: `<polling, verdict wait, follow-up, repro, rejection, fix>`
- 선택적 봇 토큰 기능: `<none, file download, or editable operations status>`

[`configuration.example.yaml`](./templates/configuration.example.yaml)과 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md)에서 시작하세요. 그것들을 이 팩 외부에 복사하고 채우세요. 예를 들어 `.cursor/benny/` 아래. 비밀 값을 비밀 관리자나 환경에 보관하세요.

## 에이전트를 위해

인간은 이 파일에 Cursor를 가리켜 setup에 진입합니다. 발견된 benny 슬래시 스킬을 찾거나 호출하지 마세요.

1. 어느 리포지토리가 자동화를 실행할지 질문.
2. 이 `FOR_AGENTS.md`를 포함하는 디렉토리를 소스 팩으로 취급.
3. 전체 소스 팩을 `<target-repository>/.cursor/automations/benny/`로 병합.
4. 모든 대상 전용 파일 보존. 관련 없는 파일을 절대 삭제하거나 사용자 소유 구성, 피처 맵, 또는 라우팅 맵을 덮어쓰지 마세요.
5. 소스 관리 경로의 기존 대상 파일이 다를 때, 차이를 검토하고 로컬 편집을 버리지 않고 병합. 소유권이 모호하면, 그것을 교체하기 전에 중단하고 질문하세요.
6. 복사된 `FOR_AGENTS.md`와 `skills/setup-benny/SKILL.md`가 타깃 리포지토리에 존재하는지 확인.
7. 타깃 리포지토리로부터 `.cursor/automations/benny/skills/setup-benny/SKILL.md`를 직접 읽고 따르세요.

타깃 리포지토리의 `.cursor/settings.json`에 이 항목을 병합하기를 원합니다:

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

관련 없는 모든 설정과 플러그인을 보존하세요. 기존 파일이 jsonc를 사용할 때 주석과 유효한 jsonc 구문을 보존하세요.

타깃 리포지토리에 루트된 새 에이전트로부터 검증을 원합니다. pstack의 `how`, `why`, `tdd`, `unslop`, benny가 사용하는 원칙 스킬들이 프로젝트 범위에서 해결되는지 확인하세요. 현재 세션이나 사용자 범위 설치로부터 로드된 스킬은 세지 마세요.

프로젝트 범위 플러그인을 사용할 수 없거나 공유 종속성이 해결되지 않으면, 중단하고 무엇이 실패했는지 설명하세요. `.cursor/automations/benny/skills/`를 플러그인 매니페스트에 추가하거나 그 파일들이 슬래시 스킬 목록에 나타날 것으로 기대하지 마세요.

`.cursor/settings.json`, `.cursor/automations/benny/`, 참조된 비밀 없는 구성이 어느 자동화든 활성화되기 전에 커밋되어야 한다고 말하세요. 명시적으로 요청할 때까지 자동화를 생성하거나 업데이트하지 마세요.

첫 번째 생성의 경우, 분류에 한 번, 재현 및 수정에 한 번 내장 `/automate`를 사용하세요. 두 번째를 시작하기 전에 첫 번째 자동화에 대한 초안 검토, 승인, 준비 상태 검사, Automations 에디터 핸드오프를 완료하세요.

이 의도와 완성된 구성을 각 초안에 패러프레이즈하세요. 분류 프롬프트는 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`를 읽고 따라야 합니다. 재현 프롬프트는 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`를 읽고 따라야 합니다. `/automate`가 자동화가 실행될 리포지토리에 커밋되었음을 확인한 후에만 이러한 리포지토리 상대 경로를 사용하세요.

기존 자동화의 경우, 그것들을 검사하거나 업데이트하기 위해 `/automate`를 사용하지 마세요. 구성을 검증한 다음, 복사된 setup 파일의 간결한 필드 체크리스트를 사용하여 에디터에서 각 자동화를 직접 편집할 수 있도록 하세요. 중복을 생성하지 마세요.
