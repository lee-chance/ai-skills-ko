---
name: why
description: "'why does X work this way', 'why we picked Y', 설계 근거, 회귀, 사후 분석, 또는 데이터 지원 임계값에 사용하세요. 사용 가능한 MCP를 발견하고 각 증거 카테고리 (소스 제어, 이슈 트래커, 장문 문서, 실시간 채팅, 인프라 관찰 가능성, 오류 추적, 제품 분석 웨어하우스)를 병렬로 쿼리한 다음 인용된 결정과 트레이드오프에 대한 읽기를 반환합니다. 런타임 동작에는 how를 사용하세요."
disable-model-invocation: true
---

# Why

코드 뒤의 동기와 의도를 조사하세요. 동반 `how` 스킬은 코드가 무엇을 하고 어떻게 작동하는지에 답합니다. `why`는 어떤 힘이 그 형태로 이끌었는지에 답합니다.

아래 각 생성은 `pstack-models.mdc` 규칙의 역할 라인과 기본값을 명명합니다. `model`을 해당 라인의 값으로 설정하거나, 규칙이나 라인이 없으면 기본값으로 설정하세요. 값이 `auto` 또는 `inherit-parent`일 때 `model`을 설정하지 않은 채로 두세요. Task 도구가 슬러그를 거부하면 기본값을 사용하고 그렇게 말하세요. 기본값을 거부하면 오류 메시지에서 동일한 패밀리의 가장 가까운 유효한 슬러그를 사용하세요. **poteto-mode** 스킬의 Subagents 섹션에 따라 작업에 대한 각 서브에이전트의 추론 수준과 빠른 또는 표준 속도를 선택하세요.

모든 생성은 `readonly: false` (에이전트 모드)가 있는 `generalPurpose`입니다. **readonly/Ask 모드를 사용하지 마세요.** MCP 접근을 제거하여 MCP 지원 조사자와 합성기의 인용 스팟 체크를 비활성화합니다. 조사자는 여전히 아무것도 작성하면 안 됩니다.

## 운영 자세

**신중하고 조심스럽고 정밀한 조사자**로 운영하세요. 알고 있는 것과 추론하는 것에 대해 정직하세요. 전체 신뢰 프레임워크와 표현 가이드에 대해 `references/epistemics.md`를 읽으세요. 합성기가 그것을 따라야 합니다.

## 단계 1. 대상과 질문 이해

**대상**은 일반적으로 코드 청크, 패턴, 기능 또는 명명된 설계 결정입니다. **질문**은 일반적으로 설계 근거, 트레이드오프, 동기 엣지 케이스, 외부 제약 조건, 죽은 코드 또는 광범위한 역사 스윕입니다.

대상이 모호하면 ("why do we do it this way?" 명확한 참조 없음) 대화 컨텍스트 (열린 파일, 최근 편집, 커서 위치, 방금 논의한 것)에서 최선의 추측을 하세요. 사용자가 잘못되었다면 리디렉션할 수 있도록 해석을 간략하게 진술한 다음 진행하세요.

## 단계 2. 코드 앵커 설정

조사자를 생성하기 전에 시드 컨텍스트를 인라인으로 빌드하세요: 파일 경로와 라인 범위, 키 심볼 (함수, 클래스, 상수), 대상을 터치하는 마지막 몇 커밋, 병합 커밋의 PR 번호 (주제 줄의 패턴 `(#1234)`), 링크된 티켓 ID. 마지막 터치 커밋에 대해 `git blame -L <start>,<end> <file>`을 실행하고, 이름 변경을 통한 패치가 있는 전체 기록에 대해 `git log --follow -p -- <file>`을, PR 번호가 보이는 최근 커밋에 대해 `git log --oneline -20 -- <file>`을, PR 번호를 추출하기 위해 `git log -1 --format=%B <commit>`을 실행하세요. 그런 다음 실질적인 커밋에 대해 PR 본문과 토론을 가져오세요: `gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`. 이 앵커는 모든 조사자와 합성기로 갑니다.

## 단계 3. 병렬 조사자 생성

**기본적으로 전체 병렬 조사로 설정하세요.** 목표는 최소가 아니라 완전한 커버리지 맵입니다. null을 문서화하고, 검색을 건너뛰지 마세요.

### 발견

조사자를 생성하기 전에 Cursor 환경에서 사용 가능한 MCP를 나열하세요. 존재할 때 available-tools 맵을 사용하세요. 그렇지 않으면 Cursor가 노출하는 `mcps/` 디렉토리를 검사하여 활성화된 MCP 서버를 확인하세요.

각 사용 가능한 MCP를 하나의 증거 카테고리에 매핑하세요:

1. 소스 제어 기록
2. 이슈 / 티켓 트래커
3. 장문 문서
4. 실시간 팀 채팅
5. 인프라 관찰 가능성
6. 오류 / 예외 추적
7. 제품 분석 웨어하우스

소스 제어는 git과 `gh`를 통해 항상 사용 가능합니다. 나머지 6개의 경우 MCP 이름, 서버 지침, 도구 이름 및 리소스 설명자를 사용하여 분류하세요. MCP가 하나 이상의 카테고리에 적합할 수 있으면 주요 증거와 일치하는 것을 선택하세요. 커버리지 맵에 모호한 경우를 기록하세요.

일치하는 MCP가 있는 카테고리당 하나의 조사자를 생성하세요. 모두 단일 메시지에서 동시에 실행되도록, 각각 정확히 하나의 도구 또는 MCP를 소유합니다. 하나의 에이전트에게 여러 MCP를 커버하도록 요청하지 마세요. `model`: `why investigators` 라인, 기본값 `grok-4.7-xhigh-fast`.

