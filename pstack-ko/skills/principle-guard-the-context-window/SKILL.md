---
name: principle-guard-the-context-window
description: "컨텍스트가 채워질 때 적용: 큰 출력, 긴 파일, 반복된 읽기, 팬아웃 계획. 대량을 서브에이전트로 라우팅; 원시 페이로드가 아니라 요약을 메인 스레드에 유지."
disable-model-invocation: true
---

# Guard the Context Window (컨텍스트 윈도우 보호)

**이유:** 컨텍스트 오버플로우는 추론 품질을 저하시키고, 압축 아티팩트를 생성하고, 진행을 중단합니다.

**패턴:**
- **단계 크기를 정하고 범위를 제한하세요.** 단계당 파일을 제한하고, 턴 예산을 설정하고, 메커니즘 비용을 설명하세요.
