# Agent Skills에 기여하기

기여해 주셔서 감사합니다. 이 프로젝트는 AI 코딩 에이전트를 위한 프로덕션 수준의 엔지니어링 스킬 모음입니다.

처음이신가요? [docs/developer-onboarding.md](docs/developer-onboarding.md)는 저장소가 어떻게 맞물리는지(다섯 계층, 검증 루프, 기여 경로)를 안내하고, 이 문서와 [skill-anatomy.md](docs/skill-anatomy.md), [evals/README.md](evals/README.md)를 언제 읽으면 되는지를 알려 줍니다. 이 파일이 기준이 되는 규칙서이고, 온보딩 가이드는 지도입니다.

## 새 스킬 추가

<a id="before-proposing-a-new-skill"></a>

### 새 스킬을 제안하기 전에

이 팩은 이미 개발 생명주기의 대부분을 다루고, 많은 제안이 기존 스킬이나 다른 열린 풀 리퀘스트와 겹칩니다. 열기 전에 다음 점검을 해서, 리뷰어가 중복을 분류하는 일이 없게 하세요.

1. **카탈로그를 검색하세요.** [README의 스킬 목록](README.md)을 둘러보고, `skills/`에서 아이디어의 전부 또는 일부를 다루는 기존 스킬이 있는지 훑어 보세요.
2. **열린 풀 리퀘스트를 확인하세요.** `gh pr list --state open`을 실행하거나(또는 풀 리퀘스트 탭을 둘러보거나) 같은 주제의 제안이 있는지 보세요. 거의 중복인 스킬 묶음이 이미 있습니다. 거기에 더하지 마세요.
3. **거절된 제안을 확인하세요.** [스킬 변경 거절 대장](evals/skill-impact.md)에서 아이디어와 겹치는 이전 제안을 찾고, 그 일을 반복하기 전에 평가 근거를 검토하세요.
4. **구조를 읽으세요.** 아이디어가 [docs/skill-anatomy.md](docs/skill-anatomy.md)의 형식에 맞는지 확인하세요. 모호한 조언이 아니라, 검증이 있는 실행 가능한 워크플로우여야 합니다.
5. **풀 리퀘스트 설명에서 공백을 정당화하세요.** 기존 스킬, 열린 풀 리퀘스트, 이전에 거절된 제안이 왜 이것을 다루지 않는지 명시하세요. 겹친다면 새 스킬을 추가하는 대신 기존 스킬을 확장하자고 제안하세요.
6. **모델별 우회를 빼세요.** 모델 이름, 모델 버전, 또는 한 에이전트만의 비공개 도구 이름을 밝히지 않고는 정당화할 수 없는 단계라면 스킬에 둘 자리가 없습니다. 그 대신 능력을 설명하세요 ([절차를 쓰고, 우회는 쓰지 마세요](docs/skill-anatomy.md#write-the-procedure-not-the-workaround)).

아이디어가 기존 스킬의 개선이라면, 새 디렉터리보다 그 스킬에 대한 집중된 수정을 선호하세요.

### 스킬 만들기

1. `skills/` 아래에 kebab-case 이름의 디렉터리를 만드세요
2. [docs/skill-anatomy.md](docs/skill-anatomy.md)의 형식에 맞는 `SKILL.md`를 추가하세요
3. YAML frontmatter에 `name`과 `description` 필드를 넣고, 최상위에는 벤더나 런타임 키를 두지 마세요 (그런 키는 `metadata` 아래나 에이전트별 어댑터 파일에 둡니다. [docs/advanced-per-agent-configuration.md](docs/advanced-per-agent-configuration.md)를 보세요)
4. `description`이 스킬이 하는 일(3인칭)로 시작하고, 이어서 하나 이상의 `Use when` 트리거 조건을 포함하게 하세요

### 스킬 품질 기준

스킬은 다음이어야 합니다.

- **구체적**: 모호한 조언이 아니라 실행 가능한 단계
- **검증 가능**: 증거 요구가 있는 명확한 종료 기준
- **실전에서 검증됨**: 이론적 이상이 아니라 실제 엔지니어링 워크플로우에 기반
- **최소**: 에이전트를 올바르게 이끄는 데 필요한 내용만

<a id="structure"></a>

### 구조

모든 새 스킬에는 다음이 있어야 합니다.

- 스킬 디렉터리 안의 `SKILL.md`
- 유효한 `name`과 `description`이 있는 YAML frontmatter
- `evals/cases/<skill-name>.json`의 평가 케이스 파일. 긍정 트리거 최소 3개, 부정 트리거 2개 (가능하면 `owner` 포함), 행동 평가 1개. 실행 평가는 `evals/fixtures/` 아래의 실제 파일로 뒷받침되어야 합니다. 대화 형태의 스킬은 리뷰어가 게이트하는 `kind: "dialogue"` 평가를 대신 쓸 수 있습니다 ([evals/README.md](evals/README.md)를 보세요). CI가 이 요구 사항을 강제합니다.

새 스킬은 일반적으로 표준 구조를 따라야 합니다.

- **개요 (Overview)**: 이 스킬이 무엇을 하고 왜 중요한지
- **언제 사용하나 (When to Use)**: 트리거 조건
- **절차 (Process)**: 단계별 워크플로우
- **흔한 합리화 (Common Rationalizations)**: 에이전트가 단계를 건너뛰려고 쓰는 변명과 반박
- **레드 플래그 (Red Flags)**: 스킬이 잘못 적용되고 있다는 경고 신호
- **검증 (Verification)**: 스킬이 올바르게 적용되었는지 확인하는 방법

위의 frontmatter 필드는 필수입니다. 섹션 구조는 권장 패턴입니다. `How It Works`, `Workflow`, `Core Process`처럼 같은 의도를 유지하고 스킬을 따라가기 쉽게 하는 동등한 제목도 괜찮습니다.

### 하지 말 것

- 스킬 사이에 내용을 중복하지 마세요. 다른 스킬을 참조하세요
- 실행 가능한 절차 대신 모호한 조언인 스킬을 추가하지 마세요
- 내용이 100줄을 넘지 않으면 보조 파일을 만들지 마세요
- 다른 스킬과 모양을 맞추려고 빈 `scripts/` 디렉터리를 만들지 마세요. 스킬에 실행 가능한 도우미가 있을 때만 `scripts/`를 추가하세요
- 참조 자료를 스킬 디렉터리 안에 두지 마세요. `references/`를 사용하세요

## 기존 스킬 수정

변경을 제안하기 전에 [스킬 변경 거절 대장](evals/skill-impact.md)에서 같은 스킬에 영향을 준 이전 시도를 찾고, 평가 근거를 검토하세요.

- 변경은 집중되고 최소한으로 유지하세요
- 기존 구조와 톤을 유지하세요
- 수정 후에도 YAML frontmatter가 유효한지 테스트하세요

평가 결과를 근거로 스킬이나 설명 변경이 거절되면, 대장에 한 줄을 추가하세요. 날짜, 영향을 받은 스킬, 시도한 변경의 짧은 요약, 변경 전후 1순위 점수, 거절된 풀 리퀘스트 링크와 결과입니다. 대장만 고친 업데이트는 기본 브랜치에 따로 반영하세요. 거절된 제안 브랜치에만 남겨 두지 마세요. 제안을 닫거나 force-push하면 기록이 사라질 수 있습니다.

<a id="adding-a-host-guide"></a>

## 호스트 가이드 추가

README 설치 섹션에는 메인테이너가 현재 릴리스를 설치하고 실행해 본 호스트만 나열합니다. 그 밖의 호스트는 [docs/other-hosts.md](docs/other-hosts.md)에 한 줄로 둡니다. 호스트 이름과 설치 명령입니다. 전용 설정 페이지, 벤더 링크, 로고, 이모지, 스크린샷은 없습니다.

- 호스트를 만든 회사에서 일한다면, 풀 리퀘스트에 그렇게 밝히세요.
- 메인테이너가 실행해 보고 항목을 최신으로 유지할 의향이 있을 때, 그 호스트는 README로 올라갑니다.
- 호스트 가이드는 열린 순서대로 리뷰됩니다.

<a id="repo-scoped-files"></a>

## 저장소 범위 파일

저장소 루트의 `AGENTS.md`와 `CLAUDE.md`는 [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) 저장소 자체를 작업하는 에이전트를 설정합니다. 설정 가이드나 문서를 쓸 때, 사용자에게 이 파일을 자신의 프로젝트나 전역 에이전트 설정으로 복사하라고 지시하지 마세요. 재사용할 수 있는 자산은 `skills/`의 스킬입니다.

<a id="translations"></a>

## 번역

문서(README, `docs/`)나 스킬과 그 내용의 번역은 받지 않습니다. 번역본은 스킬과 문서가 발전하면서 동기화에서 벗어나고, 에이전트 번역과 커뮤니티 교정에 기대지 않고는 장기적으로 유지할 방법이 없습니다. 그 방식은 가치에 비해 유지 비용을 더합니다. 모든 스킬, 문서, 기여는 영어로 유지하세요.

## 훅 테스트

세션 시작 스크립트(`hooks/session-start.sh`)는 호스트의 `SessionStart` 훅에 연결되면 `using-agent-skills` 메타 스킬을 주입합니다. Claude Code 플러그인은 이것을 등록하지 않습니다. Claude Code는 스킬을 네이티브로 라우팅하고, 항상 켜진 주입은 같은 작업에 라우터를 두 개 만들기 때문입니다 ([docs/getting-started.md](docs/getting-started.md)를 보세요). 스크립트는 네이티브 스킬 라우팅이 없는 호스트를 위해 남아 있습니다. `hooks/session-start-test.sh`의 회귀 테스트가 스크립트의 JSON 페이로드를 검증합니다. `jq`가 있을 때와 없을 때 모두입니다.

다음을 건드리는 풀 리퀘스트를 열기 전에 실행하세요.

- `hooks/session-start.sh`
- `skills/using-agent-skills/SKILL.md` (훅이 포함하는 메타 스킬 내용)

```bash
bash hooks/session-start-test.sh
```

기대 출력: `session-start JSON payload OK`. 어서션이 하나라도 실패하면 스크립트는 0이 아닌 코드로 종료합니다.

### jq 없음 폴백 재현

`jq`가 `PATH`에 없어도 훅은 같은 `hookSpecificOutput` 봉투를 내보냅니다. `additionalContext`에는 `jq`가 필요하다고 적힙니다. 그 분기를 로컬에서 실행하려면, 테스트 호출의 `PATH`에서 `jq`의 디렉터리를 빼세요.

```bash
JQ_DIR=$(dirname "$(command -v jq)")
PATH=$(echo "$PATH" | tr ':' '\n' | grep -v "^${JQ_DIR}$" | tr '\n' ':' | sed 's/:$//') \
  bash hooks/session-start-test.sh
```

`jq`가 자기 디렉터리에 있으면 (예: Homebrew의 `/opt/homebrew/bin`, 수동 설치의 `/usr/local/bin`) 깨끗하게 동작합니다. `jq`가 테스트가 의존하는 다른 도구와 시스템 bin을 공유하면 (예: `/usr/bin`의 `mktemp`), 더 단순한 방법은 별도의 패키지 관리자로 `jq`를 설치해 자신만의 bin 디렉터리를 갖게 한 뒤 다시 실행하는 것입니다.

훅의 `command -v jq` 검사는 줄어든 `PATH`에서 실패하고, jq 없음 폴백이 실행되며, 테스트는 메타 스킬 본문 대신 `additionalContext` 안의 `jq is required` 안내를 어서션합니다.

## 이슈 보고

다음을 발견하면 이슈를 여세요.

- 틀리거나 오래된 안내를 주는 스킬
- 흔한 엔지니어링 워크플로우에 대한 커버리지 누락
- 스킬 사이의 불일치

스킬의 안내가 틀렸거나, 오래되었거나, 프로젝트에 적용되지 않았다면
(예를 들어 Maven이나 Gradle 저장소에서 `npm test`를 가정한 경우)
[스킬 공백](https://github.com/addyosmani/agent-skills/issues/new?template=skill-gap.yml)
이슈 양식을 사용하세요. 영향을 받은 스킬, 관련 발췌, 프로젝트
맥락, 대신 무엇을 했는지를 묻습니다. 메인테이너가 자유 형식의 장문 없이도
분류할 수 있을 만큼입니다.

## 라이선스

기여하면, 기여가 MIT License로 라이선스되는 데 동의하는 것입니다.
