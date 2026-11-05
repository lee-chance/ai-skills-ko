### 워크트리와 시뮬레이터 정리

1. 스냅샷과 감사. `df -h /`를 기록한 다음 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]` 실행(principle-build-the-lever). `-b` 없이는 `origin/HEAD`에 대해 `MERGED`를 검사하므로, PR이 다른 브랜치를 타깃할 때 `-b origin/<branch>` 전달. `git worktree list`에서 경로를 읽되, 절대 수동 타이핑하지 않습니다. 수동 타이핑된 `myrepo-worktrees/x`는 `.cursor/worktrees/myrepo/x`에 있는 것을 놓치기 때문입니다(principle-encode-lessons-in-structure). 크기, 나이, 병합 상태, 커밋되지 않은 작업, PR 상태, 그것을 건드린 가장 새 채팅으로 각 워크트리를 분류한 다음 버킷을 제안합니다. 대화록 스캔은 느리므로 백그라운드.
2. 버킷은 허가가 아니라 조언입니다. 고정되고 활성화된 채팅이 실제 아티팩트입니다(principle-prove-it-works). 사용자나 사이드바에서 그 세트를 얻고 모든 후보를 교차 검사. 레버가 사용자가 고정한 워크트리를 `safe`로 표시했으므로, 고정된 세트가 이깁니다.
3. 삭제 전에 사용을 검증. 모든 `verify-recent-chat` 행, 또는 의심하는 것에 대해, 하위 에이전트를 팬아웃하여 대화록을 읽고 채팅이 고정되거나 진행 중인지, 어떤 워크트리를 건드리는지 보고(principle-guard-the-context-window, 대화록은 대량). 고정된 채팅은 백그라운드 하위 에이전트를 통해 형제 워크트리에 arena와 repro 트리를 생성하며, 그것들의 이름이 절대 사이드바에 히트하지 않더라도 사용 중입니다. 하위 에이전트 섹션에 따라 각 하위 에이전트의 추론 수준과 빠름 또는 표준 속도를 작업에 맞게 선택하세요.
4. 되돌릴 수 없는 손실에서 일시정지. `wip:N`은 N개의 추적된 커밋되지 않은 편집입니다. 차이를 보여주고 먼저 결정을 얻으세요. 깨끗한 워크트리를 제거하는 것은 브랜치로부터 복구 가능하지만 커밋되지 않은 작업은 사라지기 때문입니다. `scratch:N`은 추적되지 않은 일회용, 삭제해도 안전하지만 파일을 명명하세요. 자율성에 따라, 깨끗하고 병합되었으며 사용 중이 아니면 진행. `wip`과 사용 중은 일시정지.
5. 확인된 세트를 정리. 경로당, `git worktree remove --force <path>`. 디렉토리가 무시된 빌드 아티팩트에서 살아남으면, `rm -rf`하고, 그 다음 `git worktree prune`. 브랜치 ref는 살아남으므로, 커밋은 잃지 않습니다. `df -h /`로 확인하고 재목록.
6. 시뮬레이터와 다른 회수자. 시뮬레이터는 보통 다음으로 큰 승리입니다. `xcrun simctl --set testing delete all`(XCTestDevices 클론), `xcrun simctl delete unavailable`, `xcrun simctl runtime list` 그 다음 오래된 런타임에 대해 `runtime delete <id>`. 필요할 때 더: Xcode `DerivedData`와 `iOS DeviceSupport`, `~/Library/Application Support/Cursor`(`state.vscdb.backup`, 그리고 작업공간으로 열었던 폴더에 명명된 `<root>`가 부풀어오르는 `snapshots/roots/<root>`), 패키지 캐시(pnpm, uv, brew, yarn). 사용자가 보관하라고 말하지 않은 캐시만 지우세요.

이것은 미끄러짐을 잡을 코드 리뷰 없이 사용자 상태를 삭제하는 유일한 플레이북이므로, 위 게이트가 리뷰입니다.

**답변:** 회수된 공간과 함께 이전과 이후의 `df -h /`, 정리된 워크트리, 각각 보류된 것에 대한 한 줄 이유(어느 채팅에서 사용 중, 또는 커밋되지 않은 작업).
