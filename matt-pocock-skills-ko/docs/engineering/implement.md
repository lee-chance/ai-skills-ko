## 무엇을 하나요

`implement`는 이미 결정된 작업을 빌드합니다. [티켓](https://www.aihero.dev/ai-coding-dictionary/ticket), [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 또는 대화에서 방금 합의한 계획을 가리키면, 코드를 작성하고, 심에서 [tdd](https://aihero.dev/skills-tdd)를 구동하고, 진행하면서 타입체크하고, 끝에 [code-review](https://aihero.dev/skills-code-review)를 실행하고, 현재 브랜치에 커밋합니다.

계획을 다시 열지 않습니다. 인터뷰, 명확화 라운드, 다른 접근 방식 제안이 없습니다. 업스트림에서 정착된 것은 입력이며, 스킬의 전체 작업은 그것을 커밋으로 전환하는 것입니다. 그것이 빌드하는 동안 작업을 재설계하는 경우가 많은 새로운 [에이전트](https://www.aihero.dev/ai-coding-dictionary/agent)에 "이것을 빌드하세요"라고 입력하는 것과 구분되는 것입니다.

## 언제 사용하나요

직접 `/implement`를 입력하여 호출하며, 에이전트는 스스로 이를 찾지 않습니다. `disable-model-invocation: true`와 함께 제공되므로 다른 스킬도 호출할 수 없습니다. [ask-matt](https://aihero.dev/skills-ask-matt) 또는 [to-tickets](https://aihero.dev/skills-to-tickets)가 "그런 다음 티켓당 `/implement`"라고 말하는 곳은 여러분에 대한 지침이며, 에이전트가 프롬프트 없이 수행할 것이 아닙니다.

작업이 현재 어디에 있는지가 이것이 올바른 스킬인지 결정합니다:

| 작업은… | 찾아야 할 것 |
| --- | --- |
| 트래커의 티켓 | `/implement #42`, [세션](https://www.aihero.dev/ai-coding-dictionary/session)당 하나의 티켓, 티켓 사이에 컨텍스트 [지우기](https://www.aihero.dev/ai-coding-dictionary/clearing) |
| spec, 아직 분할되지 않음, 빌드가 세션에 걸쳐 있음 | 먼저 [to-tickets](https://aihero.dev/skills-to-tickets), 그런 다음 티켓당 `/implement` |
| spec, 빌드가 작음 | spec에 대해 직접 `/implement` |
| 방금 한 대화에만 있음, 여전히 작음 | 동일한 창에서 바로 거기 `/implement` |
| 아직 어디에도 작성되지 않음 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), 코드베이스가 없으면 [grill-me](https://aihero.dev/skills-grill-me) |
| spec 없이 테스트 우선으로 원하는 구체적인 동작 하나 | 직접 [tdd](https://aihero.dev/skills-tdd) |
| 이미 빌드되었고 확인하고 싶음 | 직접 [code-review](https://aihero.dev/skills-code-review) |

스킬 자체의 첫 줄이 다루지 않기 때문에 동일 세션 경우는 지목할 가치가 있습니다. `SKILL.md`는 "spec 또는 티켓"이라고 말하며, 이는 [모델](https://www.aihero.dev/ai-coding-dictionary/model)이 존재하지 않는 파일을 찾도록 푸시합니다. 계획이 스레드에만 있으면 호출할 때 그렇게 말하세요.

## 전제 조건

`implement`는 여러분이 있는 브랜치에 커밋합니다. 생성하지 않으며 묻지도 않습니다. 시작하기 전에 작업을 원하는 브랜치에 있는지 확인하세요.

티켓이 [to-tickets](https://aihero.dev/skills-to-tickets)에서 나온 경우, [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)가 그들이 사는 트래커를 구성했습니다. `code-review`는 종료 시 원래 spec을 찾기 위해 동일한 구성을 읽습니다.

## 한 번의 실행이 하는 것

실행에는 순서대로 다섯 단계가 있습니다:

1. 티켓 또는 spec을 읽고 심을 해결합니다.
2. 사전 합의된 심에서 [tdd](https://aihero.dev/skills-tdd)를 구동하고, 한 번에 하나의 red-green 슬라이스.
3. 자주 타입체크하고, 진행하면서 단일 테스트 파일을 실행합니다.
4. 끝에 전체 테스트 스위트를 한 번 실행합니다.
5. [code-review](https://aihero.dev/skills-code-review)를 실행한 다음 현재 브랜치에 커밋합니다.

한 번의 실행은 하나의 티켓을 다룹니다. [to-tickets](https://aihero.dev/skills-to-tickets)가 생성하는 티켓은 단일 새로운 [컨텍스트 창](https://www.aihero.dev/ai-coding-dictionary/context-window)에 맞도록 크기가 조정된 tracer-bullet 수직 슬라이스이므로, 의도된 리듬은: 컨텍스트 지우기, 하나의 티켓 구현, 커밋, 다시 지우기입니다. 각 티켓은 독립적이므로 이전 티켓의 컨텍스트를 버릴 수 있습니다.

## 사전 합의된 심

스킬의 핵심 아이디어는 **심**입니다. 내부에 도달하지 않고 동작을 관찰하는 공개 경계입니다. 테스트는 심에 있습니다. 코드가 존재하기 전에 심이 합의되면 테스트는 지속되고, 변경하지 않고 아래의 구현을 다시 작성할 수 있습니다.

"사전 합의된" 부분은 중요하며, 스킬의 가장 약한 지점이기도 합니다. `implement` 내에서 심에 동의하는 것은 없습니다. `tdd`가 묻는 스킬이며, 확인되지 않은 심에서 테스트를 작성하는 것을 거부합니다. 따라서 실제로 합의는 업스트림 spec에서 또는 실행의 첫 번째 교환에서 발생합니다. 아무 곳에서도 발생하지 않으면 실행은 "그냥 코드를 작성"이 되고 아무것도 경고하지 않습니다. spec에서 심을 지목하는 것이 그것을 중지시킵니다.

## 자주 묻는 질문

**완료되었지만 내 티켓은 여전히 열려 있고 승인 기준은 여전히 확인되지 않았습니다.**

맞고 예상됩니다. `implement`에는 완료 단계가 없습니다. 커밋에서 끝나고 작업 항목을 절대 터치하지 않습니다. 이것은 GitHub Issues와 로컬 markdown 트래커에서 동일하므로 트래커 통합 문제가 아닙니다. 또한 `code-review`가 생성한 발견 사항에 대해 행동하지 않으며 원래 이슈의 `- [ ]` 상자를 체크하지 않습니다. 티켓을 닫고 기준을 스스로 조정하세요. 이것은 종속성 체인에서 가장 중요합니다. `to-tickets`는 프론티어를 차단자가 모두 닫힌 티켓으로 정의하기 때문입니다. 아무것도 닫히지 않으면 아무것도 눈에 띄게 차단 해제되지 않습니다.

**모든 티켓을 한 번에 가리킬 수 있나요, 아니면 여러 개를 병렬로 실행할 수 있나요?**

`/implement`로는 아닙니다: 한 번의 호출, 하나의 티켓. 한 번의 실행에서 전체 spec의 경우 [implement-spec](https://aihero.dev/skills-implement-spec)을 사용하세요. 준비 프론티어의 각 티켓을 자체 worktree의 [서브에이전트](https://www.aihero.dev/ai-coding-dictionary/subagent)에 제공한 다음 결과를 하나의 통합 브랜치로 병합합니다. 하나의 체크아웃에서 여러 `/implement` 세션을 나란히 실행하는 것은 지원되지 않는 것보다 나쁩니다. 한 현장 보고서는 한 세션의 `git commit --amend`가 다른 세션의 커밋에 착륙하고, `refs/stash`에서 stash가 사라지고, 세 개의 이슈에 걸쳐 단일 오후에 모두 잘못된 브랜치에 커밋이 착륙하는 것을 설명합니다. 세션은 하나의 작업 디렉토리, 하나의 인덱스 및 하나의 HEAD를 공유합니다. 사용자는 git worktree로 이를 해결하지만 `refs/stash`는 worktree에 걸쳐 공유되므로 worktree만으로는 stash 경우를 수정하지 못합니다.

**커밋하는 대신 풀 리퀘스트를 열 수 있나요?**

내장되지 않았습니다. 현재 브랜치에 직접 커밋합니다. 여러 사람은 코드가 작동하는지 확인할 수 있기 전에 착륙하기 때문에 이것이 너무 열렬하다고 생각합니다. 구성 플래그와 PR 모드가 없습니다. 사람들은 호출에서 오버라이드합니다("브랜치에 커밋하고 PR을 여세요") 또는 스킬의 로컬 사본을 편집하여. 에이전트가 PR을 작성할 때 [pr](https://aihero.dev/skills-pr)이 본문을 형성합니다.

**`code-review`가 내 변경 사항을 볼 수 없다고 말합니다.**

`code-review`는 스테이징 및 작업 트리 변경 사항을 제외하는 `git diff <fixed-point>...HEAD`를 검토합니다. `implement`는 커밋하기 전에 실행하므로 중간 커밋이 이미 존재하지 않는 한 해당 diff에 검토할 것이 없습니다. 여러 사람이 이를 보고했고 양쪽 모두 수정되지 않았습니다. 먼저 커밋한 다음 분기한 지점에 대해 검토하세요.

별도로, 일부 사람들은 방금 작성한 코드를 검토하는 에이전트가 자체 솔루션에 편향되어 있기 때문에 실행 내부에서 검토를 전혀 원하지 않습니다. 새로운 세션에서 고정 지점에 대해 [code-review](https://aihero.dev/skills-code-review)를 실행하는 것은 유효한 대안입니다. 같은 편향이 해당 스킬이 별도의 서브에이전트에서 두 축을 실행하는 이유입니다.

**하나의 티켓이 150k 토큰을 소모했습니다. 잘못 사용하고 있나요?**

아마 아닐 것입니다. 티켓이 너무 클 가능성이 더 높습니다. 실행은 코드베이스 탐색, 심당 red-green 루프, 전체 스위트 및 리뷰를 수행하므로 100k [토큰](https://www.aihero.dev/ai-coding-dictionary/token)을 초과하는 비자명한 티켓은 무언가가 깨졌다는 신호가 아니라 정상입니다. 수정은 업스트림입니다. [to-tickets](https://aihero.dev/skills-to-tickets)에서 티켓의 크기를 적절하게 조정하여 각각이 하나의 새로운 창에 맞도록 하세요. 단일 티켓이 계속 초과하면 [노력](https://www.aihero.dev/ai-coding-dictionary/effort) 수준을 높이는 대신 분할하세요.

**새로운 세션에서 `/implement #2`가 완전히 관련 없는 것에 대해 작업했습니다.**

에이전트는 구성된 트래커가 아니라 todo 파일 또는 체크리스트와 같은 컨텍스트의 다른 번호 매겨진 목록에 대해 `#2`를 해결했습니다. `implement`는 이제 이슈 트래커에서 전달된 참조를 가져와 시작하기 전에 제목을 명시하고, 참조가 모호할 때 묻습니다. 제목이 의도한 티켓과 일치하는지 확인하세요. 이슈 URL 또는 `owner/repo#2`를 전달하면 모호성이 완전히 제거됩니다.

## 제대로 작동하고 있다면

- 세션이 티켓이나 스펙을 읽고 무엇을 빌드할지 재진술하며 시작하며, 무엇을 빌드할지 묻지 않습니다.
- trace에 단지 diff에 테스트가 나타나는 것이 아니라 실제 `tdd` Skill 도구 호출이 보입니다.
- 실행 중에 타입체크와 단일 테스트 파일이 반복적으로 실행되고, 전체 스위트는 끝 무렵에 한 번 실행됩니다.
- 계속 진행하라고 프롬프트하지 않아도 실행이 현재 브랜치의 커밋에 도달합니다.
- diff가 한 티켓 분량의 변경입니다: 여러 티켓을 함께 묶은 것이 아니라 모든 레이어를 관통하는 수직 슬라이스입니다.

## 어디에 적합한지

`implement`는 메인 체인의 빌드 단계입니다:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

인접한 스킬로는 [to-tickets](https://aihero.dev/skills-to-tickets)가 있으며, 이는 소비할 티켓을 생성하고 순서를 결정하는 차단 엣지를 선언합니다; [tdd](https://aihero.dev/skills-tdd)는 각 심에서 내부적으로 구동합니다; 그리고 [code-review](https://aihero.dev/skills-code-review)는 커밋하기 전에 실행합니다. 이는 계획 스킬의 다운스트림에 위치하며 그들을 신뢰합니다. 전달받은 것의 형태를 재검증하지 않으므로, 잘못 구조화된 맵이나 수평으로 계층화된 티켓도 작성된 대로 빌드됩니다.

이러한 신뢰가 [wayfinder](https://aihero.dev/skills-wayfinder)가 맵을 `implement`로 직접 루프하는 것이 아니라 [to-spec](https://aihero.dev/skills-to-spec)에서 체인에 합류하는 이유입니다. 노력이 작은 것으로 판명되었을 때만 맵에서 `implement`로 직접 진행하세요.

[ask-matt](https://aihero.dev/skills-ask-matt)는 어떤 흐름에 있는지 확실하지 않을 때 전체 세트에 대한 라우터입니다.
