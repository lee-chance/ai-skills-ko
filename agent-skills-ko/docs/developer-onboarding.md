# 개발자 온보딩

이 가이드는 agent-skills 저장소 **자체**에서 일하는 사람을 위한 것입니다. 스킬을 기여하고, 문서를 고치고, eval 하네스를 개선하는 작업입니다. 자기 프로젝트에서 스킬을 *사용*하려면 [getting-started.md](getting-started.md)를 보세요.

규칙집이 아니라 안내 투어입니다. 규칙은 [CONTRIBUTING.md](../CONTRIBUTING.md)(기여 워크플로우), [skill-anatomy.md](skill-anatomy.md)(스킬 형식), [evals/README.md](../evals/README.md)(eval 프레임워크)에 있습니다. 이 문서는 각각을 언제 읽고, 조각이 어떻게 맞물리는지 알려 줍니다.

---

## 1. 정신 모델

저장소에는 조합할 수 있는 층이 다섯 개 있습니다. 각 층이 *무엇을 위한 것인지* 알면, 가장 흔한 기여 실수(참조 자료를 스킬 안에 넣기, 다른 페르소나로 라우팅하는 페르소나 만들기, 스킬 사이에 내용을 복제하기)를 막을 수 있습니다.

| 층 | 위치 | 역할 | 한 단어로 |
|---|---|---|---|
| **스킬** | `skills/<name>/SKILL.md` | 검증 게이트가 있는 단계별 워크플로우 | *어떻게* |
| **페르소나** | `agents/<role>.md` | 관점과 출력 형식이 있는 역할 | *누가* |
| **커맨드** | `.claude/commands/`, `.gemini/commands/`, `commands/` | 사용자에게 보이는 진입점. 오케스트레이션 층 | *언제* |
| **참조** | `references/*.md` | 스킬이 필요할 때 가져오는 체크리스트 | *무엇을 확인할지* |
| **Eval** | `evals/cases/<name>.json` | 스킬이 트리거되고 올바르게 동작한다는 증거 | *동작하는가* |

일찍 익혀 둘 구조 규칙 두 가지입니다.

- **사용자(또는 슬래시 커맨드)가 오케스트레이터입니다.** 페르소나는 다른 페르소나를 호출하지 않습니다. 인정된 다중 페르소나 패턴은 병합 단계가 있는 병렬 팬아웃뿐입니다([references/orchestration-patterns.md](../references/orchestration-patterns.md)를 보세요).
- **복제하지 말고 참조하세요.** 스킬은 내용을 다시 적지 않고 다른 스킬과 `references/`로 링크합니다. 같은 규칙이 이 문서를 포함한 문서에도 적용됩니다.

사람을 자주 헷갈리게 하는 범위 주의점입니다. 저장소 루트의 `AGENTS.md`와 `CLAUDE.md`는 *이 저장소*에서 일하는 에이전트를 설정합니다. 재사용 자산이 아니며, 설정 가이드는 사용자에게 자기 프로젝트로 복사하라고 말해서는 안 됩니다. 재사용 자산은 스킬입니다.

커맨드는 세 개의 병렬 디렉터리(Claude Code, Gemini CLI, Antigravity)에 있습니다. 하나를 고치면 CI가 셋 모두의 일치를 검사합니다. §3을 보세요.

## 2. 로컬 설정

```bash
git clone https://github.com/addyosmani/agent-skills.git
cd agent-skills
```

빌드 단계도 `package.json`도 없습니다. 검증기는 평범한 Node 스크립트입니다. 필요한 것은 다음과 같습니다.

- **Node 24** (CI가 고정하는 버전). `scripts/` 검증기용
- **bash** (훅 회귀 테스트에는 `jq` 권장)
- 스킬을 제안하기 전 중복 풀 리퀘스트 검사용 **`gh` CLI**
- Tier 3 행동 eval을 로컬에서 돌리려면 **Claude Code**만

로컬 체크아웃으로 팩을 실제로 시험하려면 다음을 실행하세요.

```bash
claude --plugin-dir /path/to/agent-skills
```

## 3. 검증 루프

이 저장소는 스스로에게도 같은 기준을 적용합니다. 스킬에서 검증은 협상 대상이 아니고, 이 저장소에 대한 기여에서도 마찬가지입니다. CI가 Claude Code CLI 없이 실행하는 것은 모두 로컬에서 몇 초 만에 돌릴 수 있습니다. 아래가 그 묶음이며, 각 검사가 다루는 내용으로 묶었습니다(워크플로우는 여러 job에 나눠 둡니다).

