### PR 열기

다른 모든 플레이북의 끝에 호출됩니다.

trunk에서 git 워크트리로 작업하고, 관련 없는 작업은 그 안에 두지 마세요. 작고 착륙 가능한 커밋으로 리베이스하세요. 커밋 전에 차이에 대해 `cursor-team-kit`의 `/deslop`을 실행하세요.

제목: `type(scope): subject`이며, 변경을 담당하는 실제 심볼이 있으면 그 이름을 쓰세요. 본문: 40줄 미만의 1분 브리핑이며, 다음 `##` 제목을 순서대로 사용하고 비어 있는 것은 뺍니다: `## Why`, `## What changed`, `## Scope`, `## Tradeoffs`(리뷰어가 그렇지 않으면 물어볼 기각된 대안만), `## Blast Radius`, `## Verification`.

후속 조치는 베이스 브랜치로 스택하세요. PR은 `draft: false`로 실행의 PR 도구를 통해 준비 상태로 여세요. PR 도구가 없으면 `--draft` 없이 `gh pr create`를 사용하거나, Origin의 CLI가 리포지토리를 해결할 수 있으면 `origin pr create --status open`을 사용하세요. PR을 여는 것이 돌보기를 시작하지는 않습니다.
