# GLOSSARY.md Format

## 구조

```md
# {컨텍스트 이름}

{이 컨텍스트가 무엇이고 왜 존재하는지에 대한 한두 문장 설명.}

## 용어

**Order**:
{용어에 대한 한두 문장 설명}
_Avoid_: Purchase, transaction

**Invoice**:
배송 후 고객에게 보내는 결제 요청.
_Avoid_: Bill, payment request

**Customer**:
주문하는 사람 또는 조직.
_Avoid_: Client, buyer, account
```

## 규칙

- **의견을 가지세요.** 동일한 개념에 대해 여러 단어가 존재할 때, 최선의 것을 선택하고 나머지를 `_Avoid_` 아래에 나열하세요.
- **정의를 간결하게 유지하세요.** 최대 한두 문장. 무엇을 하는지가 아니라 무엇인지를 정의하세요.
- **이 프로젝트 컨텍스트에 특정한 용어만 포함하세요.** 일반 프로그래밍 개념(타임아웃, 오류 타입, 유틸리티 패턴)은 프로젝트가 광범위하게 사용하더라도 속하지 않습니다. 용어를 추가하기 전에 물어보세요: 이것은 이 컨텍스트에 고유한 개념인가, 아니면 일반 프로그래밍 개념인가? 전자만 속합니다.
- **자연스러운 클러스터가 나타나면 하위 제목으로 용어를 그룹화하세요**. 모든 용어가 단일 응집 영역에 속하면 평평한 목록이 좋습니다.

## 단일 대 다중 컨텍스트 저장소

**단일 컨텍스트 (대부분의 저장소):** 저장소 루트에 하나의 `GLOSSARY.md`.

**다중 컨텍스트:** 저장소 루트의 `GLOSSARY-MAP.md`가 컨텍스트, 그것들이 있는 위치, 그리고 그것들이 서로 어떻게 관련되는지를 나열합니다:

```md
# 용어집 지도

## 컨텍스트

- [Ordering](./src/ordering/GLOSSARY.md): 고객 주문을 받고 추적
- [Billing](./src/billing/GLOSSARY.md): 인보이스를 생성하고 결제를 처리
- [Fulfillment](./src/fulfillment/GLOSSARY.md): 창고 피킹과 배송을 관리

## 관계

- **Ordering → Fulfillment**: Ordering이 `OrderPlaced` 이벤트를 발행; Fulfillment가 피킹을 시작하기 위해 소비
- **Fulfillment → Billing**: Fulfillment가 `ShipmentDispatched` 이벤트를 발행; Billing이 인보이스를 생성하기 위해 소비
- **Ordering ↔ Billing**: `CustomerId`와 `Money`에 대한 공유 타입
```

스킬은 어떤 구조가 적용되는지 추론합니다:

- `GLOSSARY-MAP.md`가 존재하면, 컨텍스트를 찾기 위해 읽습니다
- 루트 `GLOSSARY.md`만 존재하면, 단일 컨텍스트
- 둘 다 존재하지 않으면, 첫 번째 용어가 해결될 때 루트 `GLOSSARY.md`를 지연 생성

다중 컨텍스트가 존재할 때, 현재 주제가 어느 것과 관련되는지 추론하세요. 불명확하면, 물어보세요.