```bash
# Tier 1, structural: frontmatter, naming, required sections, layout and line budget
node scripts/validate-skills.js

# Links from skills to references/ resolve, including #anchor fragments
node scripts/validate-reference-links.js

# Every plugin manifest carries the same version
node scripts/validate-versions.js

# Command parity and description sync across the three command directories
node scripts/validate-commands.js

# Spec/plan/todo artifact paths agree across every command surface and the docs
node scripts/validate-artifact-paths.js

# Unit tests for the validators and the eval runner
# (on PowerShell, list the files instead of using the globs)
node --test scripts/*-test.js scripts/lib/*-test.js

# Tier 2, trigger & routing: positive prompts rank top-k, negatives don't collide.
# CI enforces the rank-1 floor, so run it the way CI does.
node scripts/run-evals.js --min-rank1 95

# Tier 3, behavioral (on demand, spends tokens; --dry-run prints the plan)
node scripts/run-evals.js --behavioral <skill-name> --dry-run

# Hook regression tests, required if you touch anything under hooks/ or
# skills/using-agent-skills/SKILL.md (the session-start script embeds that file)
bash hooks/session-start-test.sh
bash hooks/sdd-cache-test.sh
bash hooks/simplify-ignore-test.sh
```

CI는 이 묶음을 Ubuntu에서 실행한 다음, 검증기와 단위 테스트를 macOS와 Windows에서 다시 실행합니다. 그래서 경로 처리와 줄바꿈도 검증됩니다. Claude Code CLI가 필요한 job이 둘 더 있고, 위 블록에는 없습니다. `claude plugin validate .`는 마켓플레이스와 플러그인 매니페스트를 검사하고, 마켓플레이스 설치(`claude plugin marketplace add ./`, 그다음 `claude plugin install agent-skills@addy-agent-skills --scope user`)는 체크아웃에서 플러그인이 설치됨을 증명합니다. `plugin.json`, `.claude-plugin/` 매니페스트, 또는 설치 경로가 읽는 것을 건드렸다면 이것들도 실행하세요. 워크플로우에 단계가 늘면 이 블록에도 같은 줄이 늘어야 합니다. 둘이 어긋나면 [워크플로우 파일](../.github/workflows/test-plugin-install.yml)이 기준입니다.

하네스를 건드리지 않더라도 eval 세 티어는 이해할 가치가 있습니다. 빨간 Tier 2는 보통 eval이 아니라 *스킬의 description을 고치라*는 뜻이기 때문입니다. Tier 2는 라우팅의 어휘적 근사(description에 대한 어간 추출 TF-IDF)이고, 노리는 실패 모드는 두 가지입니다. 사용자가 실제로 말하는 어휘가 description에 없는 경우, 그리고 너무 넓은 description이 맞는 스킬보다 높은 순위를 차지하는 경우입니다. 전체 설계, 스키마, 신뢰 수준 규칙은 [evals/README.md](../evals/README.md)에 있습니다.

모든 풀 리퀘스트 전에 관련 부분만 실행하세요. Tier 1 + Tier 2 + 커맨드 일치까지 녹색으로 도착한 풀 리퀘스트는 리뷰할 수 있습니다. 그렇지 않으면 내용을 읽기 전에 형식에서 되돌아옵니다.

## 4. 기여 경로

### 경로 1: 기존 스킬을 고치거나 개선 (가장 흔하고, 첫 풀 리퀘스트로 가장 좋음)

1. 변경은 집중되고 작게 유지하세요. 스킬의 구조와 톤은 보존하세요.
2. 프론트매터 `description`을 바꿨다면 Tier 2 영향을 예상하세요. `node scripts/run-evals.js`를 실행하고, 그 스킬의 트리거 프롬프트가 여전히 순위에 드는지 확인하세요.
3. Tier 1을 실행해 프론트매터가 여전히 유효한지 확인하세요.

### 경로 2: 새 스킬 제안 (기준이 더 높습니다. 사전 점검을 하세요)

