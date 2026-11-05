# Windsurf에서 agent-skills 사용하기

## 설정

### 프로젝트 규칙

Windsurf는 프로젝트별 에이전트 지시문으로 `.windsurfrules`를 사용합니다.

```bash
# Create a combined rules file from your most important skills
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .windsurfrules
printf '\n---\n\n' >> .windsurfrules
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md >> .windsurfrules
printf '\n---\n\n' >> .windsurfrules
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .windsurfrules
```

### 전역 규칙

모든 프로젝트에서 쓰고 싶은 스킬은 Windsurf의 전역 규칙에 추가하세요.

1. Windsurf → Settings → AI → Global Rules를 엽니다.
2. 가장 자주 쓰는 스킬의 내용을 붙여 넣습니다.

## 권장 구성

컨텍스트 한도 안에 머물도록 `.windsurfrules`는 핵심 스킬 2~3개에 집중하세요.

```
# .windsurfrules
# 이 프로젝트의 필수 agent-skills

[test-driven-development SKILL.md를 붙여 넣으세요]

---

[incremental-implementation SKILL.md를 붙여 넣으세요]

---

[code-review-and-quality SKILL.md를 붙여 넣으세요]
```

## 사용 팁

1. **골라서 넣으세요.** Windsurf의 컨텍스트는 제한되어 있습니다. 품질이 가장 부족한 부분을 다루는 스킬을 고르세요.
2. **대화에서 참조하세요.** 특정 단계를 작업할 때 추가 스킬 내용을 채팅에 붙여 넣으세요. 예를 들어 인증을 만들 때는 `security-and-hardening`을 붙여 넣습니다.
3. **레퍼런스를 체크리스트로 쓰세요.** `references/security-checklist.md`를 붙여 넣고, Windsurf에 각 항목을 검증하라고 요청하세요.
