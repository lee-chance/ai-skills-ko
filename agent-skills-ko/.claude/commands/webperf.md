---
description: web-performance-auditor 페르소나로 웹 성능 감사를 실행합니다
disable-model-invocation: true
---

`/webperf`는 웹 애플리케이션을 대상으로 합니다. 유틸리티 라이브러리, CLI, 브라우저에 보이는 출력이 없는 서버 전용 코드에는 쓰지 마세요.

## 모드 결정

**심층 모드 (Deep)**: 다음 중 하나라도 있으면 활성화하세요.
- Lighthouse JSON 보고서 파일 (예: `npx lighthouse <url> --output json --output-path ./report.json`, 또는 Chrome DevTools MCP CLI의 `npx -p chrome-devtools-mcp chrome-devtools lighthouse_audit --output-format=json`)
- PageSpeed Insights JSON 응답 (Lighthouse와 CrUX를 포함)
- CrUX API 응답 (`CRUX_API_KEY` 또는 `GOOGLE_API_KEY` 필요)
- DevTools 성능 트레이스
- 라이브 URL과, 하네스에 설정된 `chrome-devtools` MCP 서버 (에이전트가 `lighthouse_audit`와 `performance_*` 도구로 지표를 직접 수집할 수 있음)
- 로컬에서 호출하는 Chrome DevTools MCP CLI (`npx -p chrome-devtools-mcp chrome-devtools <tool>`, 또는 `npm i -g chrome-devtools-mcp` 이후). 사용자는 `chrome-devtools lighthouse_audit --output-format=json` 같은 명령을 실행하고 JSON 출력을 에이전트에 넘깁니다

**빠른 모드 (Quick)**: 위에 해당하는 것이 없을 때의 기본입니다. 에이전트는 소스 코드에서 구조적 안티패턴을 찾고, 모든 발견에 `potential impact`라고 표시합니다.

## 감사 실행

`web-performance-auditor` 서브에이전트를 생성하세요. 다음을 명시적으로 넘기세요.

- 리뷰 대상 파일, 컴포넌트, 또는 diff
- 아티팩트 경로 (Lighthouse JSON, PSI JSON, CrUX 응답, 트레이스) 또는 붙여 넣은 JSON 내용
- 알 수 있을 때의 대상 URL 또는 페이지 이름
- 기대하는 모드 (Quick 또는 Deep). Deep를 의도했다면, 빠진 입력을 에이전트가 드러내게 하세요

서브에이전트는 스코어카드(출처가 있는 값만 채움), 순위가 매겨진 발견 목록, 긍정적인 관찰, 선제적 권고를 반환합니다.

## 출력

전체 감사 보고서를 사용자에게 반환하세요. 종합이나 병합 단계는 필요 없습니다. 이 명령은 페르소나 하나입니다.
