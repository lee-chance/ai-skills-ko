---
name: principle-laziness-protocol
description: "리팩토링, diff 크기 평가, 추상화, 레이어 또는 신호 스레딩 추가 유혹이 있을 때 적용. 삭제와 문제를 해결하는 가장 작은 변경을 선호."
disable-model-invocation: true
---

# Laziness Protocol (게으름 프로토콜)

- **결정을 통합하세요.** 여러 곳에서 동일한 선택을 반복하지 마세요. 하나의 진실의 원천 뒤에 두고 결과를 간단한 플래그로 전달하세요.
- **diff를 최소화하세요.** 문제를 해결하는 가장 작은 변경을 만드세요. 더 적은 라인이 "우아한" 보일러플레이트를 이깁니다.
