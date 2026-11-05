# 에이전트 페르소나

하나의 역할과 하나의 관점만 맡는 전문 페르소나입니다. 각 페르소나는 Markdown 파일이며, 하네스(Claude Code, Cursor, Copilot 등)가 시스템 프롬프트로 읽습니다.

| 페르소나 | 역할 | 가장 잘 맞는 경우 |
|---------|------|----------|
| [code-reviewer](../agents/code-reviewer.md) | 시니어 스태프 엔지니어 | 머지 전 5축 리뷰 |
| [security-auditor](../agents/security-auditor.md) | 보안 엔지니어 | 취약점 탐지, OWASP 스타일 감사 |
| [test-engineer](../agents/test-engineer.md) | QA 엔지니어 | 테스트 전략, 커버리지 분석, Prove-It 패턴 |
| [web-performance-auditor](../agents/web-performance-auditor.md) | 웹 성능 엔지니어 | Core Web Vitals 감사, 로딩/렌더링/네트워크 분석 |

## 페르소나, 스킬, 명령의 관계

세 층이며, 하는 일이 서로 다릅니다.

| 층 | 무엇인가 | 예시 | 조합에서의 역할 |
|-------|-----------|---------|------------------|
| **스킬** | 단계와 종료 기준이 있는 워크플로우 | `code-review-and-quality` | *방법*. 페르소나나 명령 안에서 호출됨 |
| **페르소나** | 관점과 출력 형식이 있는 역할 | `code-reviewer` | *누구*. 시점을 잡고 보고서를 만듦 |
| **명령** | 사용자에게 보이는 진입점 | `/review`, `/ship` | *언제*. 페르소나와 스킬을 조합함 |

사용자(또는 슬래시 커맨드)가 오케스트레이터입니다. **페르소나는 다른 페르소나를 호출하지 않습니다.** 스킬은 페르소나 워크플로우 안의 필수 경유지입니다.

## 각각을 언제 쓰나

### 페르소나 직접 호출
현재 변경에 대한 관점 하나가 필요하고, 사용자가 루프 안에 있을 때 이것을 고르세요.

- "이 풀 리퀘스트를 리뷰해 줘" → `code-reviewer`를 직접 호출
- "`auth.ts`에 보안 문제가 있나?" → `security-auditor`를 직접 호출
- "체크아웃 흐름에 어떤 테스트가 빠졌나?" → `test-engineer`를 직접 호출
- "제품 페이지의 Core Web Vitals를 감사해 줘" → `web-performance-auditor`를 직접 호출

### 슬래시 커맨드(뒤에 페르소나 하나)
그렇지 않으면 매번 다시 설명하게 되는, 반복 가능한 워크플로우가 있을 때 이것을 고르세요.

- `/webperf` → 웹 앱의 성능 중심 감사를 위해 `web-performance-auditor`를 감쌉니다

`/review`와 `/test`는 페르소나 래퍼가 아닙니다. 대화의 컨텍스트가 있는 메인 세션에서 `code-review-and-quality`와 `test-driven-development` 스킬을 실행합니다. 새 컨텍스트에서 `code-reviewer`나 `test-engineer`를 쓰려면, 페르소나를 직접 호출하거나 `/ship`을 실행하세요.

### 슬래시 커맨드(오케스트레이터, 팬아웃)
**독립적인** 조사가 병렬로 돌 수 있고, 그 보고서를 하나의 에이전트가 합칠 때만 이것을 고르세요.

- `/ship` → `code-reviewer` + `security-auditor` + `test-engineer`로 병렬 팬아웃한 뒤, 보고서를 종합해 진행/중단(go/no-go) 결정을 만듭니다

이 저장소가 인정하는 오케스트레이션 패턴은 이것뿐입니다. 전체 패턴 목록과 안티패턴은 [references/orchestration-patterns.md](../references/orchestration-patterns.md)를 보세요.

## 결정 행렬

```
Is the work a single perspective on a single artifact?
├── Yes → Direct persona invocation
└── No  → Are the sub-tasks independent (no shared mutable state, no ordering)?
         ├── Yes → Slash command with parallel fan-out (e.g. /ship)
         └── No  → Sequential slash commands run by the user (/spec → /plan → /build → /test → /review)
```

## 동작 예시: 유효한 오케스트레이션

`/ship`은 이 저장소의 표준 팬아웃 오케스트레이터입니다.

```
/ship
  ├── (parallel) code-reviewer    → review report
  ├── (parallel) security-auditor → audit report
  └── (parallel) test-engineer    → coverage report
                  ↓
        merge phase (main agent)
                  ↓
        go/no-go decision + rollback plan
```

