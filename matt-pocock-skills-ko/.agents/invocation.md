# 호출

모든 `SKILL.md`는 **사용자 호출** 또는 **모델 호출**입니다.

## 사용자 호출

슬래시 커맨드를 입력할 때만 도달 가능합니다. 에이전트는 절대 스스로 도달하지 않습니다.

**표지자**:
- YAML frontmatter에 `disable-model-invocation: true`
- `agents/openai.yaml`에 `policy.allow_implicit_invocation: false`

**예시**: `/grill-me`, `/setup-matt-pocock-skills`, `/to-spec`

## 모델 호출

여러분이 입력하거나 에이전트가 작업에 맞을 때 자동으로 도달할 수 있습니다.

**표지자**:
- `disable-model-invocation: true`가 없거나 `false`
- `agents/openai.yaml`에 `policy.allow_implicit_invocation: true` 또는 생략됨

**예시**: `/tdd`, `/prototype`, `/diagnosing-bugs`

## 사용자 호출 vs 모델 호출 선택

**사용자 호출로 만드세요** 만약:
- 오케스트레이션 스킬 (다른 스킬 호출)
- 설정 또는 구성 스킬
- 명시적 의도 필요 (예: 핸드오프, 전체 spec 생성)

**모델 호출로 만드세요** 만약:
- 재사용 가능한 규율 (테스팅, 디버깅, 설계)
- 특정 작업 패턴에 의해 트리거됨
- 큰 플로우의 일부로 호출됨
