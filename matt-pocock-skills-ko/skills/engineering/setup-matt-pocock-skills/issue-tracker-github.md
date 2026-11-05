# Issue tracker: GitHub

이 저장소의 이슈와 스펙은 GitHub 이슈로 존재합니다. 모든 작업에 `gh` CLI를 사용하세요.

## 규칙

- **이슈 생성**: `gh issue create --title "..." --body "..."`. 다중 줄 본문에 heredoc을 사용하세요.
- **이슈 읽기**: `gh issue view <number> --json number,title,body,labels,comments`.
- **이슈 목록**: 적절한 `--label` 및 `--state` 필터와 함께 `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`.
- **이슈를 부모의 하위 이슈로 만들기**: `gh issue create --parent <parent> ...`, 또는 나중에 `gh issue edit <parent> --add-sub-issue <child>` (`gh` 2.94+). 이전 `gh`: `gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>` (아래 **Blocking**에서처럼 database id). 하위 이슈가 없으면, 자식 본문 맨 위에 `Part of #<parent>`를 넣으세요.
- **Blocking**: GitHub의 **네이티브 이슈 의존성**, 정식, UI에 보이는 표현. `gh issue create --blocked-by <n>,<n> ...` 또는 `gh issue edit <child> --add-blocked-by <blocker>` (`gh` 2.94+)로 엣지를 추가하세요. 이전 `gh`: `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, 여기서 `<blocker-db-id>`는 차단자의 숫자 **database id**입니다 (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, `#number`나 `node_id`가 _아닙니다_). 의존성을 사용할 수 없는 경우, 자식 본문 맨 위에 `Blocked by: #<n>, #<n>` 줄로 대체하세요. 티켓은 모든 차단자가 닫힐 때 차단 해제됩니다.
- **열린 차단자 세기**: `gh api repos/<owner>/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by` (열린 차단자만; 0은 시작 가능). `gh issue view <n> --json blockedBy`도 닫힌 차단자를 나열하므로, 필터링하세요: `--jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`.
- **이슈에 댓글**: `gh issue comment <number> --body "..."`
- **레이블 적용 / 제거**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **닫기**: `gh issue comment <number> --body "..."`로 설명을 게시한 다음, `gh issue close <number>`. 이미 닫힌 이슈에서 `gh issue close --comment`는 댓글을 드롭하고 여전히 0으로 종료합니다.

`git remote -v`에서 저장소를 추론하세요; `gh`는 클론 내부에서 실행될 때 자동으로 이를 수행합니다.

사용자의 자체 저장소에만 이슈를 제출하세요. 사용자가 소유하지 않는 한 `mattpocock/skills`(이 스킬이 온 저장소)에 제출하지 마세요. 포크에서 `gh`는 업스트림 부모를 기본으로 할 수 있으므로, 세션의 첫 번째 `gh issue create` 전에 `gh repo view --json nameWithOwner`로 대상을 확인하고 사용자의 저장소가 아니면 사용자와 확인하세요.

## 트리아지 표면으로서의 풀 리퀘스트

**요청 표면으로서의 PR: no.** _(이 저장소가 외부 PR을 기능 요청으로 처리하는 경우 `yes`로 설정; `/triage`가 이 플래그를 읽습니다.)_

`yes`로 설정되면, PR은 `gh pr` 동등물을 사용하여 이슈와 동일한 레이블과 상태를 거칩니다:

- **PR 읽기**: `gh pr view <number>`, 그다음 `gh pr view <number> --comments` (TTY 밖에서, `--comments`는 본문이 아니라 댓글만 출력), 그리고 diff에 대해 `gh pr diff <number>`.
- **트리아지를 위한 외부 PR 목록**: `gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`.
- **댓글 / 레이블 / 닫기**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub는 이슈와 PR에 걸쳐 하나의 번호 공간을 공유하므로, 단독 `#42`는 둘 중 하나일 수 있습니다: `gh pr view 42`로 해결하고 `gh issue view 42`로 대체하세요.

## 스킬이 "이슈 트래커에 게시"라고 말할 때

GitHub 이슈를 생성하세요.

## 스킬이 "관련 티켓 가져오기"라고 말할 때

위의 **이슈 읽기**처럼 읽으세요.

## 웨이파인딩 작업

`/wayfinder`에서 사용됩니다. **map**은 티켓으로 **자식** 이슈를 가진 단일 이슈입니다.

- **Map**: Notes / Decisions-so-far / Fog 본문을 보유하는 `wayfinder:map`으로 레이블이 지정된 단일 이슈. `gh issue create --label wayfinder:map`.
- **자식 티켓**: GitHub 하위 이슈로 맵에 연결된 이슈 (**이슈를 부모의 하위 이슈로 만들기** 참조). 하위 이슈가 활성화되지 않은 경우, 맵 본문의 작업 목록에 자식을 추가하고 자식 본문 맨 위에 `Part of #<map>`을 넣으세요. 레이블: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). 클레임되면, 티켓이 구동 개발자에게 할당됩니다.
- **Blocking**: 규칙 아래의 **Blocking** 참조.
- **프론티어 쿼리**: 맵의 열린 자식을 나열하고 (`gh issue list --state open`, 맵의 하위 이슈 / 작업 목록으로 범위 지정), 열린 차단자(**열린 차단자 세기** 참조, 또는 `Blocked by` 줄의 열린 이슈) 또는 담당자가 있는 것을 드롭하세요; 맵 순서의 첫 번째가 승리합니다.
- **클레임**: `gh issue edit <n> --add-assignee @me`, 세션의 첫 번째 쓰기.
- **해결**: `gh issue comment <n> --body "<answer>"`, 그다음 `gh issue close <n>`, 그다음 맵의 Decisions-so-far에 컨텍스트 포인터 (gist + 링크)를 추가합니다.
