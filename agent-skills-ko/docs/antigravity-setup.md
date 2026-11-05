# Antigravity CLI (agy)에서 agent-skills 사용하기

`agent-skills` 패키지는 Antigravity CLI(`agy`)에 네이티브 플러그인으로 설치할 수 있으며, 에이전트에게 구조화된 워크플로우와 페르소나를 제공합니다.

## 설정

### 방법 1: 네이티브 플러그인 설치 (권장)

Antigravity CLI에는 스킬과 에이전트를 등록하는 정식 [플러그인 시스템](https://www.agy.dev/docs/plugins/)이 있습니다. 이 저장소에는 레거시 커맨드 TOML도 들어 있지만, 영향을 받는 `agy` 릴리스는 변환된 래퍼를 노출하지 않습니다. [라이프사이클 워크플로우와 커맨드 호환성](#lifecycle-workflows-and-command-compatibility)을 보세요.

**원격 저장소에서 설치:**

```bash
agy plugin install https://github.com/addyosmani/agent-skills.git
```

**로컬 클론에서 설치:**

1. 저장소를 클론합니다.
   ```bash
   git clone https://github.com/addyosmani/agent-skills.git
   ```
2. `agy`로 플러그인을 설치합니다.
   ```bash
   agy plugin install /path/to/agent-skills
   ```

이렇게 하면 플러그인을 검증하고 전역 Antigravity 구성 디렉터리(`~/.gemini/config/plugins/agent-skills/`)에 설치합니다.

> **참고:** 현재 agy 릴리스에서 플러그인은 이전 버전이 쓰던 레거시 경로 `~/.gemini/antigravity-cli/plugins/`가 아니라 `~/.gemini/config/plugins/` 아래에 설치됩니다. 레거시 경로에서 플러그인이 보이지 않으면 먼저 `~/.gemini/config/plugins/agent-skills/`를 확인하세요.

### 방법 2: Gemini CLI에서 가져오기

레거시 Gemini CLI 설치에 `agent-skills`를 이미 설치했다면 직접 가져올 수 있습니다.
```bash
agy plugin import gemini
```

설치한 뒤 활성 플러그인을 확인하세요.
```bash
agy plugin list
```

---

<a id="lifecycle-workflows-and-command-compatibility"></a>

## 라이프사이클 워크플로우와 커맨드 호환성

Antigravity의 [마이그레이션 도구](https://www.agy.dev/docs/cli/gcli-migration/)는 `commands/*.toml`의 레거시 정의 9개를 "converted to skills"로 보고합니다. 영향을 받는 `agy` 1.1.x 릴리스에서는 검증은 성공하지만, 변환된 래퍼가 슬래시 커맨드나 스킬 카탈로그에 나타나지 않습니다. 따라서 `agy plugin validate`가 성공해도 파일이 올바른 형식이라는 뜻이지, `/build`와 다른 짧은 래퍼를 쓸 수 있다는 뜻은 아닙니다. 이 문제는 [agent-skills #445](https://github.com/addyosmani/agent-skills/issues/445)와 업스트림 [antigravity-cli #788](https://github.com/google-antigravity/antigravity-cli/issues/788)에서 추적 중입니다.

그 임포터 제한이 적용되는 동안에는 네이티브 플러그인 스킬을 직접 사용하세요.

| 의도한 래퍼 | Antigravity에서 직접 호출 | 참고 |
|------------------|-------------------------------|-------|
| `/spec` | `/agent-skills:spec-driven-development` | 코드를 작성하기 전에 구조화된 스펙을 작성합니다 |
| `/constraints` | `/agent-skills:constraint-driven-development` | 프로젝트의 품질 기준을 정의하고 강제합니다 |
| `/planning` | `/agent-skills:planning-and-task-breakdown` | Antigravity에 내장된 `/planning` 커맨드는 별도의 플랜 모드 제어입니다 |
| `/build` | `/agent-skills:incremental-implementation` | `/agent-skills:test-driven-development`도 호출하세요. 래퍼만 있는 `/build auto` 오케스트레이션은 사용할 수 없습니다 |
| `/test` | `/agent-skills:test-driven-development` | red-green-refactor 워크플로우를 실행합니다 |
| `/review` | `/agent-skills:code-review-and-quality` | 다섯 축 리뷰 워크플로우를 실행합니다 |
| `/code-simplify` | `/agent-skills:code-simplification` | 동작을 바꾸지 않고 단순화합니다 |
| `/ship` | `/agent-skills:shipping-and-launch` | 래퍼의 자동 페르소나 팬아웃은 사용할 수 없습니다. 전문 에이전트를 따로 호출하세요 |
| `/webperf` | `/agents`에서 `web-performance-auditor`를 선택합니다 | 이 워크플로우는 스킬이 아니라 페르소나입니다 |

우회 방법으로 TOML 파일에 YAML 프론트매터를 추가하지 마세요. Gemini CLI는 대응하는 TOML 커맨드 형식을 엄격한 파서로 읽으며, `---` 프론트매터는 그 파일을 잘못된 TOML로 만들 뿐 Antigravity의 변환 동작은 바꾸지 않습니다.

---

## 스킬과 탐색

Antigravity는 플러그인의 `skills/` 디렉터리 안에서 스킬을 자동으로 탐색합니다.
* Antigravity는 사용자 작업과 의도를 관련 스킬에 필요할 때 맞춥니다.
* 작업이 스킬과 맞으면 에이전트가 스킬을 불러오고, 실행 전에 권한을 요청합니다.

---

## 확인과 검증

로컬 플러그인의 구조가 올바른지, 스킬이 모두 들어 있는지 검증하려면 다음을 실행하세요.
```bash
agy plugin validate /path/to/agent-skills
```

그런 다음 새 세션을 시작하고 `/agent-skills:`를 입력해 네임스페이스가 붙은 스킬 카탈로그를 살펴보세요. 검증기가 커맨드가 변환되었다고 보고하는데 `/build`가 `No matches`를 반환하면, 위의 직접 호출을 사용하세요. 다시 설치하거나 TOML에 `name` 필드를 추가해도 알려진 임포터 제한은 해결되지 않습니다.

---

## 동작 방식

### 1. 필요할 때의 스킬 활성화
Antigravity CLI는 설치된 플러그인의 `skills/` 디렉터리에 있는 `SKILL.md` 파일을 자동으로 탐색합니다. 각 스킬 프론트매터의 트리거 설명을 사용해, 에이전트는 맞는 개발자 의도를 감지하면 적절한 워크플로우를 동적으로 활성화합니다.

예를 들어 에이전트에게 다음을 요청하면 이렇게 됩니다.
- **새로운 시스템을 설계** &rarr; `spec-driven-development`를 제안하거나 활성화합니다.
- **기능을 구현** &rarr; `incremental-implementation`과 `test-driven-development`를 활성화합니다.
- **버그를 수정** &rarr; `debugging-and-error-recovery`를 활성화합니다.

### 2. 전문화된 에이전트 페르소나
플러그인은 `agents/` 디렉터리의 재사용 가능한 서브에이전트 정의를 등록합니다.
- `code-reviewer.md`
- `security-auditor.md`
- `test-engineer.md`

이 페르소나는 세션 안에서 직접 호출하거나, 서브에이전트로 작업을 위임할 때 호출할 수 있습니다.

---

## 구성과 사용자 지정

### 프로젝트별 강제 (`AGENTS.md`)
엄격한 스킬 준수를 강제하려면(예를 들어 코드를 작성하기 전에 스펙이나 계획을 요구하려면) 워크스페이스 루트에 프로젝트 전용 `AGENTS.md`를 만드세요. 그 파일에 프로젝트 관례, 테스트 명령, 필요한 스킬 워크플로우를 적습니다.

이 저장소 루트의 `AGENTS.md`와 `CLAUDE.md`는 Agent Skills 자체에 기여하는 에이전트를 구성합니다. 프로젝트나 전역 에이전트 구성으로 복사하거나 링크하지 마세요. 재사용 가능한 자산은 `skills/`의 스킬입니다. [저장소 범위 파일](../CONTRIBUTING.md#repo-scoped-files)을 보세요.

### 샌드박스 모드
서드파티 검증 테스트를 실행할 때의 안전을 위해, 제한된 터미널 권한으로 스킬이나 스크립트를 실행하려면 다음으로 CLI를 시작하세요.

```bash
agy --sandbox
```

---

## 사용 팁

1. **플러그인을 최신으로 유지하세요.** CLI를 업데이트하거나 더 새로운 플러그인 버전을 확인하려면 다음을 사용하세요.
   ```bash
   agy update
   ```
2. **실행 전에 리뷰하세요.** 에이전트가 이 스킬로 복잡한 리팩터 작업을 실행할 때, `Ctrl+r`로 **Artifact Review** 화면에 들어가 커밋되기 전에 코드를 리뷰하고, 편집하고, 승인하세요.
3. **권한을 제어하세요.** `--dangerously-skip-permissions` 플래그는, 수동 도구 승인 프롬프트를 건너뛰고 싶은 신뢰하는 로컬 프로젝트에서만 사용하세요.
