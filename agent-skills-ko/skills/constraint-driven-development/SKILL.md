---
name: constraint-driven-development
description: "프로젝트의 품질 기준을 문서로 된 계약으로 고정하고, 에이전트가 그 기준을 조용히 낮추지 못하게 합니다. 어떤 차원이 중요한지 사용자에게 질문하고, 정해 둔 숫자가 없으면 합리적인 기본 임계값을 제시하며, 모든 내용을 CONSTRAINTS.md에 기록하고, 기준이 약해졌는지 diff를 지켜봅니다. 새 `@ts-ignore`나 `eslint-disable` 억제, 건너뛰거나 삭제된 테스트, 빼낸 어서션, 구현되지 않은 스텁, 낮춰 고친 임계값이 그 대상입니다. 품질 기준이 문서로 없을 때, 사용자가 'set up constraints' 또는 'define our standards'라고 할 때, 접근성, 웹 성능, 커버리지처럼 신경 쓰는 차원을 강제되는 제약 조건으로 두고 싶을 때, 에이전트가 통과시키려고 검사를 끄거나 테스트를 건너뛸 때, 커버리지나 성능 임계값이 필요한데 어떤 숫자를 고를지 모를 때, 또는 에이전트가 아무도 읽지 않을 만큼 많은 코드를 쓸 때 사용하세요."
---

# Constraint-Driven Development

## 개요

이 묶음의 다른 스킬은 좋은 코드가 어떤 모습인지 설명합니다. `code-review-and-quality`는 다섯 개의 축을 줍니다. `test-driven-development`는 주기를 줍니다. `security-and-hardening`은 위협 목록을 줍니다. 그 모두는 에이전트가 읽고 따를 수도, 따르지 않을 수도 있는 산문에 있으며, 세션이 끝나면 아무것도 남지 않습니다.

이 스킬은 다른 것을 만듭니다. **이 프로젝트**의 기준을, 숫자가 적힌 기록으로 남겨 대화보다 오래가고 기계적으로 확인할 수 있게 합니다.

이유가 중요합니다. 코드를 직접 쓸 때는, 읽어 보면 괜찮은지 알 수 있었습니다. 에이전트는 오후 하나에, 여러분이 그 주에 읽을 양보다 많이 씁니다. 그래서 판단은 머릿속에서 나와, 루프 주위에서 도는 검사가 됩니다. 그 검사는 존재해야 하고, 여러분이 실제로 고른 숫자가 있어야 하며, 작업에 충분히 가까이서 실행되어 에이전트가 자기 산출물을 고치게 해야 합니다.

스펙 주도 개발은 무엇을 만들지를 말합니다. 테스트 주도 개발은 그것이 동작함을 증명합니다. 제약 조건 주도 개발은 "프로덕션에 출시해도 될 만큼 좋음"이 무슨 뜻인지, 풀 리퀘스트에서 누가 다투기 전에 정합니다.

## 언제 사용하나

다음일 때 이 스킬을 적용하세요.

- 프로젝트나 상당한 기능을 시작하는데 품질 기준이 문서로 없을 때
- 사용자가 "set up constraints"(제약 조건을 설정해 줘), "add quality gates"(품질 게이트를 추가해 줘), "define our standards"(우리 기준을 정의해 줘), "stop the agent shipping junk"(에이전트가 쓰레기를 내보내지 못하게 해 줘)라고 할 때
- 에이전트가, 한 줄씩 읽는 사람이 없는 분량을 내고 있을 때
- CI에는 검사가 있지만, 어떤 것이 머지를 막고 어떤 것이 장식인지 아무도 말하지 못할 때
- 커버리지, 성능, 접근성 숫자를 한 번에 정해 두지 않고 풀 리퀘스트마다 다툴 때
- `/build auto`나 다른 자율 루프를 돌리려 하는데, main으로 가는 길을 막는 것이 에이전트도 함께 쓴 테스트 스위트뿐일 때

**사용하지 않을 때:**

- 프로젝트에 이미 `CONSTRAINTS.md`가 있고 사용자가 그것을 바꾸지 않을 때. 그 파일을 읽고 따르세요
- 일회성 스크립트, 스파이크, 버리고 가는 프로토타입
- 사용자가 지금 코드 리뷰를 원할 때 (`code-review-and-quality`), 또는 CI 파이프라인을 만들려 할 때 (`ci-cd-and-automation`)
- 예상 수명이 2주인, 제품-시장 적합성 이전의 코드. 아래 하한(Floor)은 그래도 가치가 있습니다. 나머지는 가치가 없습니다

