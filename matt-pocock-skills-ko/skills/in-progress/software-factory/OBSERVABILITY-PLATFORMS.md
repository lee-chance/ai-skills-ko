# Observability platforms

> 2026-10에 조사되었으며, 최신 상태가 보장되지 않습니다. 이를 사용하여 방향을 잡은 다음, 현재 옵션을 직접 조사하세요: 제품, 가격, 제한, 베타는 빠르게 변경됩니다.

observability platform 슬롯을 채우거나 의도적인 none을 결정하기 위한 방향. 타입은 **사람이 실행 내부에서 무엇을 봐야 하는가**에 따라 나뉩니다: 로그, 에이전트 트레이스(각 모델 호출과 도구 호출이 스팬으로), 또는 사용자 시스템의 나머지와 결합된 트레이스. 자체 호스팅 대 SaaS는 마지막 세 타입을 가로지릅니다. 실행이 플랫폼이 보는 것에 대해 행동해야 할 때, 플랫폼을 티켓 소스로 만드세요: 모니터가 티켓을 제출하고, 실행이 그것을 읽습니다.

## 러너가 연결하는 방법

모든 타입은 다섯 가지 훅 중 하나를 통해 데이터를 받습니다. 슬롯을 채울 때 제품과 함께 훅을 명명하세요.

