---
name: unslop
description: 모든 쓰기에서 AI 징후를 자릅니다.
disable-model-invocation: true
---

# Unslop

텍스트를 편집하여 AI 패턴을 제거하세요. 아래 패턴을 스캔한 다음 다시 작성하세요. 의미를 보존하고 의도한 톤과 일치시키세요.

규칙 번호는 다른 스킬이 인용하는 안정적인 id입니다. 제거된 규칙은 간격을 남깁니다.

3. 사실을 더하지 않는 후행 "-ing" 구문을 쓰지 마세요 ("highlighting...", "ensuring...").
5. 모호한 귀속을 쓰지 마세요 ("experts believe"). 소스를 명명하거나 삭제하세요.
7. AI 어휘를 쓰지 마세요: additionally, crucial, delve, enhance, foster, landscape, pivotal, showcase, testament, underscore, vibrant.
8. "serves as", "stands as", "boasts", "features" 대신 "is" 또는 "has"라고 말하세요.
9. "not just X, but Y"를 쓰지 마세요. 요점을 진술하세요.
10. 아이디어를 세 개씩 묶도록 강요하지 마세요.
11. 하나의 것에 하나의 이름. 그것을 반복하세요.
12. X와 Y가 실제 척도에 있지 않은 한 "from X to Y"를 쓰지 마세요.
13. em 대시, en 대시, 대시로 쓰인 하이픈을 쓰지 말고, 그 자리에 괄호도 쓰지 마세요. 마침표나 쉼표를 사용하세요.
14. 콜론은 목록이나 예제 앞에 쓰고, 문장 중간 커넥터로는 절대 쓰지 마세요.
15. 모든 고유 명사나 약어를 굵게 표시하지 마세요.
16. 줄을 재진술하는 굵은 레이블과 콜론을 쓰지 마세요 ("**Performance:** Performance improved..."). 마침표로 끝나고 새로운 세부 사항을 더하는 굵은 리드인은 괜찮습니다.
17. 헤딩은 문장 케이스로 쓰세요.
18. 장식용 이모지를 쓰지 마세요.
19. 직선 따옴표를 사용하세요.
20. 챗봇 구문을 쓰지 마세요 ("I hope this helps!", "Let me know if...").
22. 칭찬이나 동의로 시작하지 마세요. 직접 응답하세요.
23. 필러를 자르세요. "In order to"는 "to"가 됩니다. "it is important to note that"를 삭제하세요.
24. 헤징은 많아야 하나: "may".
25. 일반적인 결론을 쓰지 마세요. 특정 계획이나 사실을 진술하세요.
26. 추상 은유 명사를 쓰지 마세요: substrate, wedge, vector, nexus, primitive, harness, surface, scaffolding, paradigm, ratchet, north star, flywheel. 구체적인 단어를 사용하세요.
27. 어떻게 느끼는지가 아니라 무엇을 하는지 말하세요. 메커니즘이나 숫자를 명명하세요. 다른 프로젝트의 문서에 변경 없이 나타날 수 있는 문장은 자르세요.
28. 문장당 하나의 아이디어. 독자가 다시 읽어야 하는 문장은 분할하세요.
29. 능동태. 액터가 알려지지 않았거나 중요하지 않은 경우가 아니라면 액터를 명명하세요.
30. 부사를 자르거나 더 강한 동사를 사용하세요. 숫자를 제시하세요.
31. 평범한 단어를 사용하세요: "utilize"나 "leverage"가 아니라 "use".
32. 리터럴 구가 존재하는 곳에서 은유, 격언, 의인화된 코드, 비유적 동사를 쓰지 마세요.
33. 관사와 동사가 있는 전체 문장을 작성하세요. 화살표와 약어를 철자하세요.
