# 옵저버빌리티 플랫폼

> 2026-10에 조사했으며, 최신 상태를 보장하지 않습니다. 방향을 잡는 데 사용한 다음, 현재 선택지를 직접 조사하세요. 제품, 가격, 한도, 베타는 빠르게 바뀝니다.

옵저버빌리티 플랫폼 슬롯을 채우거나, 의도적인 없음을 정하기 위한 방향 잡기입니다. 유형은 **사람이 런 안에서 무엇을 보아야 하는지**로 갈립니다. 로그, 에이전트 트레이스(각 모델 호출과 도구 호출이 스팬), 또는 그 트레이스가 사용자 시스템의 나머지와 이어진 모습. 셀프 호스트 대 SaaS는 뒤의 세 유형을 가로지릅니다. 런이 플랫폼이 보는 것에 따라 행동해야 하면, 플랫폼을 티켓 소스로 만드세요. 모니터가 티켓을 접수하고, 런이 그것을 읽습니다.

## 러너가 연결되는 방식

모든 유형은 다섯 훅 중 하나로 데이터를 받습니다. 슬롯을 채울 때 제품과 함께 훅의 이름을 적으세요.

- **하네스 OTel**: 에이전트 하네스가 스스로 OpenTelemetry를 내보냅니다. Claude Code와 Claude Agent SDK는 `CLAUDE_CODE_ENABLE_TELEMETRY=1`과 `OTEL_*` 변수를 받으며, 프롬프트와 도구 출력은 옵트인입니다. Codex CLI는 `config.toml`의 `[otel]` 블록을 받습니다. ([Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/observability), [Claude Code](https://code.claude.com/docs/en/monitoring-usage), [Codex 설정](https://developers.openai.com/codex/config-advanced))
- **플랫폼 푸시**: 모델 플랫폼이 여러분 대신 트레이스를 보냅니다. Claude Managed Agents가 Claude Console에 설정된 OTLP 목적지로 하는 방식입니다. ([Claude 문서](https://platform.claude.com/docs/en/manage-claude/opentelemetry/api))
- **SDK 래퍼**: 러너 코드 안의 호출 하나. LangSmith의 `configure_claude_agent_sdk()` 같은 것.
- **훅 플러그인**: Claude Code 훅이 각 Stop에서 세션 트랜스크립트를 읽고 보냅니다. Langfuse의 Claude Code 플러그인처럼.
- **게이트웨이**: 러너의 모델 베이스 URL이 로깅 프록시를 가리킵니다. 러너 코드는 필요 없고, 모델 호출만 봅니다. 하네스 안의 도구 호출은 보이지 않습니다.

OpenTelemetry가 공통 선입니다. 하네스 OTel과 플랫폼 푸시는 어떤 OTLP 백엔드에든 착지합니다. GenAI 시맨틱 컨벤션(`invoke_agent`, `chat`, `execute_tool` 스팬)은 아직 자리 잡는 중이라, 스팬 이름이 흔들릴 것을 예상하세요. ([OTel GenAI 에이전트 스팬](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans))

## 유형 1: 없음 (러너 또는 오케스트레이터 제품이 충분히 보여 줌)

**무엇인가**: 사람이 각 런을 러너나 오케스트레이터가 이미 보여 주는 곳에서 읽습니다. CI 런 페이지, 샌드박스 대시보드, 런 아티팩트로 저장된 에이전트 트랜스크립트. 만들 훅이 없고, 러너만큼 셀프 호스트이며, 그 비용에 묶여 있습니다.

**팩토리가 이것을 고르는 때**: 하루에 런이 적고, 지켜보는 사람이 한 명이며, 질문이 "실패했나, 무엇을 출력했나?"일 때. 대부분의 팩토리는 여기서 시작하고, 런을 가로지르는 검색, 런당 토큰이나 비용 집계, 러너가 보관하는 것보다 긴 보존이 필요해지면 여기서 벗어납니다.

**시작점**: [GitHub Actions 런 로그](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization), [E2B 샌드박스 로그와 메트릭](https://e2b.dev/docs), [Daytona 샌드박스 텔레메트리](https://www.daytona.io/docs/en/observability/otel-collection/), [OpenAI Agents SDK 트레이스](https://openai.github.io/openai-agents-python/tracing/). 샌드박스 제품은 같은 데이터를 OTLP로 전달하는 경우가 많고, 그것이 유형 2로 나가는 길입니다.

**확인**: 러너 제품별 보존 일수. 어떤 샌드박스는 아주 적게 보관합니다 (Daytona: 3일, 2026-10 기준).

## 유형 2: LLM 및 에이전트 트레이싱 플랫폼

**무엇인가**: 에이전트 트레이스를 중심으로 만든 백엔드. 각 런이 모델 호출과 도구 호출의 트리이고, 토큰 비용, 프롬프트, 세션이 있으며, 보통 그 위에 eval과 데이터셋이 있습니다.

**팩토리가 이것을 고르는 때**: 사람이 많은 런에 걸쳐 "에이전트는 왜 그렇게 했나?"를 물을 때. 회고 런이나 사람이 런을 비교할 때. 토큰 지출에 런당 집계가 필요할 때. 오픈 소스를 셀프 호스트하면 트랜스크립트를 사내에 둡니다.

**이 유형의 특성**: 하네스 OTel, SDK 래퍼, 또는 훅 플러그인을 받고, 종종 플랫폼 푸시도 받습니다. 용량으로 과금되고, 에이전트 런은 스팬이 많습니다 (도구 호출당 스팬 하나). 요청당이 아니라 런당으로 예산을 잡으세요.

**시작점**: [Langfuse](https://langfuse.com/pricing)와 [Arize Phoenix](https://phoenix.arize.com) (오픈 소스, 셀프 호스트 가능), [LangSmith](https://www.langchain.com/pricing-langsmith), [Braintrust](https://www.braintrust.dev/pricing).

**확인**: 무료 티어 한도, 과금 단위(트레이스, 스팬, 유닛 또는 GB. Braintrust는 2026-03에 GB로 옮겼습니다), 어떤 티어가 셀프 호스팅을 여는지, 현재 소유.

## 유형 3: 일반 APM 및 로깅 백엔드

**무엇인가**: 사용자의 기존 옵저버빌리티 스택(모든 서비스의 로그, 메트릭, 분산 트레이스)에 에이전트 또는 LLM 뷰를 더한 것.

**팩토리가 이것을 고르는 때**: 팀이 이미 하나에 비용을 내고 있을 때. 런을 앱 자신의 트레이스에 이어야 할 때 (Agent SDK가 `TRACEPARENT`를 전파하므로, 런이 호출자의 트레이스 안에 중첩됩니다). 또는 모니터 티켓 소스가 이미 거기서 읽을 때.

**이 유형의 특성**: 하네스 OTel이 벤더의 OTLP 엔드포인트로 바로 갑니다. GB, 이벤트, 또는 호스트당 가격이라, 팩토리의 용량은 기존 청구서에서는 반올림 오차이고 새 청구서에서는 뜻밖의 금액입니다.

**시작점**: [Datadog Agent Observability](https://www.datadoghq.com/product/llm-observability/), [Grafana Cloud](https://grafana.com/pricing/), [Honeycomb](https://www.honeycomb.io/pricing), [SigNoz](https://signoz.io/pricing/) (오픈 소스).

**확인**: 에이전트 뷰가 GA인지 preview인지, 어떤 하네스에 설정 가이드가 있는지, 무료 티어 용량.

## 유형 4: 요청 로깅이 있는 LLM 게이트웨이

**무엇인가**: 러너와 모델 제공자 사이의 프록시. 모든 요청과 응답을 로그하고, 옆에 라우팅, 키, 예산, 캐싱이 있습니다.

**팩토리가 이것을 고르는 때**: 사용자가 런당 지출 상한이나 많은 러너를 위한 키 보관소 하나를 원하고, 로깅이 따라올 때. 또는 하네스에 자체 내보내기가 없을 때. 모델 호출만 보므로, 도구 호출을 위해 유형 2나 3과 짝을 이루세요.

**시작점**: [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/logging) (오픈 소스, 로그를 Langfuse 또는 OTel로 전달), [Portkey](https://portkey.ai/pricing).

**확인**: SaaS의 요청당 가격, 그리고 제품이 아직 활발히 개발되는지 (Helicone은 인수 이후 유지보수 모드로 들어갔습니다, 2026-10 기준).

## 추가 조사

이 슬롯을 결정하는 질문에 각 후보를 대조하세요.

1. **러너나 오케스트레이터가 이미 충분히 보여 주나요?** 사람이 필요로 하는 것(런을 가로지르는 검색, 런당 비용, 보존)을 런 페이지나 샌드박스 대시보드가 주는 것과 비교하세요. 여기서 예라면 의도적인 없음입니다.
2. **에이전트 하네스는 트레이스를 어떻게 내보내나요?** 하네스가 다섯 훅 중 무엇을 지원하는지 찾고, 그다음 제품이 무엇을 받는지 찾으세요. 도구 호출이 스팬으로 도착하는지, 프롬프트와 도구 출력에 옵트인이 필요한지 확인하세요.
3. **셀프 호스트할 수 있나요?** 라이선스, 어떤 티어가 허용하는지, 무엇 위에서 도는지. 트랜스크립트가 사내에 있어야 할 때 결정적입니다.
4. **비용 형태는 무엇인가요?** 과금 단위, 무료 티어, 그리고 도구 호출당 스팬 하나에 하루 런 수를 곱한 런당 추정.
5. **보존은 얼마나 기나요?** 각 티어에서 보관하는 일수. 런이 잘못되었을 때 사람이 얼마나 멀리 뒤를 보는지에 대조하세요.

**답이 있는 곳**: 벤더의 가격 페이지(단위, 티어, 보존). 특정 하네스에 대한 벤더의 통합 문서. 하네스 자신의 모니터링 문서(무엇을 내보내는지, 어떤 플래그가 베타인지). OpenTelemetry GenAI 시맨틱 컨벤션. 라이선스와 릴리스 활동을 위한 제품 저장소. 소유 변경을 위한 벤더의 체인지로그 또는 블로그.

**가장 빨리 낡는 것**: 무료 티어 한도와 가격. 베타와 preview 플래그(Claude Code 트레이스 내보내기, Console 플랫폼 푸시, 벤더 에이전트 뷰). 소유와 유지보수 상태. 과금 단위. 보존 일수. GenAI 스팬 이름.
