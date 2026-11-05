---
name: how
description: "\"how does X work\", 무언가를 변경하기 전의 코드 워크스루, 배치 / 소유권 / 계층 질문 (\"이것이 어디에 살아야 하는가\", \"어떤 패키지가 이것을 소유하는가\", \"이것이 올바른 레이어인가\")에 사용하세요. 하위 시스템 아키텍처, 런타임 흐름, 온보딩 정신 모델을 설명합니다. 동기에는 why를 사용하세요."
disable-model-invocation: true
---

# How

"how does X work?" 질문에 답하기 위해 코드베이스를 탐색하세요. 주석이 달린 소스 코드처럼 읽히지 않을 만큼 충분하지만, 작동하는 정신 모델을 구축하기에 충분한, 하위 시스템에 온보딩하는 시니어 엔지니어 수준의 아키텍처 설명을 생성하세요.

모든 생성은 `subagent_type: generalPurpose` 및 `readonly: true`인 Task 서브에이전트입니다. Explorer는 `pstack-models.mdc` 규칙의 `how explorer` 라인을 사용하고 (기본값 `grok-4.7-xhigh-fast`), 모든 explainer는 `how explainer` 라인을 사용합니다 (기본값 `claude-opus-5-5-xhigh`). `model`을 해당 라인의 값으로 설정하거나, 규칙이나 라인이 없으면 기본값으로 설정하세요. 값이 `auto` 또는 `inherit-parent`일 때 `model`을 설정하지 않은 채로 두세요. Task 도구가 슬러그를 거부하면 기본값을 사용하고 그렇게 말하세요. 기본값을 거부하면 오류 메시지에서 동일한 패밀리의 가장 가까운 유효한 슬러그를 사용하세요. **poteto-mode** 스킬의 Subagents 섹션에 따라 작업에 대한 각 서브에이전트의 추론 수준과 빠른 또는 표준 속도를 선택하세요.

## 1. 복잡성 평가

범위가 모호하면 해석을 진술하고 탐색하세요. 사용자가 리디렉션할 수 있습니다.

- **Simple (단순)** (단일 모듈, 작은 유틸리티, "function X는 어떻게 작동하는가"와 같은 좁은 질문): explorer가 없습니다. explorer-findings 섹션 없이 `references/explainer-prompt.md`에서 빌드된 한 번의 패스로 탐색하고 설명하는 하나의 explainer를 생성하세요. 4단계로 이동하세요.
- **Complex (복잡)** (여러 파일 또는 서비스에 걸친 하위 시스템, 교차 기능, 전체 아키텍처 개요): 2단계로 이동하세요.

의심스러우면 단순한 경로를 택하세요.

## 2. 탐색 (복잡만)

질문을 2에서 4개의 각도로 분해하세요. 각각은 하위 시스템의 별개의 슬라이스입니다. 각각에 `references/explorer-prompt.md`와 그 각도가 채워진 단일 메시지에서 모든 explorer를 생성하세요.

## 3. 합성 (복잡만)

모든 explorer가 반환되면 `references/explainer-prompt.md`와 모든 explorer의 발견 사항이 채워진 하나의 explainer를 생성하세요.

## 4. 제시

explainer의 출력을 제시하세요. 대화에서 명확성이나 컨텍스트를 위한 가벼운 편집은 괜찮습니다. 실질적으로 다시 작성하지 마세요.

## 출력 형식

설명은 `references/explainer-prompt.md`에 정의된 섹션을 사용하며, 적용되지 않는 것은 삭제합니다: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