이렇게 되는 이유:

- 각 서브에이전트는 같은 diff를 보지만 **서로 다른 관점**을 만듭니다
- 서로 의존성이 없습니다. 진짜 병렬이라 실제 경과 시간이 줄어듭니다
- 각각 새 컨텍스트 창에서 실행되므로, 메인 세션은 어수선해지지 않습니다
- 병합 단계는 작고 전체 컨텍스트의 이득을 보므로, 메인 에이전트에 남습니다

## 동작 예시: 유효하지 않은 오케스트레이션(이렇게 만들지 마세요)

일이 "다른 어떤 페르소나를 호출할지 결정하는 것"인 `meta-orchestrator` 페르소나:

```
/work-on-pr → meta-orchestrator
                  ↓ (decides "this needs a review")
              code-reviewer
                  ↓ (returns)
              meta-orchestrator (paraphrases result)
                  ↓
              user
```

실패하는 이유:

- 도메인 가치가 없는 순수 라우팅 층입니다
- 바꿔 말하는 경유지가 두 번 늘어납니다. 정보 손실과 토큰 비용 2배입니다
- 사용자는 이미 리뷰를 원합니다. `/review`를 직접 호출하게 두세요
- 슬래시 커맨드와 `AGENTS.md`의 의도 매핑이 이미 하는 일을 복제합니다

## 페르소나 규칙

1. 페르소나는 하나의 역할과 하나의 출력 형식입니다. 두 번째 역할을 넣게 되면, 두 번째 페르소나를 만드세요.
2. **페르소나는 다른 페르소나를 호출하지 않습니다.** 조합은 슬래시 커맨드나 사용자의 일입니다. Claude Code에서는 이것이 플랫폼이 강제하는 제약 조건이기도 합니다. *"subagents cannot spawn other subagents"*(서브에이전트는 다른 서브에이전트를 만들 수 없습니다). 그래서 규칙이 대신 강제됩니다.
3. 페르소나는 스킬(*방법*)을 호출할 수 있습니다.
4. 모든 페르소나 파일은 자신이 어디에 맞는지 밝히는 Composition 블록으로 끝납니다.

## Claude Code 상호 운용

이 저장소의 페르소나는 수정 없이 Claude Code 서브에이전트와 Agent Teams 팀원으로 동작하도록 설계되어 있습니다.

- **서브에이전트로:** 이 플러그인이 켜져 있으면 자동으로 발견됩니다(경로 설정이 필요 없습니다). Agent 도구에 `subagent_type: code-reviewer`(또는 `security-auditor`, `test-engineer`)를 쓰세요. `/ship`이 표준 예입니다.
- **Agent Teams 팀원으로**(실험적, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 필요): 팀원을 만들 때 같은 페르소나 이름을 참조하세요. 페르소나 본문은 팀원의 시스템 프롬프트에 **추가 지시로 덧붙여집니다**(대체하지 않습니다). 그래서 페르소나 텍스트는 리드가 설치하는 팀 조율 지시(SendMessage, 작업 목록 도구 등) 위에 놓입니다.

서브에이전트는 결과를 메인 에이전트에만 보고합니다. Agent Teams는 팀원이 서로 직접 메시지를 보내게 합니다. 보고로 충분하면 서브에이전트를 쓰세요. 서브에이전트가 서로의 발견을 반박해야 하면 Agent Teams를 쓰세요(예: 경쟁 가설 디버깅). 전체 대응은 [references/orchestration-patterns.md](../references/orchestration-patterns.md)를 보세요.

플러그인 에이전트는 `hooks`, `mcpServers`, `permissionMode` frontmatter를 지원하지 않습니다. 그 필드는 조용히 무시됩니다. 여기서 새 페르소나를 작성할 때 이것들에 의존하지 마세요.

## 새 페르소나 추가

1. 기존 페르소나가 쓰는 것과 같은 frontmatter 형식으로 `agents/<role>.md`를 만드세요.
2. 역할, 범위, 출력 형식, 규칙을 정의하세요.
3. 맨 아래에 **Composition** 블록을 추가하세요(Invoke directly when / Invoke via / Do not invoke from another persona).
4. 이 파일 맨 위 표에 페르소나를 추가하세요.
5. 페르소나가 새 오케스트레이션 패턴을 열면, 페르소나 파일 안에서 패턴을 만들지 말고 `references/orchestration-patterns.md`에 문서화하세요.
