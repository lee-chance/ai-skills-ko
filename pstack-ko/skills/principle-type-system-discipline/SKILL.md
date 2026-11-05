---
name: principle-type-system-discipline
description: "타입을 설계하거나, 함수 시그니처를 검토하거나, 정적 타입 언어로 코드를 작성할 때 적용. 불법 상태를 표현 불가능하게 만들고, 의미론적 프리미티브를 브랜드하고, 경계에서 외부 데이터를 파싱하고, 변형을 소진하고, 권위있는 스키마에서 파생."
disable-model-invocation: true
---

# Type System Discipline (타입 시스템 규율)

컴파일러가 불가능한 상태, 일치하지 않는 프리미티브, 처리되지 않은 변형을 거부하도록 만드세요. 핸들러를 확산하는 것보다 에러와 특수 케이스를 존재하지 않도록 정의하는 것을 선호하세요. TypeScript 구문은 `typescript-best-practices` 스킬을 참조하세요.

- **의미론적 프리미티브를 브랜드하세요.** `UserId`와 `OrderId`는 아래에서는 문자열이지만 서로 바꿀 수 없어야 합니다. 각각에 자체 타입을 주세요, 예를 들어 TypeScript의 브랜드 교차 또는 다른 곳의 newtype. 생성 시 한 번 검증하고, 다운스트림에서 타입을 신뢰하세요. 두 인수가 프리미티브 타입을 공유하지만 다른 것을 의미한다면, 브랜드하세요.
- **외부 데이터는 파싱될 때까지 타입이 없습니다.** RPC 페이로드, JSON, IPC 메시지, CLI 인수, 설정 파일, 환경 변수, 데이터베이스 행. 구조화되지 않은 입력을 타입이 있는 모델로 바꾸는 파싱 함수를 모든 경계에 가지세요. **boundary-discipline** 원칙 스킬은 검증을 어디에 둘지 말합니다.
- **권위있는 스키마에서 타입을 파생하세요.** protocol buffer, OpenAPI spec, GraphQL schema, database migration, design-token file 또는 다른 파일이 형태를 소유할 때, 병렬 타입을 손으로 만드는 대신 그것에서 파생하세요. **encode-lessons-in-structure** 원칙 스킬을 참조하세요.
