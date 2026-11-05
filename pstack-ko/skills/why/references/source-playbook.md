# 소스 플레이북

`why` 스킬은 사용 가능한 증거 카테고리마다 조사자 하나를 생성하며, 각 조사자는 아래의 소스별 플레이북 하나만 읽습니다. 플레이북은 흔한 MCP를 위한 구체적인 예시입니다. 같은 카테고리의 다른 MCP에 맞게 조정하세요.

| 카테고리 | 플레이북 | 문서화하는 MCP 예시 |
|---|---|---|
| 소스 제어 기록 | [`code-archaeology.md`](./sources/code-archaeology.md) | git, `gh` |
| 이슈 / 티켓 트래커 | [`linear.md`](./sources/linear.md) | Linear (Jira, GitHub Issues, Plane, Shortcut에 맞게 조정) |
| 장문 문서 | [`notion.md`](./sources/notion.md) | Notion (Confluence, Google Docs, Coda에 맞게 조정) |
| 실시간 팀 채팅 | [`slack.md`](./sources/slack.md) | Slack (Discord, Microsoft Teams, Mattermost에 맞게 조정) |
| 인프라 관찰 가능성 | [`datadog.md`](./sources/datadog.md) | Datadog (New Relic, Honeycomb, Grafana, Splunk에 맞게 조정) |
| 오류 / 예외 추적 | [`sentry.md`](./sources/sentry.md) | Sentry (Rollbar, Bugsnag, Airbrake에 맞게 조정) |
| 제품 분석 웨어하우스 | [`databricks.md`](./sources/databricks.md) | Databricks SQL (Snowflake, BigQuery, ClickHouse, dbt에 맞게 조정) |

여러 카테고리에 걸치는 항목:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). 대상 코드가 방어적으로 보이면 이것을 추가하세요 (null 검사, 재시도, 타임아웃, 속도 제한, 기능 플래그, 이그레스 가드, OOM 핸들러).