- **Harness OTel**: 에이전트 하네스가 OpenTelemetry 자체를 내보냅니다. Claude Code와 Claude Agent SDK는 `CLAUDE_CODE_ENABLE_TELEMETRY=1`과 `OTEL_*` 변수를 받으며, 프롬프트와 도구 출력은 옵트인입니다. Codex CLI는 `config.toml`의 `[otel]` 블록을 받습니다. ([Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/observability), [Claude Code](https://code.claude.com/docs/en/monitoring-usage), [Codex config](https://developers.openai.com/codex/config-advanced))
- **Platform push**: 모델 플랫폼이 트레이스를 대신 보냅니다. Claude Managed Agents가 Claude Console에 설정된 OTLP 대상으로 하는 것처럼. ([Claude docs](https://platform.claude.com/docs/en/manage-claude/opentelemetry/api))
- **SDK wrapper**: 러너 코드의 한 호출, 예를 들어 LangSmith의 `configure_claude_agent_sdk()`.
- **Hook plugin**: Claude Code 훅이 각 Stop에서 세션 트랜스크립트를 읽고 전송합니다. Langfuse의 Claude Code 플러그인처럼.
- **Gateway**: 러너의 모델 베이스 URL이 로깅 프록시를 가리킵니다. 러너 코드가 제로이며, 모델 호출만 봅니다: 하네스 내부의 도구 호출은 보이지 않습니다.

OpenTelemetry는 공통 와이어입니다: harness OTel과 platform push는 모든 OTLP 백엔드에 착륙합니다. GenAI 시맨틱 컨벤션(`invoke_agent`, `chat`, `execute_tool` 스팬)은 아직 정착 중이므로, 스팬 이름이 표류할 것으로 예상하세요. ([OTel GenAI agent spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans))

## Type 1: None (러너 또는 orchestrator 제품이 충분히 보여줌)

**무엇인가**: 사람이 러너나 orchestrator가 이미 보여주는 곳에서 각 실행을 읽습니다: CI 실행 페이지, 샌드박스 대시보드, 실행 아티팩트로 저장된 에이전트의 트랜스크립트. 빌드할 훅이 없고, 러너만큼 자체 호스팅되며, 그 비용과 번들로 제공됩니다.

**팩토리가 선택할 때**: 하루에 몇 번의 실행, 한 사람이 보고, 질문은 "실패했는가, 그리고 무엇을 출력했는가?"입니다. 대부분의 팩토리는 여기서 시작하고, 실행 간 검색, 실행당 토큰이나 비용 롤업, 또는 러너가 유지하는 것보다 긴 보유가 필요할 때 성장합니다.

**시작점**: [GitHub Actions run logs](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization), [E2B sandbox logs and metrics](https://e2b.dev/docs), [Daytona sandbox telemetry](https://www.daytona.io/docs/en/observability/otel-collection/), [OpenAI Agents SDK traces](https://openai.github.io/openai-agents-python/tracing/). 샌드박스 제품은 종종 OTLP를 통해 같은 데이터를 전달하며, 이것이 Type 2로의 경로입니다.

**검증**: 러너 제품당 보유 일수; 일부 샌드박스는 매우 적게 유지합니다(Daytona: 3일, 2026-10 기준).

## Type 2: LLM 및 에이전트 트레이싱 플랫폼

**무엇인가**: 에이전트 트레이스를 중심으로 구축된 백엔드: 모델 호출과 도구 호출의 트리로서의 각 실행, 토큰 비용, 프롬프트 및 세션과 함께, 보통 그 위에 evals 및 데이터셋.

**팩토리가 선택할 때**: 사람이 많은 실행에 걸쳐 "에이전트가 왜 그렇게 했는가?"라고 묻습니다. retro 실행이나 사람이 실행을 비교합니다. 토큰 지출이 실행당 롤업이 필요합니다. 오픈 소스를 자체 호스팅하면 트랜스크립트가 사내에 유지됩니다.

**타입의 특징**: harness OTel, SDK 래퍼 또는 훅 플러그인을 받으며, 종종 platform push도 받습니다. 볼륨으로 청구되고, 에이전트 실행은 스팬이 많습니다(도구 호출당 하나의 스팬). 따라서 요청당이 아니라 실행당 예산을 책정하세요.

**시작점**: [Langfuse](https://langfuse.com/pricing) 및 [Arize Phoenix](https://phoenix.arize.com) (오픈 소스, 자체 호스팅 가능), [LangSmith](https://www.langchain.com/pricing-langsmith), [Braintrust](https://www.braintrust.dev/pricing).

**검증**: 무료 티어 제한, 청구 단위(trace, span, unit 또는 GB; Braintrust는 2026-03에 GB로 이동), 어떤 티어가 자체 호스팅을 잠금 해제하는지, 현재 소유권.

## Type 3: 일반 APM 및 로깅 백엔드

**무엇인가**: 사용자의 기존 observability 스택(모든 서비스에 대한 로그, 메트릭, 분산 트레이스), 에이전트 또는 LLM 뷰 추가됨.

**팩토리가 선택할 때**: 팀이 이미 하나에 대해 지불합니다. 실행이 앱 자체의 트레이스에 결합되어야 합니다(Agent SDK는 `TRACEPARENT`를 전파하므로, 실행이 호출자의 트레이스 내부에 중첩됩니다). 또는 모니터 티켓 소스가 이미 그것에서 읽습니다.

**타입의 특징**: harness OTel이 벤더의 OTLP 엔드포인트로 직접 갑니다. GB, 이벤트 또는 호스트당 가격이 책정되므로, 팩토리의 볼륨은 기존 청구서의 반올림 오차이고 새 청구서의 놀라움입니다.

**시작점**: [Datadog Agent Observability](https://www.datadoghq.com/product/llm-observability/), [Grafana Cloud](https://grafana.com/pricing/), [Honeycomb](https://www.honeycomb.io/pricing), [SigNoz](https://signoz.io/pricing/) (오픈 소스).

**검증**: 에이전트 뷰가 GA인지 프리뷰인지, 어떤 하네스가 설정 가이드를 가지고 있는지, 무료 티어 볼륨.

## Type 4: 요청 로깅이 있는 LLM 게이트웨이

**무엇인가**: 러너와 모델 제공자 사이의 프록시로, 모든 요청과 응답을 로그하며, 라우팅, 키, 예산 및 캐싱이 함께 있습니다.

**팩토리가 선택할 때**: 사용자가 실행당 지출 한도 또는 많은 러너를 위한 하나의 키 볼트를 원하고, 로깅이 함께 제공됩니다. 또는 하네스가 자체 내보내기가 없습니다. 모델 호출만 보므로, 도구 호출을 위해 Type 2 또는 3과 쌍을 이루세요.

**시작점**: [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/logging) (오픈 소스, Langfuse 또는 OTel로 로그 전달), [Portkey](https://portkey.ai/pricing).

**검증**: SaaS의 요청당 가격, 그리고 제품이 여전히 활발하게 개발되고 있는지(Helicone은 인수 후 유지 관리 모드로 전환, 2026-10 기준).

## 추가 조사

이 슬롯을 결정하는 질문에 대해 각 후보를 확인하세요:

1. **러너 또는 orchestrator가 이미 충분히 보여주는가?** 사람이 필요로 하는 것(교차 실행 검색, 실행당 비용, 보유)을 실행 페이지 또는 샌드박스 대시보드가 제공하는 것과 비교하세요. 여기서 예는 의도적인 none을 의미합니다.
2. **에이전트 하네스가 트레이스를 어떻게 내보내는가?** 하네스가 지원하는 다섯 가지 훅 중 어느 것인지 찾은 다음, 제품이 수락하는 것을 찾으세요. 도구 호출이 스팬으로 도착하는지 확인하고, 프롬프트와 도구 출력이 옵트인이 필요한지 확인하세요.
3. **자체 호스팅 가능한가?** 라이선스, 어떤 티어가 허용하는지, 무엇에서 실행되는지. 트랜스크립트가 사내에 유지되어야 할 때 결정적입니다.
4. **비용 형태는 무엇인가?** 청구 단위, 무료 티어, 도구 호출당 하나의 스팬을 고려한 실행당 추정치를 하루당 실행 수로 곱하세요.
5. **보유 기간은 얼마나 되는가?** 각 티어에서 유지되는 일수를, 실행이 잘못될 때 사람이 뒤를 돌아보는 기간과 비교하세요.

**답이 있는 곳**: 벤더의 가격 페이지(단위, 티어, 보유); 특정 하네스에 대한 벤더의 통합 문서; 하네스 자체의 모니터링 문서(무엇을 내보내는지, 어떤 플래그가 베타인지); OpenTelemetry GenAI 시맨틱 컨벤션; 라이선스 및 릴리스 활동을 위한 제품의 repo; 소유권 변경을 위한 벤더의 변경 로그 또는 블로그.

**가장 빨리 구식이 되는 것**: 무료 티어 제한 및 가격; 베타 및 프리뷰 플래그(Claude Code 트레이스 내보내기, Console platform push, 벤더 에이전트 뷰); 소유권 및 유지 관리 상태; 청구 단위; 보유 일수; GenAI 스팬 이름.
