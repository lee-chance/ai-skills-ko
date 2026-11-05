# 에이전트별 고급 설정

이 저장소의 스킬은 의도적으로 이식 가능하게 되어 있습니다. 모든 `SKILL.md`는 frontmatter를 [Agent Skills 스펙](https://agentskills.io)이 정의한 필드로 제한하므로, 같은 파일이 Claude Code, Cursor, Gemini CLI, Antigravity, 그리고 스펙을 따르는 다른 클라이언트에서 동작합니다.

여러 에이전트는 추가 런타임 제어도 지원합니다. 모델 라우팅, 도구 제한, 턴 제한, 실행 격리입니다. 이 제어는 유용하지만 벤더별로 다르며, 공유되는 이식 가능한 frontmatter에 둘 자리가 아닙니다. 이 문서는 각 에이전트가 어떤 제어를 지원하는지, 어디에 두어야 하는지, 이식성을 깨지 않고 선택적으로 적용하는 방법을 설명합니다.

이 문서는 에이전트별 설정의 기준 참조이며, 최상위 `SKILL.md` frontmatter에 벤더 필드를 넣던 이전 방식을 대체합니다. `kind`, `model`, `temperature`, `max_turns`, `tools`, `context` 같은 필드는 스킬의 최상위에 두면 안 됩니다. 아래 설명처럼 `metadata` 아래나, 별도의 에이전트별 어댑터 파일에 둡니다.

## 원칙

1. **`SKILL.md`를 이식 가능하게 유지하세요.** Agent Skills 스펙은 최상위 frontmatter를 `name`, `description`, `license`, `compatibility`, `metadata`, 그리고 실험적 필드인 `allowed-tools`용으로 남겨 둡니다. 벤더나 클라이언트 전용 속성은 최상위가 아니라 `metadata` 아래에 둡니다.
2. **알 수 없는 최상위 필드가 무시된다고 보장되지는 않습니다.** 많은 파서는 `name`과 `description`만 읽고 나머지는 조용히 버리지만, 스펙을 엄격히 따르는 검증기나 클라이언트는 인식하지 못하는 최상위 키를 표시하거나 거부할 수 있습니다. 벤더 필드를 `metadata` 아래에 두면 파일이 어디서나 스펙에 맞습니다.
3. **선택입니다. 전역 기본값이 아닙니다.** 런타임 제어는 저장소의 모든 스킬에 기본으로 심어 둔 값이 아니라, 사용자가 자신의 에이전트와 워크플로우를 위해 더하는 것이어야 합니다.
4. **손으로 고치기보다 생성을 선호하세요.** 설정이 반복적이고 기계적이면, 사본을 손으로 유지하지 말고 단일 진실 공급원에서 생성하세요. [스크립트로 자동화하기](#automating-with-scripts)를 보세요.

## 벤더 필드가 있어야 할 곳

| 필드 유형 | 예시 | 올바른 위치 |
|---|---|---|
| 스펙 필드 | `name`, `description`, `license`, `compatibility` | `SKILL.md`의 최상위 frontmatter |
| 벤더 메타데이터 | 모델 힌트, 라우팅 태그 | `SKILL.md`의 `metadata` 키 아래 |
| 런타임 오케스트레이션 | 서브에이전트 정의, 턴 제한, 도구 허용 목록 | 별도의 에이전트별 어댑터 파일(아래 각 에이전트 참고) |

## Claude Code

Claude Code는 발견을 위해 `name`과 `description`을 읽습니다. 커스텀 명령과 스킬은 같은 frontmatter를 쓰므로, 아래 `context`와 `allowed-tools` 필드는 `.claude/commands/*.md`와 `.claude/skills/*/SKILL.md` 모두에서 동작합니다.

- **`context: fork`**는 명령이나 스킬을 활성 대화가 아니라 격리된 서브에이전트 컨텍스트에서 실행합니다. 컨텍스트 격리, 깨끗한 상태에서 반복 가능한 실행, 메인 세션이 아니라 포크에서 쓰이는 실행 토큰, 결과만 되돌아오는 더 깨끗한 핸드오프를 줍니다. 선택적 **`agent`** 필드는 포크를 실행할 서브에이전트 유형을 고릅니다(예: `agent: Plan`). 기본값은 `general-purpose`입니다.
- **`allowed-tools`**는 도구를 미리 승인합니다. 제한하지는 않습니다. 나열된 도구는 명령이나 스킬을 호출하는 턴 동안 권한 프롬프트 없이 실행되고, 부여는 다음 메시지에서 해제됩니다. 도구 풀에서 빠지는 것은 없습니다.
- **`disallowed-tools`**가 실제로 제한하는 필드입니다. 스킬이 활성인 동안 나열된 도구를 사용 가능한 풀에서 빼며, 리뷰나 감사처럼 수동적인 단계에서 최소 권한이 필요로 하는 것이 이것입니다. 제한도 다음 메시지에서 해제됩니다. 이것은 Claude Code 필드이며 스펙의 여섯 필드 중 하나가 아니므로, 로컬 사본이나 어댑터 파일에 둡니다. 게시된 `SKILL.md`에 두면 unexpected-key 오류로 패키징이 실패합니다.

이것들은 Claude Code 관례입니다. 공유되어 게시된 `SKILL.md`는 스펙 필드로 제한하세요. 이 런타임 제어는 자신의 로컬 명령이나 스킬 사본에 적용하세요.

## Gemini CLI와 Antigravity

Gemini CLI와 Antigravity는 같은 방식으로 스킬을 찾습니다. `name`과 `description`을 맞춘 다음, 필요할 때 스킬 전체를 로드합니다. 런타임 오케스트레이션은 스킬 frontmatter가 아니라 별도의 리소스에 있습니다.

- **서브에이전트 정의**는 스킬과 구분되는 `.gemini/agents/*.md`에 있습니다. 스키마는 `kind`(`local` 또는 `remote`), `model`, `temperature`, `max_turns`, `tools`입니다. 이것은 서브에이전트 스키마이며, 스킬 스키마가 아닙니다. 둘을 하나의 `SKILL.md`로 합치면 안 됩니다.
- **모델 라우팅**은 더 가벼운 작업(서식, 문서, git 작업)을 더 빠른 모델로 보내고, 인지적으로 무거운 작업(디버깅, 보안 감사, 인터페이스 설계)에는 더 강한 모델을 남겨 둡니다.
- **도구 제한**은 서브에이전트마다 최소 권한을 강제하고, 쓰이지 않는 도구 스키마를 프롬프트에서 덜어 내기도 합니다.
- **턴 제한**(`max_turns`)은 폭주하는 수정 루프를 피하도록 실행에 상한을 둡니다.

### 모델 안내

Google은 Gemini 3.x 모델에서 `temperature`를 생략하고 대신 `thinking_level`을 쓰라고 권합니다. 3.x 모델로 라우팅되는 스킬이나 서브에이전트에 `temperature`를 하드코딩하지 마세요. `thinking_level`을 선호하고, 모델이 진화하면 이 안내를 다시 보세요.

```yaml
# .gemini/agents/security-auditor.md
---
kind: local
model: gemini-3-pro
thinking_level: high   # not: temperature: 0.1
tools: [read_file, grep]
max_turns: 10
---
```

<a id="automating-with-scripts"></a>

## 스크립트로 자동화하기

모든 스킬에 걸쳐 에이전트별 메타데이터를 손으로 유지하면 반복적이고, 서로 어긋나며, 틀리기 쉽습니다. 더 나은 방법은 단일 진실 공급원을 두고 에이전트별 출력을 생성하는 것입니다.

- 생성기는 스킬별 설정 맵을 읽습니다. 주어진 에이전트에서 각 스킬이 써야 할 모델, 도구 허용 목록, 턴 제한, 격리입니다.
- 메타데이터형 필드는 각 `SKILL.md`의 `metadata` 키 아래에 주입하고, 파일은 스펙에 맞게 유지합니다.
- 오케스트레이션형 필드는 에이전트가 기대하는 별도 어댑터 파일을 내보냅니다. 예를 들어 `.gemini/agents/*.md` 서브에이전트 정의이며, `SKILL.md`는 그대로 둡니다.

생성은 도구가 **형태만이 아니라 의미**도 검증하게 합니다. 모델 이름이 알려진 모델인지, 도구 이름이 실제 도구인지, `max_turns`가 양의 정수인지, `temperature`(아직 해당하는 곳에서)가 범위 안의 유효한 수인지 확인합니다. 형태만 보는 검사는 `parseInt("1.5")`나 `parseFloat("0.2oops")` 같은 잘못된 값을 통과시킵니다.

## 상태

이 문서는 [#272](https://github.com/addyosmani/agent-skills/pull/272), [#36](https://github.com/addyosmani/agent-skills/pull/36), [#35](https://github.com/addyosmani/agent-skills/issues/35)의 논의를 한데 모은 것입니다. 모두 이 방식을 택한 뒤 닫혔습니다. 에이전트별 설정의 단일 참조입니다. 공유 스킬의 이식성을 유지하면서, 각 에이전트가 선택 사항으로 제공하는 고급 제어를 문서화합니다. 위에서 설명한 스크립트 기반 자동화는 구현에 앞서 합의를 기다리는 제안입니다.
