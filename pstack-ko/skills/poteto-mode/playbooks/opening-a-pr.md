### PR 열기

다른 모든 플레이북의 끝에 호출됩니다.

**워크트리.** main에서 git 워크트리로 작업. 하위 에이전트가 상속. 같은 브랜치에 대한 여러 `Task` 호출은 각각 자체 워크트리를 얻거나, 그들 사이에 `git fetch && git reset --hard origin/<branch>`. 관련 없는 작업이 있는 더러운 브랜치: 패치 아웃, 새 워크트리, 적용. 엉킨 워크트리: main에서 재설정, 최소한으로 재수행.

**커밋.** 자유롭게 커밋. PR을 열기 전에 작고 정렬된 커밋으로 리베이스. 각 커밋은 미래의 PR: 착륙 가능, 이야기를 전하도록 정렬. 수정이 방금 만든 커밋에 속할 때 amend. 분리 가능할 때 새 커밋. 커밋 본문은 주제를 재진술하지 않습니다.

**PR들.** 커밋 전 차이에 대해 `cursor-team-kit`의 `/deslop`을 실행하고 리뷰 전 `/no-comments`. `/technical-writing`으로 모든 PR 제목, 설명, 커밋 본문 작성(Diátaxis를 제외한 모든 레이어, STE 어휘 규칙 적용: 행동당 한 단어, 관사 유지, 작동하는 곳에서 `-ing`보다 평범한 동사), 그 다음 `/unslop` 적용.

**제목.** Conventional Commits `type(scope): subject`, 끝 마침표 없음. `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, 또는 `perf` 같은 Type. 범위는 `pstack` 또는 `poteto-mode` 같은 영역. Subject는 짧고, 명령형이며, 하나가 변경을 담을 때 실제 심볼을 명명, 예: `fix(pstack): retarget opening-a-pr babysit trigger`.

**설명.** PR 본문은 차이를 가진 리뷰어를 위한 1분 브리핑이지 실험실 노트북이 아닙니다. 변경이 왜 존재하는지, 무엇을 빠뜨렸는지, 무엇을 깰 수 있는지, 어떻게 작동을 증명했는지 말합니다. 식별자가 적고, 텍스트 벽이 없는 짧고 단순한 문장 작성. 본문은 squash 커밋 본문이 되므로, 그 커밋을 약 40줄 이하로 유지. 이 순서로 `##` 헤딩 사용, 굵은 리드인 아님, 할 말이 없는 섹션은 삭제:

- `## Why`: 문제와 접근 방식, 1-3개의 짧은 문장. SHA, 리베이스 계보, 또는 "main 기반" 서문 없음.
- `## What changed`: 1-3개의 짧은 불릿. 변경을 담을 때만 실제 심볼이나 경로 명명. 이름 변경이나 재타깃의 양쪽을 명명.
- `## Scope`: 항상. 커버하는 것과 의도적으로 빠뜨린 것(후속 조치, 알려진 갭)에 대한 1-3개의 짧은 항목. 심볼, 경로, 또는 파일별 에세이 없음.
- `## Tradeoffs`: 리뷰어가 달리 물어볼 거부된 대안만. 진짜 선택이 없었을 때 건너뜀.
- `## Blast Radius`: 누구 또는 무엇을 건드리는지, 왜 안전하거나 위험한지에 대한 1-2 문장. main이 빨간색이면, 빨간색으로 두는 비용을 진술.
- `## Verification`: 1-3개의 불릿, 각각 실제 실행 경로와 그 결과. 성능: 단위가 있는 하나의 주요 숫자, `before → after`, 나머지에 대한 arena 또는 swarm 디렉토리 링크. 샘플 크기 방법론, swarm 낭송, 또는 메트릭 테이블 없음.

섹션 후, 주장을 증명할 때 비디오나 스크린샷 첨부. 전체 SHA, swarm 또는 arena 레인 낭송, 레버 수정 에세이, 파일별 체크리스트, "CLEAN" 판정은 본문이 아니라 링크된 아티팩트에.

**Forge.** 첫 PR 작업 전에 forge를 해결하고 생성, 편집, 보기, 감시, 병합에 대해 그 선택을 유지. GitHub CLI(`gh`)가 기본입니다. `command -v origin`이 성공하고 Origin이 리포지토리를 해결할 수 있으면, `origin pr ...`을 선호. Origin이 없거나 리포지토리를 해결할 수 없으면, `gh`에 머물고 폴백을 기록. Graphite(`gt`)를 요구하지 마세요.

**내장 PR 도구.** 실행이 내장 PR 도구를 제공할 때, 생성, 편집, 재타깃, 준비 표시를 그것을 통해, 절대 forge CLI를 통하지 않음. CLI로 만든 PR은 도구가 추적하는 것을 놓칩니다. 도구가 커버하지 않는 모든 것에 대해 해결된 forge를 사용하고, 실행에 그러한 도구가 없을 때 모든 PR 작업에 사용.

**크기와 스택.** 하나의 큰 PR보다 5개의 좁은 PR을 선호. 스택은 base-branch 체인입니다. 루트 PR은 trunk를 타깃. 각 자식 브랜치는 부모의 정확한 팁에 리베이스하고 그 PR은 부모 브랜치를 타깃. 부모가 병합되면, `playbooks/shipping.md` 4단계에 따라 그 자식을 trunk로 옮기세요. 내장 PR 도구 없이, 해결된 forge에 따라, `origin pr create --status open --base <parent-branch>` 또는 `gh pr create --base <parent-branch>`로 자식 생성, `origin pr edit <pr> --base <parent-branch>` 또는 `gh pr edit <pr> --base <parent-branch>`로 하나 재타깃. 독립적인 작업에 대해서만 trunk에서 브랜치. 실질적인 스택 작업 전 trunk에 리베이스.

**준비 상태.** 모든 PR을 초안이 아니라 준비 상태로 여세요. 내장 PR 도구가 초안을 기본값으로 할 수 있으므로, 그것을 통한 모든 생성 호출에 `draft: false` 설정. Origin으로는 `--status open` 전달. `gh`로는 `--draft` 생략. PR이 여전히 초안으로 열리면, PR 도구를 통해, 또는 해결된 forge에 따라 `origin pr ready <number>` 또는 `gh pr ready <number>`를 실행하여 준비 표시. PR 상태를 참조하기 전에 `origin pr view <number>` 또는 `gh pr view <number>` 실행.

**돌보기.** PR을 여는 것은 babysit을 시작하지 않습니다. URL을 게시하고 계속 빌드. 먼저 단계나 스택을 완료. 전체 스택이 존재한 후 사용자가 요청할 때만 별도의 babysit 패스 실행. 각 새 PR에 대한 babysit은 빌드를 정체시키고 나중 웨이브가 재시작하는 커밋에 검사를 소비합니다. 피드백이 의도에서 드리프트할 때 반박.

PR을 여는 하위 에이전트는 `/deslop`과 `/no-comments`를 실행하고 URL을 게시합니다. Autopilot-full 또는 Autopilot-stack 소유자가 아닌 한, babysit 없이 부모에게 반환합니다. 그 소유자의 지시는 babysit 루프를 할당하며, `playbooks/babysit.md`가 기다리는 요청입니다. 소유자는 코드 준비 보고서 후 루프를 시작하고, 병합 준비를 보고하며, 여기와 `playbooks/babysit.md`에서 전체 스택이 빌드될 때까지 돌보기를 보류하는 규칙에서 면제됩니다.