## 제약 조건 불러오기

이 질문에는 응답할 수 있는 사용자가 필요합니다. **비대화형 맥락에서는 돌리지 마세요** (CI, `/loop`, 자율 실행). 그런 맥락에 있는데 제약 조건이 없으면, 아래의 하한을 적용하고 그렇게 했다고 적은 뒤, 나머지는 사람이 보도록 표시하세요.

## 절차

### 1단계: 묻기 전에 감지하기

읽을 수 있는 것은 묻지 마세요. 첫 질문 전에 다음을 모으세요.

| 무엇 | 어디를 보나 |
|------|---------------|
| 언어와 스택 | `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml` |
| 테스트 러너 | dev 의존성, `test` 스크립트, 기존 테스트 파일 |
| 기존 린터 | `eslint.config.*`, `biome.json`, `.ruff.toml` |
| 오늘의 커버리지 | `coverage/` 산출물, 또는 스위트를 한 번 실행 |
| CI | `.github/workflows/`, `.gitlab-ci.yml` |
| 에이전트 하니스 | `.claude/`, `.codex/`, `AGENTS.md` |

찾은 것을 두 줄로 보고한 뒤, 남은 것만 물으세요.

### 2단계: 질문 네 개, 각각 기본값이 있음

`interview-me`의 한 번에 질문 하나씩 하는 원칙을 따르되, 한 가지만 다릅니다. 여기의 모든 질문에는 기본값이 있어서, "I don't know"도 동작하는 설정을 만드는 완전한 답입니다.

```
Q1: Beyond the floor, which of these do you want enforced?
    (a) Test coverage on new code
    (b) Security scanning
    (c) Performance budgets
    (d) Accessibility
    (e) Architecture boundaries
GUESS: (a) and (b) — you have a test runner already and you're handling user input.
DEFAULT if unsure: (a) and (b).
Say what each pick costs: (c) and (d) need a running URL, (e) needs a rules file written.
```

```
Q2: When a check fails while the agent is mid-task, should it block or warn?
GUESS: Block. You're running agents unattended and a warning nobody reads is a warning.
DEFAULT if unsure: Block on the floor, warn on everything else for the first two weeks.
```

```
Q3: Do you have target numbers in mind, or should I measure where you are today and hold that line?
GUESS: Measure. Most teams don't have a number, and an invented one gets ignored.
DEFAULT if unsure: Measure and hold. See "Ratchets" below.
```

```
Q4: What's the slowest check you'll tolerate before the agent hands work back?
GUESS: About 90 seconds. Longer and you'll stop running it.
DEFAULT if unsure: 90 seconds at task end, unlimited in CI.
```

네 개에서 멈추세요. 열두 개짜리 질문 절차는 아무도 이해하지 못하는 설정과, 시작을 후회하는 사용자를 만듭니다.

### 3단계: CONSTRAINTS.md 작성

저장소 루트에 파일 하나입니다. 어떤 하니스의 에이전트도 읽을 수 있고, 이 파일의 변경은 있어야 할 자리인 리뷰에 나타납니다.

```markdown
# Constraints

Last reviewed: 2026-08-08 by @addy

## Floor (always enforced, no setup required)

- No new suppression comments: `@ts-ignore`, `eslint-disable`, `# noqa`, `# type: ignore`
- No unimplemented stubs: `throw new Error("Not implemented")`, empty `catch {}`
- No skipped or deleted tests without a reason in the commit message
- No secrets in source
- This file does not get weakened to make a change pass

## Enforced with numbers

| Dimension | Rule | Checked by | Runs at |
|-----------|------|-----------|---------|
| Types | Zero type errors | `tsc --noEmit` | every edit |
| Lint | Zero errors from our config | `biome check` | every edit |
| Secrets | No secrets in source | `gitleaks dir . --redact` | every edit |
| Coverage | Changed lines ≥ 80% covered | `vitest run --coverage` + git diff | task end, CI |
| Security: code | Nothing at high or above | `npm run check:security` | CI |
| Security: deps | Nothing at high or above | `osv-scanner scan source -r .` | CI |
| Accessibility | Zero critical or serious | `npm run check:a11y` | preview deploy |
| Performance | LCP ≤ 2500ms, CLS ≤ 0.1 | `lighthouse $PREVIEW_URL --output=json` | preview deploy |

