---
name: unslop
description: 모든 쓰기에서 AI 징후를 자릅니다.
disable-model-invocation: true
---

# Unslop

텍스트를 편집하여 AI 패턴을 제거하세요. 아래 패턴을 스캔한 다음 다시 작성하세요. 의미를 보존하고 의도한 톤과 일치시키세요.

## 감지하고 수정할 패턴

규칙 번호는 다른 스킬이 인용하는 안정적인 id입니다. 제거된 규칙은 간격을 남깁니다.

### 콘텐츠

3. **피상적인 -ing 구문.** "highlighting...", "ensuring...", "reflecting...", "showcasing...", "fostering...". 삭제하거나 실제 소스로 확장하세요.
5. **모호한 귀속.** "Experts believe", "Industry reports suggest", "Some critics argue". 소스를 명명하거나 삭제하세요.

### 언어

7. **AI 어휘.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (추상적), pivotal, showcase, tapestry (추상적), testament, underscore, vibrant. 평범한 단어로 교체하세요.
8. **"is"를 말하는 고급 방법.** "serves as", "stands as", "boasts", "features". "is" 또는 "has"라고 말하세요.
9. **"Not just X, but Y."** 대신 포인트를 직접 진술하세요.
10. **3의 규칙.** 아이디어를 세 그룹으로 강요하지 마세요. 자연스러운 숫자를 사용하세요.
11. **동의어 순환.** 한 단락에 Protagonist, main character, central figure, hero 모두. 하나를 선택하고 반복하세요.
12. **거짓 범위.** X와 Y가 의미 있는 척도에 있지 않은 "from X to Y". 주제를 직접 나열하세요.

### 스타일

13. **Em 대시 과다 사용.** em 대시를 완전히 피하세요. 마침표 또는 쉼표만 사용하세요 (괄호 없음, en 대시 없음, 하이픈을 대시 대체로 사용 없음). 생각이 분리가 필요하면 문장을 끝내거나 쉼표를 사용하세요.
14. **콜론 과다 사용.** 콜론은 목록이나 예제 전에 괜찮지만 문장 중간 커넥터로는 아닙니다. "If you're coming from traditional automation: instead of registering event handlers, you describe conditions"는 콜론으로 아무것도 추가하지 않습니다. 비교 프레이밍 없이 포인트가 스스로 서도록 다시 작성하세요. "Describing when the scheduler should fire works best as plain English." 동일한 의미, 목발 구두점 없음.
15. **볼드페이스 과다 사용.** 모든 고유 명사나 약어를 굵게 표시하지 마세요.
16. **인라인 헤더 목록.** 징후는 줄을 재진술하는 굵은 레이블과 콜론입니다: "**Performance:** Performance improved...". 그것들을 산문으로 변환하세요. 마침표로 끝나고, 항목을 명명하고, 진정으로 새로운 세부 사항이 뒤따르는 굵은 리드인 ("**Schema in TypeScript.** Tables live in one file.")은 괜찮고, 징후가 아닙니다.
17. **Title case 헤딩.** 문장 케이스를 사용하세요.
18. **장식용 이모지.** 헤딩과 글머리 기호에서 제거하세요.
19. **둥근 따옴표.** 직선 따옴표를 사용하세요.

### 커뮤니케이션 아티팩트

20. **챗봇 구문.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", "Found the smoking gun!" 제거하세요.
22. **아첨하는 톤.** "Great question! You're absolutely right!" 직접 응답하세요.

### 필러

23. **필러 구문.** "In order to"는 "To"가 됩니다. "Due to the fact that"는 "Because"가 됩니다. "It is important to note that"를 삭제하세요.
24. **과도한 헤징.** "could potentially possibly be argued that it might"는 "may"가 됩니다.
25. **일반적인 결론.** "The future looks bright." 특정 계획이나 사실을 진술하세요.

### 전문 용어

26. **추상 은유 명사.** Substrate (base), wedge, wedge in (add), vector (way, method), locus, vantage, nexus, 명사로서의 primitive, 은유로서의 harness, "API surface"에서와 같은 surface, bedrock, 은유로서의 scaffolding, modality, paradigm, gold-plating (작업이 필요한 것 이상), 은유로서의 ratchet (메커니즘의 실제 이름, 또는 오직 조이는 한계), 코드를 이동하기 위한 evacuate (move out), endgame (마지막 단계), north star, flywheel. 이것들은 기술적으로 읽히지만 일반적으로 더 평범한 구체적인 단어가 있습니다. 구체적인 단어를 선택하세요.

### 평범한 연설

27. **무엇을 하는지 말하고, 어떻게 느끼는지 말하지 마세요.** "the database stays close at hand", "SQL you can read", "types that follow your schema"는 느낌을 명명합니다. 수정은 메커니즘 또는 숫자를 명명합니다: "`.toSQL()` returns the exact string sent to the database", "a column rename fails the build". 문장이 독자에게 무엇을 하거나 알도록 말하는지 물은 다음 그것을 작성하세요. 구체적인 지침, 사실 또는 숫자로 재진술할 수 없다면 자르세요. 한 가지 더 확인: 문장이 다른 프로젝트의 문서에 변경되지 않고 나타날 수 있다면 이것에 대해 아무것도 말하지 않습니다. 자르세요.
28. **조밀한 문장을 짧게 하거나 분할하세요.** 독자가 문장을 파싱하기 위해 백트랙해야 하면 둘로 나누거나 절을 삭제하세요. 문장당 하나의 아이디어.
29. **능동태.** 그것을 선호하세요. "is/are/was/were + 과거 분사"를 잡고 액터를 명명하세요: "queries are validated"는 "the compiler validates queries"가 되고, "the file is parsed by the loader"는 "the loader parses the file"이 됩니다. 액터가 알려지지 않았거나 진정으로 중요하지 않을 때만 수동형이 괜찮습니다.
30. **부사를 자르거나 더 강한 동사를 사용하세요.** "runs quickly"는 "is fast" 또는 숫자가 되고, "significantly improves"는 측정된 델타가 됩니다. 약한 동사를 지탱하는 부사는 동사가 틀렸음을 의미합니다.
31. **평범한 단어를 선호하세요.** "utilize"와 "leverage"는 "use"가 되고, "facilitate"는 "help"가 되고, "numerous"는 "many"가 되고, "in the event that"는 "if"가 됩니다. 더 고급 동의어가 거의 더 명확하지 않습니다.
32. **매너리즘 산문.** 리터럴 구가 존재하는 곳에서 은유 또는 장식: 격언 ("wire it or delete it"), 효과를 위한 수사적 단편, 의인화된 코드 ("the plan holds it"), 비유적 동사 ("rides along", "stands on"), 스톡 프레이밍 구문. "A dial worth turning"은 "a parameter worth varying"이 됩니다. 의미하는 것을 말하세요. 규칙 26은 은유 명사를 커버합니다.
33. **과다 압축.** 삭제된 관사, 동사 없는 단편, 심볼 스피크, 독자가 읽는 대신 디코딩하게 만드는 약어. "Parser rejects bad date → exit 2, no write"는 "The parser rejects a bad date, exits with code 2, and writes nothing."이 됩니다. 관사와 동사가 있는 전체 문장을 작성하고, 화살표와 약어를 철자하세요.