카탈로그가 생애주기의 대부분을 이미 다루므로, 빈틈이 있다는 입증 책임은 제안하는 쪽에 있습니다. 무엇이든 쓰기 전에 [CONTRIBUTING.md](../CONTRIBUTING.md#before-proposing-a-new-skill)의 사전 점검을 실행하세요. 카탈로그를 검색하고, 열린 풀 리퀘스트를 확인하고(`gh pr list --state open`. 거의 중복인 묶음이 이미 있습니다), 아이디어가 [skill-anatomy.md](skill-anatomy.md)에 맞는지 확인하고, 풀 리퀘스트 설명에 그 빈틈을 명시적으로 정당화하세요. 기존 스킬과 겹치면, 새 디렉터리보다 그 스킬을 집중해서 고치는 편이 낫습니다.

새 스킬은 파일 하나가 아니라 한 세트로 나갑니다. `skills/<kebab-case-name>/SKILL.md`, 짝이 되는 `evals/cases/<name>.json`, 그리고 실행 가능한 도우미를 함께 내보낼 때만 `scripts/` 디렉터리입니다(참조 자료는 `references/`에 두고, 스킬 안에는 두지 않습니다). 정확한 프론트매터 규칙, 섹션 구조, eval 케이스 최소 조건은 [CONTRIBUTING.md](../CONTRIBUTING.md#structure)와 [skill-anatomy.md](skill-anatomy.md)에 있습니다. 이 투어가 아니라 거기서 가져가세요. 그래야 둘이 어긋나지 않습니다.

찾아보기보다 몸에 익힐 점 하나: 트리거 프롬프트를 쓸 때는 사용자가 실제로 말하는 방식을 풀어 쓰세요. description을 프롬프트에 복사하면 eval을 속일 뿐, 아무것도 알려 주지 않습니다.

### 경로 3: 문서, 참조, 하네스

- 문서와 스킬은 **영어만** 받습니다. 번역은 어긋나기 때문에 받지 않습니다([CONTRIBUTING.md](../CONTRIBUTING.md#translations)에 이유가 있습니다).
- `scripts/run-evals.js`나 eval 스키마를 바꾸는 변경은 skill-creator의 `evals.json` 스키마와 호환을 유지해야 합니다(행동 티어용으로 글자 그대로 채택했습니다. 그 호환은 기능이지 우연이 아닙니다).
- `hooks/` 또는 `skills/using-agent-skills/SKILL.md`(세션 시작 스크립트가 이 파일을 포함합니다)를 건드리면 훅 회귀 테스트 세 가지(§3)가 필요합니다. `scripts/`를 건드리면 해당 단위 테스트가 필요합니다.

## 5. 풀 리퀘스트 전 체크리스트

- [ ] Tier 1 녹색: `node scripts/validate-skills.js`, 그리고 `references/`로 링크하는 스킬을 건드렸다면 `node scripts/validate-reference-links.js`
- [ ] CI와 같은 방식의 Tier 2 녹색: `node scripts/run-evals.js --min-rank1 95`
- [ ] 커맨드 디렉터리를 건드렸다면 커맨드 일치와 아티팩트 경로 녹색: `node scripts/validate-commands.js`와 `node scripts/validate-artifact-paths.js`
- [ ] `scripts/`를 건드렸다면 단위 테스트 녹색: `node --test scripts/*-test.js scripts/lib/*-test.js`
- [ ] `hooks/` 또는 `using-agent-skills`를 건드렸다면 훅 테스트 녹색: `bash hooks/session-start-test.sh`, `bash hooks/sdd-cache-test.sh`, `bash hooks/simplify-ignore-test.sh`
- [ ] 새 스킬이면 eval 케이스 파일이 있고, 최소 트리거/행동 개수를 갖춤
- [ ] 새 스킬이면 풀 리퀘스트 설명에 빈틈을 정당화함. 카탈로그와 열린 풀 리퀘스트를 확인함
- [ ] 복제된 내용이 없음. 교차 참조를 사용함
- [ ] 변경이 작고 집중됨 (이 저장소의 `code-review-and-quality` 변경 크기 지침이 여기 기여에도 적용됩니다)

## 6. 권장 읽기 순서

1. [README.md](../README.md): 카탈로그와 생애주기 다이어그램 (10분)
2. `skills/using-agent-skills/SKILL.md`: 에이전트 쪽에서 라우팅이 동작하는 방식
3. 잘 자리 잡은 스킬을 끝까지 하나 (예: `test-driven-development`). 예시로 구조를 익히기
4. [skill-anatomy.md](skill-anatomy.md): 이제 맥락이 있는 형식 스펙
5. [evals/README.md](../evals/README.md): 세 티어와 케이스 형식
6. [CONTRIBUTING.md](../CONTRIBUTING.md) + [AGENTS.md](../AGENTS.md): 규칙과 저장소 범위의 에이전트 설정
