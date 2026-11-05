# 세션 컨텍스트 감사

이 저장소는 TypeScript 서비스입니다. 현재 에이전트 세션은 시작할 때
`docs/archive/` 디렉터리 전체(파일 1,800개), 생성된 API 출력, 오래된
인시던트 기록 여섯 건, 모든 ADR을 불러옵니다. 활성
`CONTRIBUTING.md`나 `docs/current-architecture.md`는 불러오지 않습니다.

관찰된 실패:

- 새 소스는 TypeScript여야 하는데도 응답이 JavaScript를 권합니다.
- 테스트는 Jest로 제안되지만, 이 프로젝트는 Vitest를 씁니다.
- 에이전트는 데이터베이스 접근이 리포지토리에 속한다는 점을 거듭 잊습니다.
- 도구 트레이스가 길어지면 답이 일반론이 됩니다.

현재 작업: 기존 HTTP 핸들러 하나에 검증을 추가합니다.
