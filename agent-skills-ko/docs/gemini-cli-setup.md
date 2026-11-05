# Gemini CLI에서 agent-skills 사용하기

## 설정

### 방법 1: 스킬로 설치 (권장)

Gemini CLI에는 `.gemini/skills/` 또는 `.agents/skills/` 디렉터리의 `SKILL.md` 파일을 자동으로 탐색하는 네이티브 스킬 시스템이 있습니다. 각 스킬은 작업과 맞을 때 필요할 때만 활성화됩니다.

**저장소에서 설치:**

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git --path skills
```

**또는 로컬 클론에서 설치:**

```bash
git clone https://github.com/addyosmani/agent-skills.git
gemini skills install /path/to/agent-skills/skills/
```

**특정 워크스페이스에만 설치:**

```bash
gemini skills install /path/to/agent-skills/skills/ --scope workspace
```

워크스페이스 범위로 설치한 스킬은 `.gemini/skills/`(또는 `.agents/skills/`)에 들어갑니다. 사용자 수준 스킬은 `~/.gemini/skills/`에 들어갑니다.

설치한 뒤 다음으로 확인하세요.

```
/skills list
```

Gemini CLI는 스킬 이름과 설명을 프롬프트에 자동으로 넣습니다. 맞는 작업을 인식하면, 전체 지시문을 불러오기 전에 스킬 활성화 권한을 요청합니다.

### 방법 2: GEMINI.md (지속 컨텍스트)

필요할 때의 활성화가 아니라 지속적인 프로젝트 컨텍스트로 항상 불러오고 싶은 스킬은 프로젝트의 `GEMINI.md`에 추가하세요.

```bash
# Create GEMINI.md with core skills as persistent context
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md > GEMINI.md
echo -e "\n---\n" >> GEMINI.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> GEMINI.md
```

별도 파일에서 가져와 모듈화할 수도 있습니다.

```markdown
# 프로젝트 지침

@skills/test-driven-development/SKILL.md
@skills/incremental-implementation/SKILL.md
```

불러온 컨텍스트는 `/memory show`로 확인하고, 변경 후에는 `/memory reload`로 새로고침하세요.

> **스킬과 GEMINI.md:** 스킬은 관련 있을 때만 활성화되는 전문 지식이며, 컨텍스트 창을 깨끗하게 유지합니다. GEMINI.md는 모든 프롬프트에 불러오는 지속 컨텍스트를 제공합니다. 단계별 워크플로우에는 스킬을, 항상 적용되는 프로젝트 관례에는 GEMINI.md를 사용하세요.

## 권장 구성

### 상시 적용 (GEMINI.md)

모든 세션의 지속 컨텍스트로 다음을 추가하세요.

- `incremental-implementation`: 작고 검증 가능한 슬라이스로 빌드합니다
- `code-review-and-quality`: 다섯 축 리뷰

### 필요할 때 (스킬)

관련 있을 때만 활성화되도록 다음을 스킬로 설치하세요.

- `test-driven-development`: 로직을 구현하거나 버그를 고칠 때 활성화됩니다
- `spec-driven-development`: 새 프로젝트나 기능을 시작할 때 활성화됩니다
- `frontend-ui-engineering`: UI를 만들 때 활성화됩니다
- `security-and-hardening`: 보안 리뷰 중에 활성화됩니다
- `performance-optimization`: 성능 작업 중에 활성화됩니다

## 고급 구성

### MCP 통합

이 팩의 많은 스킬은 환경과 상호 작용하기 위해 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 도구를 사용합니다. 예를 들면 다음과 같습니다.

- `browser-testing-with-devtools`는 `chrome-devtools` MCP 확장을 사용합니다.
- `performance-optimization`은 성능 관련 MCP 도구의 도움을 받을 수 있습니다.

이를 켜려면 Gemini CLI 설정(`~/.gemini/settings.json`, 또는 프로젝트의 `.gemini/settings.json`)의 `mcpServers` 아래에 관련 MCP 서버를 구성하세요.

### 세션 훅

Gemini CLI는 세션 라이프사이클 훅을 지원합니다. 세션이 시작될 때 컨텍스트를 자동으로 넣거나 검증 스크립트를 실행하는 데 쓸 수 있습니다.

다른 도구에서 쓰던 `agent-skills` 경험에 맞추려면, 사용 가능한 스킬을 알려 주거나 메타 스킬을 불러오는 `SessionStart` 훅을 구성할 수 있습니다. 이 저장소의 `hooks/session-start.sh`가 그 용도의 준비된 스크립트입니다. `using-agent-skills` 메타 스킬을 표준 `SessionStart` JSON 엔벨로프로 stdout에 출력합니다.

### 명시적 컨텍스트 불러오기

프롬프트에서 `@` 기호로 참조하면 현재 세션에 원하는 스킬을 명시적으로 불러올 수 있습니다.

```markdown
Use the @skills/test-driven-development/SKILL.md skill to implement this fix.
```

자동 탐색을 기다리지 않고 특정 워크플로우를 따르게 하고 싶을 때 유용합니다.

## 슬래시 커맨드

이 저장소는 `.gemini/commands/` 아래에 슬래시 커맨드 9개를 포함합니다. 라이프사이클 커맨드 8개와 전문 점검 `/webperf`입니다. 프로젝트 루트에서 실행하면 Gemini CLI가 자동으로 탐색합니다.

| 커맨드 | 하는 일 |
|---------|--------------|
| `/spec` | 코드를 작성하기 전에 구조화된 스펙을 작성합니다 |
| `/constraints` | 프로젝트의 품질 기준을 정의하고 강제합니다 |
| `/planning` | 작업을 작고 검증 가능한 작업으로 나눕니다 |
| `/build` | 다음 작업을 점진적으로 구현합니다 |
| `/test` | TDD 워크플로우를 실행합니다. red, green, refactor |
| `/review` | 다섯 축 코드 리뷰 |
| `/code-simplify` | 동작을 바꾸지 않고 복잡도를 줄입니다 |
| `/ship` | 병렬 페르소나 팬아웃으로 출시 전 체크리스트를 확인합니다 |
| `/webperf` | 브라우저에 노출되는 앱의 Core Web Vitals와 성능 문제를 점검합니다 |

각 커맨드는 대응 스킬을 자동으로 호출합니다. 스킬을 수동으로 불러올 필요가 없습니다.

> **참고:** `/plan` 대신 `/planning`을 사용하세요. `/plan`은 Gemini CLI 내부 커맨드 이름과 충돌합니다.

## 사용 팁

1. **GEMINI.md보다 스킬을 우선하세요.** 스킬은 필요할 때만 활성화되어 컨텍스트 창을 집중된 상태로 유지합니다. 항상 불러오고 싶을 때만 GEMINI.md에 스킬을 넣으세요.
2. **스킬 설명이 중요합니다.** 각 SKILL.md의 프론트매터에는 에이전트에게 언제 활성화할지 알려 주는 `description` 필드가 있습니다. 이 저장소의 설명은 지원하는 모든 도구(Claude Code, Gemini CLI 등)에서 자동 탐색되도록 최적화되어 있으며, 스킬이 *무엇을* 하는지와 *언제* 트리거되어야 하는지를 분명히 적습니다.
3. **리뷰에는 에이전트를 사용하세요.** 구조화된 코드 리뷰를 요청할 때는 `agents/code-reviewer.md`의 내용을 복사하세요.
4. **레퍼런스와 함께 쓰세요.** 테스트나 성능처럼 특정 품질 영역을 다룰 때는 `references/`의 체크리스트를 참조하세요.
