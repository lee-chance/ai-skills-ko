# Agent Skills

**AI 코딩 에이전트를 위한 프로덕션 수준의 엔지니어링 스킬.**

스킬은 시니어 엔지니어가 소프트웨어를 만들 때 쓰는 워크플로우, 품질 게이트, 모범 사례를 담습니다. 이 스킬들은 AI 에이전트가 개발의 모든 단계에서 일관되게 따르도록 패키징되어 있습니다.

<a href="https://trendshift.io/repositories/25200" target="_blank"><img src="https://trendshift.io/api/badge/repositories/25200" alt="addyosmani%2Fagent-skills | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

![Addy의 Agent Skills](https://addyosmani.com/assets/images/addys-agent-skills.jpg)

```
  DEFINE          PLAN           BUILD          VERIFY         REVIEW          SHIP
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ Idea │ ───▶ │ Spec │ ───▶ │ Code │ ───▶ │ Test │ ───▶ │  QA  │ ───▶ │  Go  │
 │Refine│      │  PRD │      │ Impl │      │Debug │      │ Gate │      │ Live │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
  /spec          /plan          /build        /test         /review       /ship
```

---

## 커맨드

개발 생명주기에 대응하는 슬래시 커맨드 9개입니다. 각각이 알맞은 스킬을 자동으로 활성화합니다.

| 하고 있는 일 | 커맨드 | 핵심 원칙 |
|-------------------|---------|---------------|
| 무엇을 만들지 정의 | `/spec` | 코드보다 스펙이 먼저 |
| 어떻게 만들지 계획 | `/plan` | 작고 원자적인 작업 |
| 점진적으로 구현 | `/build` | 한 번에 한 조각 |
| 동작함을 증명 | `/test` | 테스트가 증거다 |
| 품질 기준을 정하기 | `/constraints` | 한 번 정하고, 어디서나 강제한다 |
| 머지 전에 리뷰 | `/review` | 코드 건강도를 높인다 |
| 웹 성능을 감사 | `/webperf` | 최적화하기 전에 측정한다 |
| 코드를 단순화 | `/code-simplify` | 기교보다 명확함 |
| 프로덕션에 출시 | `/ship` | 더 빠를수록 더 안전하다 |

Claude Code에서는 플러그인 커맨드로 설치됩니다. `/review`처럼 내장 커맨드와 이름이 같으면 네임스페이스 형식을 쓰세요. `/agent-skills:review`.

스펙이 생긴 뒤 수동 단계를 줄이고 싶으신가요? **`/build auto`**는 계획을 만들고, 한 번의 승인으로 모든 작업을 구현합니다. 계획을 한 번 승인하면 그다음부터는 자율적으로 실행됩니다. 작업 *사이*에 사람이 개입하는 단계를 없앱니다. 검증은 그대로입니다. 모든 작업은 여전히 테스트 주도이고 개별적으로 커밋되며, 실패하거나 위험한 단계에서는 멈춥니다.

스킬은 하고 있는 일에 따라 자동으로 활성화되기도 합니다. API를 설계하면 `api-and-interface-design`이, UI를 만들면 `frontend-ui-engineering`이 켜지고, 그런 식으로 이어집니다.

---

<a id="quick-start"></a>

## 빠른 시작

**가장 빠른 경로. 어떤 에이전트든 명령 하나.** 공개된 [skills CLI](https://github.com/vercel-labs/skills)는 70개 이상의 에이전트(Claude Code, Cursor, Codex, Copilot, Cline 등)에 설치됩니다.

```bash
npx skills add addyosmani/agent-skills            # install all 25 skills
npx skills add addyosmani/agent-skills --list     # browse before installing
```

개별 스킬만 받으려면:

```bash
npx skills add addyosmani/agent-skills --skill code-review-and-quality   # five-axis review before merge
npx skills add addyosmani/agent-skills --skill interview-me              # requirements interrogation, one question at a time
npx skills add addyosmani/agent-skills --skill test-driven-development   # red-green-refactor, enforced
```

> **스킬을 하나만 설치하나요?** 스킬 단위 `npx` 설치는
> `skills/<name>/`만 복사하고, 저장소 수준의 `references/` 디렉터리는 복사하지 않습니다. 스킬 자체는
> 동작하지만, 공유 보충 체크리스트로 가는 경로는 쓸 수 없습니다. 저장소 전체 통합을 쓰거나, 저장소를 클론하거나, 필요한 체크리스트를
> 설치된 스킬 안의 `references/` 디렉터리로 복사하세요. 이 이식성 공백은
> [#361](https://github.com/addyosmani/agent-skills/issues/361)에서 추적합니다.

네이티브 통합을 원하시면 아래에서 도구를 고르세요.

<details>
<summary><b>Claude Code (권장)</b></summary>

**마켓플레이스 설치:**

```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

> **SSH 오류가 나나요?** 마켓플레이스는 SSH로 저장소를 클론합니다. GitHub에 SSH 키가 없다면, [SSH 키를 추가](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)하거나, 마켓플레이스 추가 단계에서 HTTPS 클론을 강제하도록 전체 HTTPS URL을 쓰세요:
> ```bash
> /plugin marketplace add https://github.com/addyosmani/agent-skills.git
> /plugin install agent-skills@addy-agent-skills
> ```
>
> Windows나 macOS에서 `/plugin install`이 여전히 `git@github.com: Permission denied (publickey)`로 실패하면, 서브프로세스 클론에서 GitHub SSH URL을 HTTPS로 바꾸도록 Git을 한 번 설정하는 방법이 권장됩니다:
> ```bash
> git config --global url."https://github.com/".insteadOf git@github.com:
> ```

**로컬 / 개발:**

```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

</details>

<details>
<summary><b>Cursor</b></summary>

워크플로우 스킬은 `.cursor/skills/`에 두고 (`agent-skills/skills/`에서 동기화), 짧은 정책은 `.cursor/rules/*.mdc`에 두세요. 스킬 전문을 규칙에 붙여 넣지 마세요. 두 디렉터리 모두 프로젝트 안에 있습니다. 이 저장소는 `.cursor/` 폴더를 포함하지 않습니다. [docs/cursor-setup.md](docs/cursor-setup.md)를 보세요.

</details>

<details>
<summary><b>Antigravity CLI</b></summary>

스킬과 서브에이전트를 위한 네이티브 플러그인으로 설치합니다. 영향을 받는 Antigravity CLI 릴리스에서는 레거시 커맨드 TOML이 변환된 것으로 보고되지만, 그 래퍼 커맨드는 발견되지 않습니다. 기반이 되는 네임스페이스 스킬을 직접 호출하세요. [docs/antigravity-setup.md](docs/antigravity-setup.md#lifecycle-workflows-and-command-compatibility)를 보세요.

**저장소에서 설치:**

```bash
agy plugin install https://github.com/addyosmani/agent-skills.git
```

**로컬 클론에서 설치:**

```bash
git clone https://github.com/addyosmani/agent-skills.git
agy plugin install ./agent-skills
```

</details>

<details>
<summary><b>Gemini CLI</b></summary>

자동 발견을 위해 네이티브 스킬로 설치하거나, 지속되는 컨텍스트를 위해 `GEMINI.md`에 추가하세요. [docs/gemini-cli-setup.md](docs/gemini-cli-setup.md)를 보세요.

**저장소에서 설치:**

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git --path skills
```

**로컬 클론에서 설치:**

```bash
gemini skills install ./agent-skills/skills/
```

</details>

<details>
<summary><b>Windsurf</b></summary>

스킬 내용을 Windsurf 규칙 설정에 추가하세요. [docs/windsurf-setup.md](docs/windsurf-setup.md)를 보세요.

</details>

<details>
<summary><b>OpenCode</b></summary>

스킬을 `.opencode/skills/`(또는 `~/.config/opencode/skills/`)로 복사하고, 프로젝트 로컬 `AGENTS.md`를 추가한 뒤, 에이전트 주도 실행에는 내장 `skill` 도구를 사용하세요. 선택적 슬래시 커맨드는 `.opencode/commands/` 아래에 추가할 수 있습니다.

[docs/opencode-setup.md](docs/opencode-setup.md)를 보세요.

</details>

<details>
<summary><b>GitHub Copilot</b></summary>

`agents/`의 에이전트 정의를 Copilot 페르소나로 쓰고, 스킬 내용은 `.github/copilot-instructions.md`에 둡니다. 생명주기 슬래시 커맨드(`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`)는 Claude Code 커맨드라 Copilot에는 나타나지 않습니다. 대신 스킬 이름으로 호출하세요 (`/spec-driven-development` 등). [docs/copilot-setup.md](docs/copilot-setup.md)를 보세요.

독립 실행형 `copilot` CLI를 쓰시나요? 플러그인으로 설치하세요. [docs/copilot-cli-setup.md](docs/copilot-cli-setup.md)를 보세요.

</details>

<details>
  <summary><b>Kiro IDE & CLI </b></summary>
  Kiro용 스킬은 ".kiro/skills/" 아래에 있으며, 프로젝트 또는 전역 수준에 둘 수 있습니다. Kiro는 Agents.md도 지원합니다. Kiro 문서: https://kiro.dev/docs/skills/
</details>

<details>
<summary><b>Codex</b></summary>

네이티브 Codex 플러그인으로 설치합니다 (Codex CLI v0.122 이상):

```bash
codex plugin marketplace add addyosmani/agent-skills
codex plugin add agent-skills@agent-skills
```

첫 명령은 마켓플레이스를 등록하고, 두 번째 명령은 플러그인을 설치합니다. Codex는 `.codex-plugin/plugin.json`을 통해 루트 `skills/` 디렉터리를 직접 읽습니다. 설치한 뒤에는 채팅에서 `@`로 스킬을 호출하세요 (예: `@spec-driven-development`). 로컬 설치와 문제 해결은 [docs/codex-setup.md](docs/codex-setup.md)를 보세요.

</details>

<details>
<summary><b>Command Code</b></summary>

내장 `cmd skills` 명령으로 네이티브 설치합니다. Command Code는 저장소를 클론하고, 모든 `SKILL.md`를 찾은 뒤 `.commandcode/skills/`에 설치합니다:

```bash
cmd skills add addyosmani/agent-skills            # pick skills to install (project)
cmd skills add addyosmani/agent-skills --global   # install for all projects (~/.commandcode/skills/)
cmd skills add addyosmani/agent-skills -s spec-driven-development  # install a specific skill
```

설치된 스킬은 TUI 슬래시 메뉴에 나타납니다. 예: `/spec-driven-development`. [docs/commandcode-setup.md](docs/commandcode-setup.md)를 보세요.

</details>

<details>
<summary><b>다른 에이전트</b></summary>

스킬은 일반 마크다운입니다. 시스템 프롬프트나 지시 파일을 받는 에이전트라면 어디서든 동작합니다. [docs/getting-started.md](docs/getting-started.md)를 보세요. 팩을 설치하지만 위에 없는 호스트는 [docs/other-hosts.md](docs/other-hosts.md)에 있습니다.

</details>



---

## 도입

이미 설치하셨나요? 팩을 롤아웃하는 방법은 코드베이스에 따라 다릅니다. **[도입 가이드](docs/adoption-guide.md)**는 두 경로를 다룹니다. 그린필드 프로젝트라면 첫날부터 전체 생명주기를 쓰고, 이미 자리 잡은 코드베이스라면 점진적이고 검증을 우선하는 롤아웃을 합니다.

---

<a id="all-25-skills"></a>

## 스킬 25개 전체

위의 커맨드는 진입점입니다. 팩에는 스킬이 모두 25개 있습니다. 생명주기 스킬 24개와 메타 스킬 `using-agent-skills`입니다. 각 스킬은 단계, 검증 게이트, 합리화 방지 표가 있는 구조화된 워크플로우입니다. 어떤 스킬이든 직접 참조할 수도 있습니다.

### 메타 (Meta) - 어떤 스킬이 적용되는지 찾기

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [using-agent-skills](skills/using-agent-skills/SKILL.md) | 들어오는 작업을 알맞은 스킬 워크플로우에 매핑하고, 공유 운영 규칙을 정의합니다 | 세션을 시작하거나 어떤 스킬이 적용되는지 정할 때 |

### 정의 (Define) - 무엇을 만들지 명확히 하기

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [interview-me](skills/interview-me/SKILL.md) | 사용자가 원해야 한다고 생각하는 것이 아니라 실제로 원하는 것을, 확신이 약 95%가 될 때까지 한 번에 질문 하나씩 끌어내는 인터뷰 | 요청의 스펙이 부족하거나, 사용자가 "interview me" / "grill me"를 호출할 때 |
| [idea-refine](skills/idea-refine/SKILL.md) | 모호한 아이디어를 구체적인 제안으로 바꾸는 구조화된 발산/수렴 사고 | 탐색이 필요한 거친 구상이 있을 때 |
| [spec-driven-development](skills/spec-driven-development/SKILL.md) | 코드를 작성하기 전에 목표, 커맨드, 구조, 코드 스타일, 테스트, 경계를 담은 PRD를 작성합니다 | 새 프로젝트, 기능, 또는 큰 변경을 시작할 때 |
| [constraint-driven-development](skills/constraint-driven-development/SKILL.md) | 합리적인 기본 임계값으로 품질 기준을 인터뷰하고, CONSTRAINTS.md를 쓰며, 비용에 따라 각 검사를 배치하고, 에이전트가 검사를 끄거나 통과시키려고 테스트를 건너뛰는 경우를 잡습니다 | 기준이 문서로 없거나, 에이전트가 누가 읽는 양보다 많이 만들어 낼 때 |

### 계획 (Plan) - 쪼개기

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | 스펙을 인수 기준과 의존 순서가 있는 작고 검증 가능한 작업으로 분해합니다 | 스펙은 있고 구현 가능한 단위가 필요할 때 |

### 구현 (Build) - 코드 작성

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [incremental-implementation](skills/incremental-implementation/SKILL.md) | 얇은 수직 슬라이스. 구현하고, 테스트하고, 검증하고, 커밋합니다. 피처 플래그, 안전한 기본값, 롤백하기 쉬운 변경 | 파일을 둘 이상 건드리는 모든 변경 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | Red-Green-Refactor, 테스트 피라미드 (80/15/5), 테스트 크기, DRY보다 DAMP, Beyonce Rule, 브라우저 테스트 | 로직을 구현하거나, 버그를 고치거나, 동작을 바꿀 때 |
| [context-engineering](skills/context-engineering/SKILL.md) | 적절한 시점에 적절한 정보를 에이전트에 제공합니다. 규칙 파일, 컨텍스트 패킹, MCP 통합 | 세션을 시작하거나, 작업을 바꾸거나, 출력 품질이 떨어질 때 |
| [source-driven-development](skills/source-driven-development/SKILL.md) | 모든 프레임워크 결정을 공식 문서에 근거하게 합니다. 검증하고, 출처를 밝히고, 검증되지 않은 부분을 표시합니다 | 어떤 프레임워크나 라이브러리든 출처가 밝혀진 권위 있는 코드가 필요할 때 |
| [doubt-driven-development](skills/doubt-driven-development/SKILL.md) | 진행 중인 사소하지 않은 결정마다 새 컨텍스트에서 적대적으로 리뷰합니다. CLAIM → EXTRACT → DOUBT → RECONCILE → STOP. 사용자가 허용하면 교차 모델 에스컬레이션도 가능합니다 | 이해관계가 클 때 (프로덕션, 보안, 되돌릴 수 없는 변경), 익숙하지 않은 코드에서 작업할 때, 또는 확신에 찬 출력은 나중에 디버그하는 것보다 지금 검증하는 편이 쌀 때 |
| [frontend-ui-engineering](skills/frontend-ui-engineering/SKILL.md) | 컴포넌트 아키텍처, 디자인 시스템, 상태 관리, 반응형 디자인, WCAG 2.1 AA 접근성 | 사용자에게 보이는 인터페이스를 만들거나 수정할 때 |
| [api-and-interface-design](skills/api-and-interface-design/SKILL.md) | 계약 우선 설계, Hyrum's Law, One-Version Rule, 오류 의미, 경계 검증 | API, 모듈 경계, 공개 인터페이스를 설계할 때 |

### 검증 (Verify) - 동작함을 증명하기

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [browser-testing-with-devtools](skills/browser-testing-with-devtools/SKILL.md) | 실시간 런타임 데이터를 위한 Chrome DevTools MCP. DOM 검사, 콘솔 로그, 네트워크 트레이스, 성능 프로파일링 | 브라우저에서 실행되는 것을 만들거나 디버깅할 때 |
| [debugging-and-error-recovery](skills/debugging-and-error-recovery/SKILL.md) | 5단계 분류: 재현, 국소화, 축소, 수정, 가드. 라인 정지 규칙, 안전한 폴백 | 테스트가 실패하거나, 빌드가 깨지거나, 동작이 예상과 다를 때 |

### 리뷰 (Review) - 머지 전 품질 게이트

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | 5축 리뷰, 변경 크기 (약 100줄), 심각도 라벨 (Nit/Optional/FYI), 리뷰 속도 기준, 분할 전략 | 어떤 변경이든 머지하기 전에 |
| [code-simplification](skills/code-simplification/SKILL.md) | Chesterton's Fence, Rule of 500. 동작을 그대로 유지하면서 복잡도를 줄입니다 | 코드는 동작하지만 읽거나 유지하기가 필요 이상으로 어려울 때 |
| [security-and-hardening](skills/security-and-hardening/SKILL.md) | OWASP Top 10 예방, 인증 패턴, 시크릿 관리, 의존성 감사, 3단계 경계 시스템 | 사용자 입력, 인증, 데이터 저장, 외부 통합을 다룰 때 |
| [performance-optimization](skills/performance-optimization/SKILL.md) | 측정 우선 접근. Core Web Vitals 목표, 프로파일링 워크플로우, 번들 분석, 안티패턴 탐지 | 성능 요구 사항이 있거나 회귀가 의심될 때 |

### 출시 (Ship) - 자신 있게 배포하기

| 스킬 | 하는 일 | 사용할 때 |
|-------|-------------|----------|
| [git-workflow-and-versioning](skills/git-workflow-and-versioning/SKILL.md) | 트렁크 기반 개발, 원자적 커밋, 변경 크기 (약 100줄), 커밋을 저장 지점으로 쓰는 패턴 | 코드를 변경할 때 (항상) |
| [ci-cd-and-automation](skills/ci-cd-and-automation/SKILL.md) | Shift Left, Faster is Safer, 피처 플래그, 품질 게이트 파이프라인, 실패 피드백 루프 | 빌드와 배포 파이프라인을 설정하거나 수정할 때 |
| [deprecation-and-migration](skills/deprecation-and-migration/SKILL.md) | 코드를 부채로 보는 관점, 강제 지원 종료와 권고 지원 종료, 마이그레이션 패턴, 좀비 코드 제거 | 오래된 시스템을 제거하거나, 사용자를 마이그레이션하거나, 기능을 종료할 때 |
| [documentation-and-adrs](skills/documentation-and-adrs/SKILL.md) | 아키텍처 결정 기록 (ADR), API 문서, 인라인 문서 기준. *왜*를 문서화합니다 | 아키텍처 결정을 내리거나, API를 바꾸거나, 기능을 출시할 때 |
| [observability-and-instrumentation](skills/observability-and-instrumentation/SKILL.md) | 구조화 로깅, RED 메트릭, OpenTelemetry 트레이싱, 증상 기반 알림. 만들면서 계측합니다 | 텔레메트리를 추가하거나, 프로덕션에서 실행되는 것을 출시할 때 |
| [shipping-and-launch](skills/shipping-and-launch/SKILL.md) | 출시 전 체크리스트, 피처 플래그 생명주기, 단계적 롤아웃, 롤백 절차, 모니터링 설정 | 프로덕션 배포를 준비할 때 |

---

## 에이전트 페르소나

목적에 맞춘 리뷰를 위한, 미리 구성된 전문가 페르소나입니다.

| 에이전트 | 역할 | 관점 |
|-------|------|-------------|
| [code-reviewer](agents/code-reviewer.md) | 시니어 스태프 엔지니어 | "스태프 엔지니어가 이것을 승인할까?"를 기준으로 하는 5축 코드 리뷰 |
| [test-engineer](agents/test-engineer.md) | QA 전문가 | 테스트 전략, 커버리지 분석, Prove-It 패턴 |
| [security-auditor](agents/security-auditor.md) | 보안 엔지니어 | 취약점 탐지, 위협 모델링, OWASP 평가 |
| [web-performance-auditor](agents/web-performance-auditor.md) | 웹 성능 엔지니어 | Quick/Deep 모드와 메트릭 정직 규칙이 있는 Core Web Vitals 감사. `/webperf`로 실행합니다 |

의사결정 매트릭스, 오케스트레이션 규칙, 페르소나가 스킬 및 슬래시 커맨드와 어떻게 조합되는지는 [docs/agents.md](docs/agents.md)를 보세요.

---

## 참조 체크리스트

스킬이 필요할 때 가져오는 빠른 참조 자료입니다.

| 참조 | 다루는 내용 |
|-----------|--------|
| [definition-of-done.md](references/definition-of-done.md) | 프로젝트 전체에서 모든 변경이 넘어야 하는 상시 기준. 작업별 인수 기준과 대비됩니다 |
| [testing-patterns.md](references/testing-patterns.md) | 테스트 구조, 이름 짓기, 모킹, React/API/E2E 예시, 안티패턴 (JavaScript/TypeScript) |
| [security-checklist.md](references/security-checklist.md) | 커밋 전 검사, 인증, 입력 검증, 헤더, CORS, OWASP Top 10 |
| [performance-checklist.md](references/performance-checklist.md) | Core Web Vitals 목표, 프론트엔드/백엔드 체크리스트, 측정 명령 |
| [accessibility-checklist.md](references/accessibility-checklist.md) | 키보드 탐색, 스크린 리더, 시각 디자인, ARIA, 테스트 도구 |
| [observability-checklist.md](references/observability-checklist.md) | 온콜 질문, 구조화 로깅, RED/USE 메트릭, 트레이싱, 증상 기반 알림, 출시 전 게이트 |
| [orchestration-patterns.md](references/orchestration-patterns.md) | 권장하는 다중 페르소나 오케스트레이션 패턴, 안티패턴, "페르소나는 페르소나를 호출하지 않는다" 규칙 |

---

## 스킬이 동작하는 방식

모든 스킬은 일관된 구조를 따릅니다.

```
┌─────────────────────────────────────────────────┐
│  SKILL.md                                       │
│                                                 │
│  ┌─ Frontmatter ─────────────────────────────┐  │
│  │ name: lowercase-hyphen-name               │  │
│  │ description: Guides agents through [task].│  │
│  │              Use when…                    │  │
│  └───────────────────────────────────────────┘  │                                                                                                
│  Overview         → What this skill does        │
│  When to Use      → Triggering conditions       │
│  Process          → Step-by-step workflow       │
│  Rationalizations → Excuses + rebuttals         │
│  Red Flags        → Signs something's wrong     │
│  Verification     → Evidence requirements       │
└─────────────────────────────────────────────────┘
```

**핵심 설계 선택:**

- **산문이 아니라 절차입니다.** 스킬은 에이전트가 읽는 참조 문서가 아니라, 에이전트가 따르는 워크플로우입니다. 각각 단계, 체크포인트, 종료 기준이 있습니다.
- **합리화 방지.** 모든 스킬에는 에이전트가 단계를 건너뛸 때 쓰는 흔한 변명 표가 있습니다 (예: "테스트는 나중에 추가하면 된다"). 문서화된 반박도 함께 있습니다.
- **검증은 타협할 수 없습니다.** 모든 스킬은 증거 요구로 끝납니다. 테스트 통과, 빌드 출력, 런타임 데이터입니다. "맞아 보인다"는 결코 충분하지 않습니다.
- **점진적 공개.** `SKILL.md`가 진입점입니다. 보조 참조는 필요할 때만 불러와 토큰 사용을 최소로 유지합니다.

---

## 프로젝트 구조

이식 가능한 핵심은 공유 디렉터리에 있습니다. 호스트별 경로는 브랜딩용 별칭이 아니라, 도구가 원래 탐색하는 규칙입니다. 이름을 바꾸거나 합치면 그 정확한 위치를 훑는 도구가 깨집니다.

| 계층 / 소비자 | 저장소 경로 | 목적 |
|---|---|---|
| 공유 워크플로우 핵심 | `skills/` (스킬 25개) | 모든 통합이 쓰는 이식 가능한 `SKILL.md` 워크플로우 |
| 공유 리뷰 자료 | `agents/` (페르소나 4개), `references/` (체크리스트 7개) | 저장소 전체 설치에 포함되는 전문 리뷰어와 팩 수준 체크리스트 |
| Claude Code 어댑터 | `.claude/commands/` (커맨드 9개), `.claude-plugin/`, `hooks/` | 슬래시 커맨드 래퍼, 마켓플레이스 메타데이터, 생명주기 훅 |
| Gemini CLI 어댑터 | `.gemini/commands/` (커맨드 9개) | Gemini 네이티브 TOML 커맨드 래퍼 |
| Antigravity CLI 어댑터 | `commands/` (커맨드 9개), `plugin.json` | 레거시 TOML 래퍼와 루트 플러그인 매니페스트. [알려진 래퍼 제한](docs/antigravity-setup.md#lifecycle-workflows-and-command-compatibility)을 보세요 |
| Codex 어댑터 | `.codex-plugin/`, `.agents/plugins/` | Codex 플러그인 메타데이터와 마켓플레이스 등록. Codex는 `skills/`를 직접 사용합니다 |
| GitHub Copilot CLI 어댑터 | `plugin.json` | 루트 플러그인 메타데이터. Copilot CLI는 관례에 따라 `skills/`를 찾고, 생명주기 래퍼는 등록하지 않습니다 |
| 기여자 도구 | `scripts/` (스크립트 13개), `evals/` (케이스 파일 25개), `.github/workflows/` | 검증, 라우팅 평가, CI |
| 문서 | `docs/` | 공통 안내와 도구별 설정 가이드 |

체크인된 어댑터 디렉터리가 없는 도구는 공유 `skills/` 핵심을 각자의 네이티브 위치에 설치하거나 복사합니다. [빠른 시작](#quick-start)이 지원하는 호스트마다 설정 가이드로 연결합니다.

---

## Agent Skills를 쓰는 이유

AI 코딩 에이전트는 기본적으로 가장 짧은 경로를 택합니다. 그래서 스펙, 테스트, 보안 리뷰, 소프트웨어를 믿을 수 있게 하는 관행을 건너뛰기 쉽습니다. Agent Skills는 시니어 엔지니어가 프로덕션 코드에 가져오는 것과 같은 규율을 강제하는 구조화된 워크플로우를 에이전트에 줍니다.

각 스킬은 어렵게 얻은 엔지니어링 판단을 담습니다. *언제* 스펙을 쓸지, *무엇을* 테스트할지, *어떻게* 리뷰할지, *언제* 출시할지입니다. 이것은 일반적인 프롬프트가 아닙니다. 프로덕션 품질의 작업과 프로토타입 품질의 작업을 가르는, 의견이 분명하고 절차로 이끄는 워크플로우입니다.

스킬에는 Google 엔지니어링 문화의 모범 사례가 녹아 있습니다. [Software Engineering at Google](https://abseil.io/resources/swe-book)과 Google의 [엔지니어링 관행 가이드](https://google.github.io/eng-practices/)에 나온 개념이 포함됩니다. API 설계의 Hyrum's Law, 테스트의 Beyonce Rule과 테스트 피라미드, 코드 리뷰의 변경 크기와 리뷰 속도 기준, 단순화의 Chesterton's Fence, Git 워크플로우의 트렁크 기반 개발, CI/CD의 Shift Left와 피처 플래그, 그리고 코드를 부채로 다루는 지원 종료 스킬을 만날 수 있습니다. 이것은 추상적인 원칙으로 끝나지 않습니다. 에이전트가 따르는 단계별 워크플로우 안에 직접 들어가 있습니다.

---

## 비교

[Superpowers](https://github.com/obra/superpowers)나 [Matt Pocock의 스킬](https://github.com/mattpocock/skills)과 어떻게 다른지 궁금하신가요? 셋이 어떻게 다르게 생겼는지, 각각을 언제 쓰면 되는지를 솔직하게 나란히 본 **[docs/comparison.md](docs/comparison.md)**를 보세요. 통제된 [맞대결 실험](https://www.linkedin.com/pulse/superpowers-vs-agent-skills-faster-shipping-safer-reasoning-om-mishra-dzakf/) 링크도 있습니다.

---

## 기여

스킬은 **구체적**이어야 합니다 (모호한 조언이 아니라 실행 가능한 단계). **검증 가능**해야 합니다 (증거 요구가 있는 명확한 종료 기준). **실전에서 검증**되어야 합니다 (실제 워크플로우에 기반). **최소**여야 합니다 (에이전트를 이끄는 데 필요한 것만).

형식 스펙은 [docs/skill-anatomy.md](docs/skill-anatomy.md), 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md), 이식 가능한 `SKILL.md` frontmatter를 깨지 않고 모델 라우팅, 도구 제한, 그 밖의 에이전트별 런타임 제어를 적용하는 방법은 [docs/advanced-per-agent-configuration.md](docs/advanced-per-agent-configuration.md)를 보세요.

---

## 팀

agent-skills를 만들고 유지하는 사람들:

| | 이름 | GitHub | 역할 |
|---|------|--------|------|
| <img src="https://github.com/addyosmani.png?size=120" width="60" height="60" alt="Addy Osmani"> | **Addy Osmani** | [@addyosmani](https://github.com/addyosmani) | 제작자 |
| <img src="https://github.com/federicobartoli.png?size=120" width="60" height="60" alt="Federico Bartoli"> | **Federico Bartoli** | [@federicobartoli](https://github.com/federicobartoli) | 협업자 |
| <img src="https://github.com/nucliweb.png?size=120" width="60" height="60" alt="Joan León"> | **Joan León** | [@nucliweb](https://github.com/nucliweb) | 협업자 |

---

## 라이선스

MIT. 이 스킬을 프로젝트, 팀, 도구에서 사용할 수 있습니다.
