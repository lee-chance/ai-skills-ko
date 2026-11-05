# 스킬 평가

이 저장소가 스킬이 정말 동작하는지를 재는 방법입니다. 그래야 할 때 **트리거**되는지, 서로 **구분**되는지, 각 스킬이 약속한 대로 **에이전트 행동을 바꾸는지**를 봅니다.

## 선행 사례 (그리고 채택한 것)

`SKILL.md` 스킬을 평가하는, 커뮤니티가 합의한 단일 표준은 없습니다. 앞서는 접근은 두 가지입니다.

- **Anthropic의 skill-creator v2**는 스킬마다 `evals.json`(프롬프트 + `expectations[]`, 트랜스크립트로 채점)을 두고, 샘플 프롬프트로 설명의 트리거 정확도를 시험합니다. 행동 티어에는 그 [`evals.json` 스키마](https://github.com/anthropics/skills/tree/main/skills/skill-creator)를 가져오고, 채점할 아티팩트를 고르는 선택 필드 `kind`를 하나 더합니다.
- **Superpowers**(obra)는 bash + `claude -p` + 프롬프트 픽스처와 채점 스크립트로 스킬을 시험합니다. 우리의 행동 러너도 같은 헤드리스 `claude` 패턴을 따르며, 채점 기준은 `expectations[]`에서 가져옵니다.

둘 다 주지 않는 것이 있습니다. 스킬이 여럿인 *카탈로그*를 **결정적이고 CI에서 안전한** 방식으로 검사하는 일입니다. 각 스킬의 설명이 사용자가 실제로 쓰는 말을 담고 있는지, 두 스킬의 설명이 서로 부딪히는지입니다. 아래 티어 2가 그 검사이고, 이 저장소가 더한 부분입니다.

## 세 티어

| 티어 | 확인하는 것 | 실행 | 비용 |
|---|---|---|---|
| 1. 구조 | 프론트매터, 이름 규칙, 필수 섹션, 레이아웃과 줄 예산, `references/` 링크, 명령 일치, 아티팩트 경로, 매니페스트 버전 | CI (`validate-skills.js`, `validate-reference-links.js`, `validate-commands.js`, `validate-artifact-paths.js`, `validate-versions.js`) | 무료 |
| 2. 트리거와 라우팅 | 긍정 프롬프트는 해당 스킬을 top-k에 올림. 부정 프롬프트는 올리지 않음. 두 설명이 거의 부딪히지 않음 | CI (`run-evals.js --min-rank1 95`) | 무료 |
| 3. 행동 | 스킬을 따르는 에이전트가 `expectations[]`를 충족함 | 요청 시 (`run-evals.js --behavioral`) | 토큰 |

티어 2는 라우팅의 **어휘적 근사**입니다. 설명에 어간을 뽑은 TF-IDF를 씁니다. 의미는 판단하지 못합니다. 의미 판단은 티어 3이 합니다. 대신 실제 트리거 버그의 대부분을 차지하는 두 실패를 잡습니다. 설명이 사용자가 쓰는 말을 빠뜨리는 경우(거짓 음성), 그리고 너무 넓은 설명이 맞는 스킬보다 위에 놓이는 경우(거짓 양성)입니다. 티어 2가 실패하면 보통 평가가 아니라 *설명을 고치라*는 뜻입니다.

## 실행

```bash
# Tier 2 — deterministic, runs in CI
node scripts/run-evals.js
node scripts/run-evals.js --min-rank1 95  # enforce the current routing floor

# Tier 3 — behavioral, runs each eval through headless claude, then grades it
node scripts/run-evals.js --behavioral test-driven-development            # spends tokens
node scripts/run-evals.js --behavioral test-driven-development --dry-run  # prints the plan only
node scripts/run-evals.js --behavioral test-driven-development --eval 1   # run only case 1
```

`--eval <id>`는 정수 `id`(`0` 포함)로 행동 케이스 하나를 고르며,
`--dry-run`과도 함께 씁니다. 알 수 없거나 잘못된 ID는 실행 전에 실패합니다.
선택자를 빼면 이전처럼 모든 케이스를 실행합니다.

티어 3은 행동 아티팩트 종류를 두 가지 지원합니다. `execution`이 기본입니다. 각 평가는 일회용 git 저장소에서 실행됩니다. `files[]`의 실제 프로젝트 입력은 `evals/fixtures/`에서 꺼내 기준선으로 커밋되고, 채점기는 도구 호출을 포함한 `--output-format stream-json --verbose` 실행 트레이스 전체를 판단합니다. `dialogue`는 산출물이 대화 자체인 스킬을 위해 남겨 둡니다. 픽스처가 필요 없고, 채점기는 파일 수정이나 명령을 요구하지 않은 채 어시스턴트의 대화 턴을 판단합니다. `dialogue`라고 적는 것은 사람이 검토한 예외입니다. 실행형 스킬이 빠져나가는 일반 탈출구가 아닙니다.

실행기는 명시적 권한 모드(`--permission-mode acceptEdits`와 미리 승인한 도구 목록)로 돕니다. 그래서 실행 평가는 거절당한 뒤 말만 하는 대신, 실제로 파일을 고치고, 명령을 실행하고, diff를 보고, 커밋을 만들 수 있습니다. 트레이스는 채점기 프롬프트 안에서 신뢰하지 않는 데이터로 가두고, stdin으로 채점기에 넘깁니다. 수 메가바이트가 될 수 있어 argv는 OS 인자 크기 한도에 걸립니다. 실행기와 채점기 호출에는 시간 제한이 있고, 채점기 출력은 `evals/results/`(gitignore됨)에 skill-creator의 `grading.json` 형태로 쓰기 전에 JSON인지 검사합니다. 규율 스킬에는 시간 압박, 매몰 비용, 권위 압박 케이스도 있습니다. 프롬프트가 워크플로우를 건너뛰자고 해도 워크플로우가 유지되는지 확인합니다.

채점기에는 완료된 실행기 스트림만 갑니다. 성공이라는 종료 결과가 분명히 있어야 하고, 권한 거부가 없어야 하며, 모든 도구
호출에 돌아온 관찰이 있어야 합니다. 돌아온 실패 프로브도 완료 전에 회복할 수 있습니다. 실패하거나
끝나지 않은 실행은 그 케이스의 결과 자리 옆에 `.execution.raw.txt`와 `.execution.error.txt`를
남깁니다. 점수는 만들지 않고, 뒤의 케이스를 멈추지도 않습니다.
그 케이스를 다시 실행하면 이번 시도의 진단은 지워집니다.

## 플러그인 평가 (Claude Code)

`claude plugin eval`(Claude Code 2.1.269 이상)은 플러그인 전체와 모든 스킬을 한 번에 불러오고, `evals/plugin/` 아래 케이스를 실행한 뒤, 플러그인이 있을 때와 없을 때로 각 케이스를 채점합니다. 티어 2를 대체하지 않고 보완합니다. 티어 2는 설명이 사용자가 쓰는 말을 담는지 봅니다. 이쪽은 Claude Code 자신의 라우터가 자연스러운 프롬프트에서 그 스킬을 고르는지, 그리고 스킬이 답에 무엇을 더하는지(`Δ` 열)를 봅니다.

```bash
claude plugin eval . --no-publish                                          # every case, both arms, 3 runs each
claude plugin eval . --case code-review-fires --runs 1 --ablation none     # one cheap iteration on one case
```

케이스는 디렉터리입니다. `prompt.md`(프론트매터에는 턴과 도구 한도, 본문에는 그대로 보내는 프롬프트)와 `graders/` 아래 파일마다 채점기 하나가 들어 있습니다. 보고서는 `evals/plugin/results/<timestamp>/`에 떨어지며, 이미 gitignore되어 있습니다. 실행마다, 그리고 `llm` 채점기마다 계정의 실제 모델 호출입니다. 그래서 티어 3처럼 요청할 때만 돌고 CI에서는 돌지 않습니다.

정직하게 유지하는 규칙은 두 가지입니다. 매니페스트의 `experimental.evals` 키는 스캔을 `evals/plugin/`로 한정합니다. 그래서 `evals/` 다른 곳의 픽스처는 케이스로 읽히지 않습니다. 그리고 `tool_used: Skill` 채점기는 스킬이 발화했는지만 말합니다. 플러그인 있음/없음을 함께 돌릴 때는 점수에서 빠지므로, 답 자체를 보는 채점기와 짝을 이루세요. `code-review-fires`가 그 패턴입니다. 발화 지표, 스킬의 심각도 분류(Critical, Required, Nit, Optional, Consider, FYI)가 제목이나 라벨로 쓰였는지 보는 단순한 `regex` 채점기, 심어 둔 off-by-one을 보는 `llm` 심판 하나입니다. `code-review-stays-quiet`는 정밀도 확인입니다. 리뷰 스킬은 테스트 우선 요청에서 발화하면 안 되고, `Δ`는 0이어야 합니다. 채점하지 않는 두 번째 지표는 test-driven-development가 대신 발화했는지를 기록합니다.

첫 실행이 알려 준 것입니다(Claude Code 2.1.278, claude-opus-5). 스킬 호출은 확률적입니다. 리뷰 스킬은 케이스가 쓰는 말투에서 7회 중 5회 발화했고, test-driven-development는 테스트 우선 프롬프트에서 7회 중 2회 발화했습니다. 종료 코드보다 `Δ`와 보고서를 보거나, 문서의 CI 예시처럼 `--threshold 0.8`을 넘기세요. 한 실행에서는 리뷰 스킬이 발화하지 않았는데도 답이 심각도 분류를 제목으로 썼고, 기준선 9회 중에는 그런 경우가 없었습니다. 불러온 스킬 설명이 호출 없이도 답을 빚을 수 있습니다. 말투가 중요하고, 지렛대는 설명입니다. 원래 설명에서는 "Review this diff before I merge it", "Can you do a proper code review of this change before I merge it?", "Review this pull request for me before it goes into main"이 스킬을 거의 발화시키지 못했습니다. 모델은 diff를 스스로 리뷰했고, 능숙했지만 판정, 심각도 단계, 5축 통과는 없었습니다. 스킬이 더하는 것을 설명해도 도움이 되지 않았고, diff와 풀 리퀘스트를 그 자체로 이름만 대도 도움이 되지 않았습니다. 차이를 만든 것은, diff를 인라인으로 붙여 넣었을 때도 스킬이 적용된다고 말한 것이었습니다. 모델이 "이건 내가 그냥 하면 된다"로 다루던 경우입니다. 모델을 고정한 claude-opus-5-5에서 그 한 절은 리뷰 표현 네 개의 발화를 27회 중 7회에서 27회 중 21회로 올렸고, 옆에 있는 발화하면 안 되는 프롬프트 아홉 개는 바꾸기 전과 후 모두 27회 중 0회로 남겼으며, 가장 평범한 표현은 9회 중 0회에서 9회 중 3회로 옮겼습니다. 나아진 것이고, 해결된 것은 아닙니다. `code-review-stays-quiet-on-commit-message`가 그 절을 지킵니다. 커밋 메시지를 부탁하며 붙여 넣은 diff는 리뷰 스킬을 발화시키면 안 됩니다. 같은 날의 실용 규칙은 두 가지입니다. 숫자를 보고할 때마다 `--model`을 고정하고 Claude Code 버전을 적으세요. CLI는 스스로 갱신되고, 기본 모델이 아침과 저녁 사이에 두 번 바뀌었습니다. 그리고 케이스의 턴 예산을 10 이상으로 주세요. 당시 모델은 슬래시 커맨드(`agent-skills:review`, 그다음 `code-review-and-quality`)로 스킬에 닿을 수 있었고, 그 비용이 턴 두 개였습니다. #714 이후 라이프사이클 명령은 사용자가 부를 때만 동작합니다. 그래서 `tool_used: Skill` 채점기는 스킬 이름만 맞추고, 패턴 안의 명령 이름은 더 이상 맞지 않습니다.

같은 지렛대를 test-driven-development에 적용한 결과입니다(claude-opus-5-5 고정, 프롬프트당 6회). 원래 설명에서는 "Add unit tests for this function", "Fix this bug ... here is the function", "Change this function so that size can never exceed 100"이 각각 6회 중 0회 발화했습니다. 절차 형태의 "Write a failing test for this bug before we fix it"은 6회 중 6회 발화했습니다. 모델은 테스트나 수정을 직접 썼습니다. 여기서는 설명 끝의 절만으로는 부족했습니다. 효과를 낸 것은 세 요청을 이름 짓고, 코드가 인라인으로 붙어 있고 요청이 테스트를 말하지 않아도 스킬이 적용된다고 한 것이었습니다. 그 절은 프롬프트 네 개를 24회 중 6회에서 24회 중 19회로 올렸습니다(테스트 추가 6회 중 6회, 버그 수정 6회 중 6회, 동작 변경 6회 중 1회). 옆에 있는 발화하면 안 되는 프롬프트 여덟 개는, 시험한 모든 변형에서 24회 중 0회로 남았습니다. 한 줄짜리 동작 변경이 하한입니다. 트레이스는 도구 호출 없는 단일 턴 수정을 보여 주고, 모델은 그에 대한 절차를 떠올리지 않습니다. `tdd-fires-on-pasted-bug`와 `tdd-stays-quiet-on-debug`가 그 절의 쌍입니다. 첫째는 붙여 넣은 버그에서 스킬이 발화하고, 답이 수정 전에 실패하는 테스트로 재현하는지 봅니다. 둘째는 diff와 함께 온 "what broke" 질문이 TDD 스킬을 끌어오지 않는지 봅니다. 첫째에서 스킬은 모든 실행에서 발화했지만, 답이 수정 전에 실패하는 테스트를 둔 것은 플러그인이 있을 때 4회 중 2회, 없을 때 3회 중 0회였습니다. 심판이 일부러 엄격한 이유는, 그 순서가 스킬이 더하는 것이기 때문입니다. 놓친 경우(수정을 먼저 하고, 이전 코드였다면 실패했을 것이라는 메모가 달린 테스트를 뒤에 둠)는, 실행할 셸이 없는 세션에서 스킬을 따르지 않은 빈틈입니다. 라우팅 문제는 아닙니다.

같은 지렛대를 code-simplification에 적용한 결과입니다(claude-opus-5-5 고정, Claude Code 2.1.296, 설명마다 프롬프트마다 3회). 원래 설명에서는 "Simplify this function, it works but it is hard to read", "Clean this up, it works but it has grown hard to follow", "Reduce the nesting in this function"이 함수를 붙여 넣은 채 각각 3회 중 0회 발화했습니다. 모델은 코드를 직접 다시 썼습니다. 그 절은 세 요청을 이름 짓고, 코드가 인라인으로 붙어 있고 그 밖에 바꿀 것이 없어도 스킬이 적용된다고 말합니다. 프롬프트 세 개를 9회 중 0회에서 9회 중 8회로 올렸습니다(단순화 3회 중 3회, 정리 3회 중 2회, 중첩 3회 중 3회). 코드를 붙여 넣은, 옆에 있는 발화하면 안 되는 프롬프트 다섯 개(더 빠르게, 테스트 추가, 리뷰, 커밋 메시지, 무엇이 깨졌는지)는 바꾸기 전과 후 모두 15회 중 0회로 남았습니다. `simplify-fires-on-pasted-function`과 `simplify-stays-quiet-on-make-it-fast`가 그 절의 쌍입니다. 첫째는 붙여 넣은 `normalizeTags`에서 스킬이 더하는 것을 채점합니다. 양쪽 모두 같은, 더 짧은 함수를 내놓고, 뻔한 다시 쓰기는 원본이 무시했을 Set을 읽습니다. 그래서 심판은 답이 모든 입력에서 원본과 같은 결과를 유지하는지, 아니면 어디가 다른지 말하는지, 그리고 갈아 넣기 전에 기존 테스트를 실행하라고 사용자에게 말하는지 봅니다. 플러그인이 있을 때 스킬은 3회 중 3회 발화했습니다. 답 둘은 차이를 밝혔고, 하나는 차이를 피하려고 인덱스 루프를 유지했으며, 셋 모두 테스트 실행을 부탁했습니다. 플러그인이 없을 때는 답 하나가 차이를 밝혔고, 둘은 모든 입력에서 결과가 같다고 했으며, 아무도 테스트 실행을 부탁하지 않았습니다. 심판은 있을 때 3회 중 3회, 없을 때 3회 중 0회를 통과시켰습니다. 동작이 바뀌면 무조건 실패로 본 그 채점기의 첫 문안은, 솔직한 답을 3회 중 0회, 차이를 숨긴 답을 3회 중 3회로 채점했습니다. 채점할 것은 결과가 같다는 사실 자체가 아니라, 차이를 밝히는 일과 검증 단계입니다. 둘째 케이스는 붙여 넣은 코드에 대한 속도 불만이 단순화 스킬을 끌어오지 않는지 봅니다.

#714로 라이프사이클 명령이 사용자 호출 전용이 된 뒤 다시 실행한 결과입니다(claude-opus-5-5 고정, Claude Code 2.1.312, 케이스당 3회, 그다음 숫자가 움직인 두 케이스에 6회). 명령을 가리키는 `Skill` 호출은 더 이상 일어날 수 없으므로, 모든 `tool_used: Skill` 패턴에서 명령 이름을 뺐습니다. `code-review-fires`는 3회 중 3회, `simplify-fires-on-pasted-function`은 6회 중 6회 발화했습니다. stays-quiet 케이스는 모두 0에 머물렀습니다. `tdd-fires-on-pasted-bug`는 6회 중 1회 발화했습니다. #678이 2.1.283에서 쟀을 때는 6회 중 6회였고, 여섯 번 중 다섯은 도구 호출이 전혀 없는 단일 턴의 직접 답이었습니다. 그것은 #714가 아닙니다. 측정을 위해 `/test`에서 `disable-model-invocation`을 빼도 같은 케이스는 6회 중 0회 발화했습니다. 절은 바뀌지 않았습니다. 그 아래 라우터가 2.1.283과 2.1.312 사이에 바뀌었습니다. 위의 test-driven-development 숫자는 그 CLI 버전에 묶인 것으로 보세요. 버전을 고정하는 이유가 그것입니다.

같은 지렛대를 git-workflow-and-versioning에 적용한 결과입니다(claude-opus-5-5 고정, Claude Code 2.1.312, 설명마다 프롬프트마다 3회). 원래 설명에서는 "write me a commit message for this diff", "write the changelog entry for this diff", "split this into commits for me"가 diff를 붙여 넣은 채 각각 3회 중 0회, 3회 중 0회, 3회 중 1회 발화했습니다. 모델은 한 턴에 메시지를 직접 썼습니다. 그 절은 세 요청을 이름 짓고, diff가 인라인으로 붙어 있고 메시지를 그 diff만 보고 쓰기 쉬워 보여도 스킬이 적용된다고 말합니다. 프롬프트 세 개를 6회 중 6회, 3회 중 3회, 3회 중 3회로 올렸습니다. 같은 diff를 붙여 넣은, 옆에 있는 발화하면 안 되는 프롬프트 세 개(리뷰, 테스트 추가, 단순화)는 9회 중 0회, 붙여 넣은 diff에 대한 "what broke?"는 6회 중 0회로 남았습니다. 메시지에 무엇이 들어가야 하는지도 풀어 쓴 더 긴 절은 발화는 같았지만, 스킬 자신의 "Resolve the merge conflict on this feature branch"를 티어 2에서 2순위로 밀어 올렸습니다. 그래서 더 짧은 절을 유지합니다. `gitflow-fires-on-commit-message`와 `gitflow-stays-quiet-on-what-broke`가 그 쌍입니다. 첫째는 서로 무관한 변경 두 가지, 재시도 루프와 포맷 헬퍼가 든 diff를 붙입니다. 심판은 스킬이 더하는 것을 채점합니다. 타입이 있는 subject, diff를 다시 적지 않고 이유를 말하는 본문, 그리고 두 관심사를 서로 다른 커밋으로 나누는 것입니다. 양쪽 모두 나눔을 알아챕니다. 플러그인이 있으면 모든 답이 타입이 있는 subject와 이유를 말하는 본문도 쓰고, 없으면 아무도 쓰지 않습니다. 심판은 있을 때 6회 중 5회, 없을 때 3회 중 0회를 통과시켰습니다. 둘째 케이스는 "what broke?"와 함께 붙여 넣은 diff가 git 스킬을 끌어오지 않는지 봅니다.

## 평가 케이스 형식

스킬마다 파일 하나입니다. `evals/cases/<skill-name>.json`.

```json
{
  "skill_name": "test-driven-development",
  "trigger": {
    "positive": [
      { "prompt": "Write a failing test for this bug before fixing it", "top_k": 3 }
    ],
    "negative": [
      { "prompt": "Update the architecture diagram in the docs", "owner": "documentation-and-adrs" }
    ]
  },
  "evals": [
    {
      "id": 1,
      "kind": "execution",
      "prompt": "Finance filed the reconciliation bug written up in BUG.md. Fix it.",
      "expected_output": "A failing reproduction test for the lost-cent case, a fix preserving both README invariants (exact sum, earliest-shares fairness), the fairness invariant covered by its own test, full suite passing",
      "files": [
        "test-driven-development"
      ],
      "expectations": [
        "A test reproducing the lost-cent case from BUG.md is added and shown failing before src/split.js is modified",
        "The final implementation satisfies the full README fairness invariant (leftover cents go to the earliest shares): splitCents(10000, 3) returns [3334, 3333, 3333] as BUG.md expects and splitCents(100, 7) returns [15, 15, 14, 14, 14, 14, 14] as the README example shows; dumping the whole remainder on a single share would violate both",
        "The fairness invariant from the README has its own test case in the suite on an input with remainder of at least 2 (such as splitCents(100, 7)), where dumping the whole remainder on one share would fail it, beyond the reported lost-cent case",
        "The full suite is run with the repository's own command after the fix"
      ]
    }
  ]
}
```

- `evals[]`는 skill-creator의 핵심 스키마(`id`, `prompt`, `expected_output`, 선택인 `files[]`, `expectations[]`)에 이 저장소의 선택 필드 `kind`를 더합니다. `kind`는 `execution` 또는 `dialogue`여야 하고, 호환을 위해 기본값은 `execution`입니다. 실행 평가에는 비어 있지 않은 `files[]`가 필요합니다. 경로는 `evals/fixtures/` 기준이며, 파일이나 프로젝트 디렉터리를 가리킬 수 있습니다. 대화 평가는 트랜스크립트가 아티팩트이므로 `files[]`를 뺄 수 있습니다. 기대 항목은 채점기가 해당 아티팩트와 대조하는 검증 가능한 진술입니다. 말투가 아니라 행동입니다.
- `trigger`는 이 저장소의 확장입니다. `positive` 프롬프트는 여기로 가야 하는 현실적인 사용자 요청입니다. `top_k` 기본값은 3이고, 스킬의 대표 요청은 1로 조이세요. `negative` 프롬프트는 *다른* 스킬의 것입니다. 이 스킬이 그 프롬프트에서 1순위가 되면 안 됩니다. 가능하면 그 스킬을 `owner`에 적으세요. 러너는 그 소유 스킬이 이 스킬보다 **높은 순위**인지 확인합니다. 그러면 부정 항목은, 프롬프트가 아무것도 맞지 않아도 통과해 버리는 검사가 아니라, 실제 쌍 비교 라우팅 테스트가 됩니다.

**좋은 트리거 프롬프트:** 사용자가 실제로 말하는 방식을 풀어 쓰세요. 설명을 그대로 베끼지 마세요. 그러면 평가를 꿰맞추게 됩니다. 현실적인 프롬프트가 순위에 오르지 못하는 이유가 설명에 그 말이 없기 때문이라면, 그것은 실제 발견입니다. 설명을 고치세요.

## 스킬 추가

스킬마다 평가 파일이 함께 있습니다. `skills/<name>/`을 추가할 때 `evals/cases/<name>.json`도 추가하세요. 긍정 트리거 3개 이상, 부정 트리거 2개 이상, 행동 평가 1개가 있어야 합니다. 실행 평가는 `evals/fixtures/<name>/`이 뒷받침해야 합니다. `kind: "dialogue"`는 스킬의 산출물이 정말로 대화 그 자체일 때만 쓰세요. 케이스 파일이 없거나, 케이스 수가 모자라거나, kind를 알 수 없거나, 픽스처 경로가 잘못되었거나, 필요한 픽스처가 없으면 CI 오류입니다.

## 지켜볼 지표

티어 2 실행은 **트리거 1순위 비율**을 출력합니다. 긍정 프롬프트 가운데 해당 스킬을 top-k가 아니라 1순위에 올리는 비율입니다. CI는 `--min-rank1 95`로 실행합니다. 저장소에 있는 100% 기준선 아래에 여유를 두어, 관계없는 설명 수정이 곧바로 CI를 실패로 만들지 않게 합니다. 라우팅이 나아지면 하한을 올리세요. 회귀를 통과시키려고 하한을 내리지는 마세요. 숫자가 떨어지면 설명이 서로 비슷해지고 있다는 뜻입니다. 충돌 검사는 설명끼리의 유사도가 75% 이상이면 오류, 50% 이상이면 경고입니다. 이 평가가 설명의 어휘 빈틈을 드러내면(처음 예는 [#351](https://github.com/addyosmani/agent-skills/issues/351)), 프롬프트가 아니라 설명을 고치세요.