각 조사자의 프롬프트는 채워진 `references/investigator-prompt.md` 플러스:
- 선택한 MCP에 대한 카테고리 playbook `references/sources/<source>.md`, `references/source-playbook.md`의 예제에서 조정됨
- **대상 코드가 방어적으로 보이면** (null 검사, 재시도 로직, 타임아웃 처리, 속도 제한, 기능 플래그, 이그레스 가드, OOM 핸들러) `references/sources/incident-postmortem.md`
- 코드 앵커와 사용자의 원래 질문

### 조사자 명단, 사용 가능한 증거 카테고리당 하나

아래 각 카테고리는 "Best at" 다음에 표시된 하나의 "why" 형태를 표면화하는 데 고유하게 위치합니다. 무엇을 돌려받을지 알고, 카테고리가 비어 반환될 때 갭을 명명하고, 드물게 증명 가능하게 관련 없는 경우에만 건너뛰기를 정당화하는 데 사용하세요.

1. **소스 제어** (git 기록, PR용 `gh`, 코드 주석, 테스트). 항상 생성, 유일하게 보장된 소스. *검토 중 캡처된 구현 시간 근거*에 가장 적합합니다.
2. **이슈 / 티켓 트래커** (예: Linear, Jira, GitHub Issues, Plane, Shortcut MCP). *제품 또는 비즈니스 강제 기능*에 가장 적합합니다. 왜가 엔지니어링 외부일 때 가장 강합니다.
3. **장문 문서** (예: Notion, Confluence, Google Docs, Coda MCP). *장문 설계 근거*에 가장 적합하며, 코드가 되기 전에 작성되었습니다.
4. **실시간 팀 채팅** (예: Slack, Discord, Microsoft Teams, Mattermost MCP). *문서에 도달하지 않은 실시간 숙고*에 가장 적합합니다. 소스 제어, 티켓 및 문서 서류 추적이 얇을 때 특히 중요합니다.
5. **인프라 관찰 가능성** (예: Datadog, New Relic, Honeycomb, Grafana, Splunk MCP). *코드를 동기화한 인프라 및 런타임 현실*에 가장 적합합니다. 대상이 인프라 신호 (타임아웃, 재시도, 속도 제한, 서킷 브레이커)에 반응할 때 가장 강합니다.
6. **오류 / 예외 추적** (예: Sentry, Rollbar, Bugsnag, Airbrake MCP). *방어적 또는 수정 코드를 동기화한 특정 예외 및 오류 궤적*에 가장 적합합니다. catch 블록, null 가드, 타입 검사, 재시도 및 기타 방어에 가장 강합니다.
7. **제품 분석 웨어하우스** (예: Databricks, Snowflake, BigQuery, ClickHouse, dbt, Redshift MCP). *코드를 형성한 제품 및 데이터 현실*에 가장 적합합니다. 플래그 게이트 코드, 실험 기반 배송, 데이터 마이그레이션 및 "where did this number come from" 질문에 가장 강합니다.

### 조사자를 건너뛸 때

최종 Sources Consulted로 가는 **명시적이고 서면 정당화**로만. 두 가지 유효한 이유:

- **해당 카테고리에 대해 MCP를 사용할 수 없음** 이 환경에서. 선택이 아니라 갭으로 플래그하세요: "Real-time team chat skipped. No matching MCP available, so the conversational record was not searchable."
- **소스가 증명 가능하게 관련 없음**, "probably irrelevant"만이 아닙니다. 높은 바: "Error / exception tracking skipped. Target is a build-time script with no runtime code path."

범위 평가가 PR 설명이 이미 완전한 답을 포함하는 단일 커밋 사소한 대상을 제안하면 사용 가능한 모든 7개 카테고리 검색이 중복임을 확인한 **후에만** 인라인으로 답할 수 있습니다. 명시적으로 그렇게 말하세요. 이것은 드물어야 합니다.

## 단계 4. 합성

하나의 합성기를 생성하세요. `model`: `why synthesizer` 라인, 기본값 `claude-opus-5-5-xhigh`. 그것은 얻습니다:
1. 조사자 발견 사항, null 결과 및 정당화와 함께 건너뛴 카테고리 포함
2. 코드 앵커
3. 사용자의 원래 질문
4. `references/epistemics.md`의 인식론 프레임워크
5. `references/synthesizer-prompt.md`의 합성기 프롬프트 템플릿

## 단계 5. 제시

사용자에게 합성기의 출력을 제시하세요. 명확성을 위해 또는 대화에서 컨텍스트를 추가하기 위해 가볍게 편집할 수 있지만 **신뢰 언어를 다시 작성하지 마세요**.

## 출력 형식

구조는 `references/synthesizer-prompt.md`에 있는 것입니다: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. 필요에 따라 조정하되 신뢰 분리를 그대로 유지하고, Sources Consulted를 조사자당 한 줄로 유지하세요. 아무것도 반환하지 않았거나 건너뛴 것을 포함하여 이유와 함께.

Sources Consulted 후, 사용자의 `why` 질문이 이 코드를 변경하기 위한 전조이면 계보 발견 사항을 변경 계획을 위한 Preserve / Change / Avoid / Risk 제약 조건 세트로 변환하세요.

## 피해야 할 일반적인 실패 모드

- **최근 편향.** 가장 최근 커밋이 권위 있다고 가정합니다. 현재 형태는 종종 많은 이전 결정의 축적입니다. 역추적하세요.
