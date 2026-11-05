# Issue tracker: GitLab

이 저장소의 이슈와 스펙은 GitLab 이슈로 존재합니다. 모든 작업에 [`glab`](https://gitlab.com/gitlab-org/cli) CLI를 사용하세요.

## 규칙

- **이슈 생성**: `glab issue create --title "..." --description "..."`. 다중 줄 설명에 heredoc을 사용하세요. 에디터를 열려면 `--description -`를 전달하세요.
- **이슈 읽기**: `glab issue view <number> --comments`. 기계 판독 가능 출력에 `-F json`을 사용하세요.
- **이슈 목록**: 적절한 `--label` 필터와 함께 `glab issue list -O json`.
- **이슈에 댓글**: `glab issue note <number> --message "..."`. GitLab은 댓글을 "notes"라고 부릅니다.
- **레이블 적용 / 제거**: `glab issue update <number> --label "..."` / `--unlabel "..."`. 여러 레이블은 쉼표로 구분하거나 플래그를 반복하여 지정할 수 있습니다.
- **닫기**: `glab issue close <number>`. `glab issue close`는 닫는 댓글을 허용하지 않으므로, 먼저 `glab issue note <number> --message "..."`로 설명을 게시한 다음 닫으세요.
- **병합 요청**: GitLab은 PR을 "병합 요청"이라고 부릅니다. `glab mr create`, `glab mr view`, `glab mr note` 등을 사용하세요. `gh pr ...`과 동일한 형태이지만 `pr` 대신 `mr`, `comment`/`--body` 대신 `note`/`--message`입니다.

`git remote -v`에서 저장소를 추론하세요; `glab`는 클론 내부에서 실행될 때 자동으로 이를 수행합니다.

## 트리아지 표면으로서의 병합 요청

**요청 표면으로서의 MR: no.** _(이 저장소가 외부 병합 요청을 기능 요청으로 처리하는 경우 `yes`로 설정; `/triage`가 이 플래그를 읽습니다.)_

`yes`로 설정되면, MR은 `glab mr` 동등물을 사용하여 이슈와 동일한 레이블과 상태를 거칩니다:

- **MR 읽기**: `glab mr view <number> --comments` 그리고 diff에 대해 `glab mr diff <number>`.
- **트리아지를 위한 외부 MR 목록**: `glab mr list -O json`, 그다음 작성자가 프로젝트 구성원/소유자가 아닌 MR만 유지합니다 (유지 관리자의 진행 중 작업이 아니라 기여자의 MR).
- **댓글 / 레이블 / 닫기**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

GitHub와 달리, GitLab은 이슈와 MR을 별도로 번호를 매기므로, 유지 관리자가 의미하는 표면을 알면 `#42`는 명확합니다.

## 스킬이 "이슈 트래커에 게시"라고 말할 때

GitLab 이슈를 생성하세요.

## 스킬이 "관련 티켓 가져오기"라고 말할 때

`glab issue view <number> --comments`를 실행하세요.

## 웨이파인딩 작업

`/wayfinder`에서 사용됩니다. **map**은 티켓으로 **자식** 이슈를 가진 단일 이슈입니다.

- **Map**: Notes / Decisions-so-far / Fog 본문을 보유하는 `wayfinder:map`으로 레이블이 지정된 단일 이슈. `glab issue create --label wayfinder:map`. (네이티브 epic이 있는 GitLab 티어에서는 epic이 대신 맵을 보유할 수 있습니다; 레이블이 지정된 이슈는 모든 곳에서 작동합니다.)
- **자식 티켓**: 설명 맨 위에 `Part of #<map>`을 가지고, 맵에 연결되고 (`glab issue create --linked-issues <map> --link-type relates_to`), 레이블 `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`)을 가진 이슈. 클레임되면, 티켓이 구동 개발자에게 할당됩니다.
- **Blocking**: GitLab의 **네이티브 차단 링크**, 정식, UI에 보이는 표현. 노트로 게시된 `/blocked_by #<n>` 빠른 작업으로 추가하세요 (`glab issue note <child> --message "/blocked_by #<blocker>"`). 네이티브 차단 링크는 Premium/Ultimate 기능입니다; 무료 티어(또는 사용할 수 없는 곳)에서는 설명 맨 위에 `Blocked by: #<n>, #<n>` 줄로 대체하세요. 티켓은 모든 차단자가 닫힐 때 차단 해제됩니다.
- **프론티어 쿼리**: `glab api projects/:id/issues/<map>/links`로 맵의 자식을 나열하고, `wayfinder:<type>` 레이블을 가진 열린 이슈를 유지하세요; 열린 차단자가 있는 것을 드롭하세요: 열린 이슈에 대한 네이티브 `blocked_by` 링크 (`glab api projects/:id/issues/<child-iid>/links`), 또는 `Blocked by` 줄의 열린 이슈, 또는 담당자; 맵 순서의 첫 번째가 승리합니다.
- **클레임**: `glab issue update <n> --assignee @me`, 세션의 첫 번째 쓰기.
- **해결**: `glab issue note <n> --message "<answer>"`, 그다음 `glab issue close <n>`, 그다음 맵의 Decisions-so-far에 컨텍스트 포인터 (gist + 링크)를 추가합니다.