Every row names the command that produces the verdict. A dimension with a
number and no command in this column is an aspiration, not a constraint.

## Measured, not yet enforced

| Metric | Today | Direction |
|--------|-------|-----------|
| Project coverage | 62.4% | must not fall |
| Bundle size (main) | 184 kB | must not grow |

## Exceptions

| ID | Rule | Path | Reason | Owner | Expires |
|----|------|------|--------|-------|---------|
| W1 | `no-explicit-any` | `src/legacy/**` | Rewrite tracked in ENG-441 | @addy | 2026-11-01 |
```

그다음 `AGENTS.md`와 `CLAUDE.md`에 한 줄을 추가하세요. `Read CONSTRAINTS.md before writing code. Do not weaken it to make a change pass.`

### 4단계: 각 차원에 필요한 것 설치

차원을 고르면 무언가를 설치하게 됩니다. 숫자만 있고 메커니즘은 없는 상태로 사용자를 두지 마세요. 사실상 표준이 있는데 자체 검사기를 만들지 마세요. 이 도구들을 적은 이유는, 그 규칙 형식과 임계값이 생태계의 나머지가 맞추는 기준이라 팀이 가진 기존 설정이 그대로 동작하기 때문입니다.

| 차원 | 도구 | 설치 | 실행 | 차단 기준 |
|-----------|------|---------|-----|---------|
| 타입 (TS) | tsc | 이미 있음 | `tsc --noEmit` | 오류가 하나라도 있으면 |
| 타입 (Python) | mypy | `pip install mypy` | `mypy .` | 오류가 하나라도 있으면 |
| 린트 | 기존 설정 | 이미 있음 | `eslint .` / `biome check` / `ruff check` | 오류가 하나라도 있으면 |
| 커버리지 (JS) | 사용 중인 테스트 러너 | Vitest: `npm i -D @vitest/coverage-v8`; Jest: 이미 있음 | `vitest run --coverage` (또는 `jest --coverage`) | 변경된 줄의 커버리지 |
| 커버리지 (Python) | pytest-cov | `pip install pytest-cov` | `pytest --cov --cov-report=lcov` | 동일 |
| 보안: 코드 | Semgrep | `pipx install semgrep` | `npm run check:security` (아래) | high 또는 critical. 레거시 `ERROR` 포함 |
| 보안: 시크릿 | gitleaks | `brew install gitleaks` | `gitleaks dir . --redact --no-banner` | 발견이 하나라도 있으면 |
| 보안: 의존성 | osv-scanner | `brew install osv-scanner` | `osv-scanner scan source -r .` | high 이상 |
| 성능: 페이지 | Lighthouse | `npm i -D lighthouse` | `lighthouse $URL --output=json --quiet` | LCP, CLS, 성능 점수 |
| 성능: 번들 | size-limit | `npm i -D size-limit` | `size-limit --json` | 엔트리별 바이트 예산 |
| 접근성 | axe-core | `npm i -D @axe-core/cli` | `npm run check:a11y` (아래) | critical 또는 serious 0건 |
| 아키텍처 | dependency-cruiser | `npm i -D dependency-cruiser` | `depcruise --validate src` | 위반이 하나라도 있으면 |
| 어서션 품질 | Stryker | `npm i -D @stryker-mutator/core` | `stryker run --mutate <changed files>` | 뮤테이션 점수 |

빼먹으면 바로 문제가 되는 다섯 가지:

1. **gitleaks의 `--redact`는 선택이 아닙니다.** 이것이 없으면 일치한 비밀이 에이전트의 기록에 남고, 유출된 키는 그렇게 로그, 요약, 커밋 메시지에 들어갑니다. 규칙과 위치는 보고하고, 값은 보고하지 마세요.
2. **Lighthouse와 axe에는 URL이 필요합니다.** 실행 중인 앱을 상대로만 동작하므로, 먼저 띄운 프리뷰 배포나 로컬 서버를 상대로 하는 런타임 단계에 둡니다. 요청할 URL이 없는 프로젝트라면 (CLI, 라이브러리, 데스크톱 앱) 그렇다고 말하고 그 차원을 빼세요. 실행할 수 없는 검사를 만들지 마세요.
3. **비싼 검사는 diff로 범위를 좁히세요.** 저장소 전체에서 `stryker run --mutate`를 하면 몇 시간이 걸리고 결국 꺼집니다. 변경이 건드린 파일만 하면 1분 미만입니다. 경로 목록을 받는 Semgrep도 같습니다.
4. **커버리지 때문에 테스트를 두 번 돌릴 필요는 없습니다.** 스위트가 이미 쓰는 lcov를 읽고 `git diff`와 교집합을 구하세요. 숫자를 얻으려고 스위트를 두 번 돌리는 것이, 사람들이 이것을 싫어하게 되는 가장 빠른 길입니다.
5. **Semgrep 레지스트리 규칙은 실행은 무료입니다. 재배포 전에 라이선스를 확인하세요.** 법무팀에 중요하다면, `opengrep`은 같은 규칙 형식과 JSON 출력을 가진 드롭인 포크입니다.

`semgrep scan`과 `axe`는 발견이 있어도 종료 코드 0으로 끝날 수 있습니다. 이 임계값을 강제하려면 [scripts/quality-gate.mjs](scripts/quality-gate.mjs)를 프로젝트의 `scripts/` 디렉터리에 복사하세요.
스캐너를 `&&` 앞에 두세요. 스캔이 실패하면 명령이 멈춥니다.

에이전트 없이도 재현되도록, 각각을 프로젝트 자신의 스크립트에 넣으세요.

```json
{
  "scripts": {
    "check:fast": "tsc --noEmit && eslint . && gitleaks dir . --redact --no-banner",
    "check:task": "npm run check:fast && vitest run --coverage",
    "check:security": "semgrep scan --config p/default --strict --json > semgrep-results.json && node scripts/quality-gate.mjs semgrep semgrep-results.json",
    "check:a11y": "axe \"$PREVIEW_URL\" --tags wcag2a,wcag2aa,wcag21aa --stdout > axe-results.json && node scripts/quality-gate.mjs axe axe-results.json",
    "check:full": "npm run check:task && npm run check:security && osv-scanner scan source -r ."
  }
}
```

그 대응 관계가 도구 자체보다 중요합니다. `check:fast`는 편집 뒤에 돌고, `check:task`는 에이전트가 끝났다고 생각할 때 돌며, `check:full`은 CI에서 돕니다. 프리뷰에 도달할 수 있게 된 뒤 `PREVIEW_URL`을 설정하고 `check:a11y`를 돌리세요. 예시는 POSIX 셸 문법을 사용합니다.

어느 행이든 강제된다고 말하기 전에, 알려진 위반 하나와 깨끗한 대조군 하나에 실제 CI 명령을 실행하세요. 위반은 실패하고, 대조군은 통과하며, 스캐너 오류도 실패하는지 확인하세요. 심각도 임계값이 있다면, 임계값 아래의 발견은 통과하는지도 확인하세요. 커버리지와 Lighthouse를 포함해 모든 차원에 이렇게 하세요. 리포트를 생성하는 것만으로는 `CONSTRAINTS.md`의 숫자를 강제하지 않습니다.

명령은 이제 두 곳에 있습니다. `CONSTRAINTS.md`의 `Checked by` 열과 이 스크립트입니다. `CONSTRAINTS.md`가 기준 원본입니다. 각 명령 옆에 이유가 있고, 리뷰에 나타납니다. 스크립트는 그것을 그대로 비춰야 하는 편의용 래퍼이며, 두 번째 진실 공급원이 아닙니다. 둘이 어긋나면 파일이 우선합니다.

### 5단계: 수명 주기에 연결

가장 큰 실수는 모든 검사를 모든 곳에서 돌리는 것입니다. 에이전트를 멈추게 하는 검사는 꺼지고, 사람들이 꺼 버린 품질 게이트는 품질 게이트가 없는 것보다 더 나쁩니다. 기준이 아직 있는 것처럼 보이기 때문입니다.

| 단계 | 명령 | 실행 내용 | 예산 |
|-------|---------|-----------|--------|
| BUILD | `/build` | 타입, 린트, 시크릿, 하한 | 5초 미만, 변경된 파일만 |
| VERIFY | `/test` | 관련 테스트, 변경된 줄의 커버리지 | 90초 미만 |
| REVIEW | `/review` | 전부, 그리고 아래 가드 | 수 분 |
| SHIP | `/ship` | 방향 검사, 회귀 없음 | CI |

이것을 견딜 만하게 유지하는 규칙 두 가지:

1. **diff로 범위를 좁히세요.** 저장소 전체가 아니라, 이번 변경이 건드린 줄을 검사하세요. 변경된 줄의 커버리지는 에이전트가 움직일 수 있는 숫자이고, 프로젝트 커버리지는 물려받은 숫자입니다.
2. **비용이 배치를 결정합니다.** 몇 초를 넘는 것은 편집 루프 밖으로 옮기세요. 저장소 전체의 뮤테이션 테스트는 몇 시간이 걸립니다. 변경이 건드린 파일만 하면 1분 미만이고, 그 차이가 사람들이 돌리는 검사와 돌리지 않는 검사를 가릅니다.

### 6단계: 기준 자체를 지키기

에이전트가 코드와 검사를 둘 다 쓰면 검사는 아무것도 증명하지 못한다는 지적이 나올 것입니다. 절반은 맞으며, 그 부분을 설계로 피해 갈 가치가 있습니다.

에이전트는 교묘한 허점을 짜내지 않습니다. 빨간 검사에 부딪히면 가장 싸게 통과로 가는 길을 택합니다. 리뷰 시점에 diff에서 다음 다섯 가지 움직임을 보세요.

1. **임계값이 움직였습니다.** 예산이 낮아졌거나, 심각도가 내려갔거나, 빠른 단계에서 검사가 빠졌습니다. `CONSTRAINTS.md`를 브랜치 지점의 상태와 비교하세요.
2. **테스트가 쉬워졌습니다.** `.skip`이 추가됐거나, 테스트 파일이 삭제됐거나, 남아 있는 테스트에서 어서션이 빠졌습니다.
3. **검사기가 조용해졌습니다.** 새 `@ts-ignore` 또는 `eslint-disable`. 억제 네 가지는 의존하고 있는 검사를 끄므로 특히 주의가 필요합니다. `istanbul ignore`는 코드를 테스트하는 대신 커버리지에서 빼고, `Stryker disable`은 살아남은 뮤턴트를 숨기며, `nosemgrep`과 `gitleaks:allow`는 보안 발견에 같은 일을 합니다.
4. **일이 끝나지 않았습니다.** 예외를 던지는 스텁, 실패를 침묵으로 바꾸는 빈 `catch`, 구현이 있어야 할 자리에 있는 `TODO`.
5. **예외가 생겼습니다.** 아무도 논의하지 않은 Exceptions 표의 새 행.

여기에는 `git diff`를 넘는 도구가 필요 없습니다. 기준을 조이는 것은 조용히 지나가야 하고, 기준을 푸는 것은 크게 드러나야 합니다.

숫자가 있는 차원과 달리, 하한에는 자체적인 사실상 표준 도구가 없습니다. 그래서 강제를 요청받은 에이전트는 검사기를 처음부터 쓰는 경향이 있고, 에이전트 둘이 서로 다른 검사기를 씁니다. 이 다섯 검사의 참조 구현이 이 스킬과 함께 [references/floor-guard.md](references/floor-guard.md)에 실려 있습니다 (diff 범위, 종료 코드 `0`/`1`/`2`, 생태계마다 맞출 수 있는 패턴). 그것을 새로 만들지 말고 맞추세요. 모든 차원이 사실상 표준 도구의 이름을 적는 이유와 같습니다. 실행마다, 스택마다 메커니즘이 같아야 하기 때문입니다.

**검사마다 순환의 정도가 다릅니다.** 질문 하나로 순위를 매기세요. 에이전트가 동작하지 않는 코드를 써서 이것을 통과시킬 수 있습니까?

- **외부.** axe-core는 WCAG를 담고, `osv-scanner`는 취약점 데이터베이스를 읽으며, Lighthouse는 실제 브라우저를 측정합니다. 에이전트는 이 결과와 다툴 수 없습니다.
- **프로젝트.** 여러분의 린트 규칙, 여러분의 레이어 경계. 그 파일의 주인은 사람입니다.
- **스위트.** 직접 쓴 테스트. 가장 유용하고, 정말로 순환적인 유일한 종류입니다.

세 번째 종류만으로 된 기준의 가치는, 외부 판단이 하나 들어 있는 기준보다 낮습니다. 외부 제약 조건이 하나 이상 있는지 확인하세요.

### 7단계: 숫자가 없을 때의 래칫

62%인 코드베이스에 커버리지 80%를 걸면 빌드가 영원히 빨갛고, 팀은 빨간 빌드를 무시하는 법을 배웁니다.

대안은 결정을 요구하지 않습니다. 지금 위치를 기록하고, 더 나빠지는 것만 거부하세요. 오늘의 숫자와 방향을 "Measured, not yet enforced"(측정만 하고 아직 강제하지 않음) 표에 넣으세요. 모든 검사는 포부가 아니라 기록된 값과 비교합니다. 숫자가 나아지면 그 값을 갱신하고, 떨어지면 그것이 발견입니다.

이것은 모델 학습에 대한 타당한 이의에도 답이 됩니다. 모델은 테스트를 통과한 것에 보상을 받으며, 그 평가는 몇 초면 됩니다. 아키텍처가 썩는 일은 몇 달에 걸쳐 나타나고 가중치까지는 도달하지 않습니다. 래칫은 빠져 있던 벌점이며, 빌드가 볼 수 있는 곳에 적혀 있습니다.

## 합리적인 기본값

사용자에게 의견이 없으면 이것을 쓰세요. 대부분의 코드베이스가 첫날에 맞출 수 있도록 고른 값입니다.

| 제약 조건 | 기본값 | 이 숫자인 이유 |
|------------|---------|-----------------|
| 변경된 줄의 커버리지 | ≥ 80% | 테스트를 강제할 만큼 높고, 설정 한 줄은 허용할 만큼 낮습니다 |
| 프로젝트 커버리지 | 오늘의 값, 떨어지면 안 됨 | 도입하는 데 논쟁이 필요 없습니다 |
| 뮤테이션 점수 (쓸 경우) | 시작은 ≥ 60% | 한 번도 뮤테이션한 적 없는 스위트의 전형입니다. 80%는 성숙한 수준입니다 |
| 의존성 취약점 | high 이상 없음 | 그 아래는 대부분 잡음입니다 |
| LCP | ≤ 2500 ms | Core Web Vitals의 "good" 임계값 |
| CLS | ≤ 0.1 | 동일 |
| 접근성 | axe의 critical 또는 serious 위반 0건 | moderate와 minor는 종종 논쟁의 여지가 있습니다 |
| 예외 수명 | 90일 | 수정을 계획하기에는 길고, 기억하기에는 짧습니다 |
| 래칫 허용 오차 | 0.5% | 관련 없는 파일이 숫자를 움직일 때의 흔들림을 흡수합니다 |

숫자와 이유를 함께 적으세요. 근거 없는 임계값은, 다음에 거기에 걸리는 사람이 지웁니다.

## 강화 경로

제약 조건의 강제력은 세 단계입니다. 첫 단계에서 시작하세요.

1. **문서만.** `CONSTRAINTS.md`가 있고 에이전트가 그것을 읽습니다. 비용이 들지 않고, 정직한 실수는 잡으며, 에이전트가 따르는 데 의존합니다.
2. **스크립트.** 빠른 검사를 돌리는 `npm run check`(또는 `make check`)를 에이전트의 편집 후 훅과 CI에 연결합니다. 결정적이고, 새 의존성은 없습니다.
3. **도구.** diff 범위, 예산, 래칫, 가드 검사를 처리하는 전용 러너입니다. 설정이 셸 스크립트를 넘어설 때 쓰세요. [references/floor-guard.md](references/floor-guard.md)의 하한 가드 참조는 이 가운데 가드 검사 쪽의 출발점입니다.

대부분의 프로젝트는 2에서 멈추면 됩니다. 검사를 실행하는 셸을 서른 줄보다 많이 유지하게 되면 3으로 가세요.

**첫 실행은 하한만으로도 됩니다.** 하한 가드는 diff만 보고 설치가 필요 없습니다. 첫 커밋을 보호하기 전에 검사기를 모두 세우지 않아도 됩니다. 첫날에 하한을 강제하고, 도구를 설치할 때마다 숫자가 있는 차원을 더하세요. 머신 전체에 설치되는 보안 도구(gitleaks, osv-scanner)는 노트북을 깨끗하게 두고 싶다면 CI에서만 돌려도 됩니다. 각 차원이 어디서 실행되는지는 `Runs at` 열에 적으세요.

## 흔한 합리화

| 변명 | 현실 |
|--------|---------|
| "코드가 안정되면 제약 조건을 추가하겠습니다" | 코드는 움직이는 동안 허용됐던 형태 주위로 안정됩니다 |
| "테스트가 제약 조건입니다" | 직접 쓴 테스트는 스스로에게 동의한다는 것만 증명합니다. 새 코드의 커버리지, 의존성 위험, 번들 증가에 대해서는 말하지 않습니다 |
| "커버리지 80%는 맞출 수 없습니다" | 그렇다면 80%로 설정하지 마세요. 오늘의 숫자로 설정하고 그 선을 지키세요 |
| "이러면 에이전트가 느려집니다" | 느린 검사를 빠른 루프에 넣을 때만 그렇습니다. 배치를 잘못한 것이며, 제약 조건을 두지 않을 이유는 아닙니다 |
| "우리 기준이 뭔지는 제가 기억하겠습니다" | 에이전트는 기억하지 못합니다. 코드의 대부분은 에이전트가 쓰고 있습니다 |
| "제약 조건 때문에 출시하지 못할 것입니다" | 소유자와 날짜가 있는 예외는 막힌 곳을 풀어 줍니다. 제약 조건을 지우면 모두가 영원히 막힘 없이 지나가게 됩니다 |

## 레드 플래그

다음이 보이면 멈추고 다시 생각하세요.

- 질문이 네 개를 넘어갔거나, 사용자가 설명하지 못하는 설정이 나왔습니다
- 코드베이스가 오늘 맞추지 못하는 예산을, 도달 계획 없이 정했습니다
- 차원이 숫자와 함께 CONSTRAINTS.md에 적혔지만, 뒤에 도구가 없습니다
- 사실상 표준인 검사기가 있는데도 직접 만들어서, 팀이 가진 기존 설정이 무시됩니다
- 모든 제약 조건을 이 프로젝트의 테스트 스위트만 검사해서, 외부의 판단이 없습니다
- 실패하던 기능과 같은 커밋에서 `CONSTRAINTS.md`가 바뀌었습니다
- 예외에 소유자가 없거나, 만료가 1년보다 멀리 있습니다
- 에이전트가 코드를 고치는 대신 임계값을 완화하자고 제안했습니다
- 느린 검사가 편집 루프에 들어갔고, 누군가 `--no-verify`를 넘기기 시작했습니다
- `CONSTRAINTS.md`를 작성한 뒤로 아무도 열지 않았습니다

## 검증

다음이면 이 스킬을 올바르게 적용한 것입니다.

- [ ] `CONSTRAINTS.md`가 있고, 그 안의 모든 숫자에는 이유가 적혀 있습니다
- [ ] 하한이 강제되며, 현재 코드베이스에서 변경 없이 통과합니다
- [ ] 사용자가 고른 모든 차원에 도구가 설치되어 있고, 오늘 실행되는 명령이 있습니다
- [ ] 각 제약 조건이 어디서 도는지 말하고, 빠른 단계는 몇 초 안에 머뭅니다
- [ ] 제약 조건 하나 이상은 외부입니다 (이 프로젝트 자신의 테스트가 판단하지 않습니다)
- [ ] 측정만 하는 지표는 오늘의 값과 방향을 기록합니다
- [ ] 예외에는 소유자와 만료일이 있습니다
- [ ] `AGENTS.md` 또는 `CLAUDE.md`가 이 파일을 가리킵니다
- [ ] 현재 브랜치에서의 시험 실행이, 사용자가 동의하지 않는 실패를 내지 않습니다
- [ ] 강제되는 각 명령은 의도적 위반과 스캐너 오류에서 실패하고, 깨끗한 대조군은 통과하며, 합의한 심각도 임계값을 유지합니다

## 함께 보기

- `interview-me`: 이 스킬의 질문 절차가 빌려 온, 한 번에 질문 하나씩 하는 원칙
- `code-review-and-quality`: 리뷰하는 방법. 이 스킬은 리뷰가 무엇을 강제할지 정합니다
- `ci-cd-and-automation`: 이 제약 조건이 돌아가는 파이프라인을 만듭니다
- `test-driven-development`: 커버리지와 뮤테이션 제약 조건이 측정하는 스위트
- `security-and-hardening`: 보안 차원에 들어가야 할 내용
- `performance-optimization`: 성능 숫자가 나오는 곳
