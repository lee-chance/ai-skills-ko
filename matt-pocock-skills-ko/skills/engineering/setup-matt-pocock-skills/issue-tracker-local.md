# Issue tracker: Local Markdown

이 저장소의 이슈와 스펙은 `.scratch/`의 마크다운 파일로 존재합니다.

## 규칙

- 디렉터리당 하나의 기능: `.scratch/<feature-slug>/`
- 스펙은 `.scratch/<feature-slug>/spec.md`
- 구현 이슈는 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`에 티켓당 하나의 파일, `01`부터 번호 매김, 결코 단일 결합된 티켓 파일이 아님
- 트리아지 상태는 각 이슈 파일 맨 위 근처의 `Status:` 줄로 기록됩니다 (역할 문자열은 `triage-labels.md` 참조)
- 댓글과 대화 기록은 `## Comments` 제목 아래 파일 하단에 추가됩니다

## 스킬이 "이슈 트래커에 게시"라고 말할 때

`.scratch/<feature-slug>/` 아래에 새 파일을 만드세요 (필요한 경우 디렉터리 생성).

## 스킬이 "관련 티켓 가져오기"라고 말할 때

참조된 경로의 파일을 읽으세요. 사용자는 일반적으로 경로나 이슈 번호를 직접 전달합니다.

## 웨이파인딩 작업

`/wayfinder`에서 사용됩니다. **map**은 티켓당 하나의 **자식** 파일을 가진 파일입니다.

- **Map**: `.scratch/<effort>/map.md` (Notes / Decisions-so-far / Fog 본문).
- **자식 티켓**: `.scratch/<effort>/issues/NN-<slug>.md`, `01`부터 번호 매김, 본문에 질문이 있습니다. `Type:` 줄은 티켓 타입을 기록합니다 (`research`/`prototype`/`grilling`/`task`); `Status:` 줄은 `claimed`/`resolved`를 기록합니다.
- **Blocking**: 맨 위 근처의 `Blocked by: NN, NN` 줄. 티켓은 나열된 모든 파일이 `resolved`일 때 차단 해제됩니다.
- **프론티어**: `.scratch/<effort>/issues/`를 스캔하여 열려 있고, 차단되지 않고, 클레임되지 않은 파일을 찾으세요; 번호순 첫 번째가 승리합니다.
- **클레임**: 작업 전에 `Status: claimed`를 설정하고 저장하세요.
- **해결**: `## Answer` 제목 아래에 답을 추가하고, `Status: resolved`를 설정한 다음, `map.md`의 맵의 Decisions-so-far에 컨텍스트 포인터 (gist + 링크)를 추가합니다.
