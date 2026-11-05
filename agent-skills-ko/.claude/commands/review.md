---
description: 다섯 축으로 코드 리뷰를 수행합니다. 정확성, 가독성, 아키텍처, 보안, 성능입니다
disable-model-invocation: true
---

agent-skills:code-review-and-quality 스킬을 호출하세요.

현재 변경(스테이징된 내용 또는 최근 커밋)을 다섯 축 모두에서 리뷰하세요.

1. **정확성**: 스펙과 맞는가? 엣지 케이스를 다뤘는가? 테스트는 충분한가?
2. **가독성**: 이름이 명확한가? 로직이 직선적인가? 구성이 잘 되어 있는가?
3. **아키텍처**: 기존 패턴을 따르는가? 경계가 깨끗한가? 추상화 수준이 맞는가?
4. **보안**: 입력을 검증했는가? 시크릿은 안전한가? 인증을 확인했는가? (security-and-hardening 스킬을 사용하세요)
5. **성능**: N+1 쿼리는 없는가? 상한 없는 연산은 없는가? (performance-optimization 스킬을 사용하세요)

발견을 Critical, Required, Optional, Nit로 분류하세요.
구체적인 file:line 참조와 수정 권고가 담긴 구조화된 리뷰를 출력하세요.
