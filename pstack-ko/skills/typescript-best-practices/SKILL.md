---
name: typescript-best-practices
description: TypeScript 모범 사례. 모든 .ts 또는 .tsx 파일을 읽거나 편집할 때 사용하세요.
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript best practices

먼저 **type-system-discipline** 원칙 스킬을 적용하세요.

| 규칙 | 요약 |
|------|---------|
| Discriminated unions (구별된 유니온) | 불가능한 상태를 표현할 수 없도록 `kind` 리터럴 구별자로 변형을 모델링하세요. 선택적 필드 백 없음. |
| Branded types (브랜드 타입) | `& { readonly __brand: "X" }`로 기본 타입을 브랜드하여 혼합될 수 없도록 하세요. 경계에서 한 번 검증하세요. 브랜드는 `as`가 아니라 검증 타입 가드 (`input is AgentId`)에서 나옵니다. |
| Constructive modeling (구성적 모델링) | 불법 값을 구성할 수 없도록 형태를 빌드하세요. 비어 있지 않음에 대해 `[T, ...T[]]`, 짝수 길이에 대해 `[T, T][]`, 범위에 대해 `start` 플러스 `duration`. 런타임 가드가 아니라, 정제 타입에 대한 소원이 아닙니다. |
| Simplest total type (가장 단순한 총 타입) | 그것에 대한 모든 작업이 총으로 유지되는 동안 `T[]`를 유지하세요. 느슨한 타입이 `!`, 캐스트 또는 "should never happen" throw를 강요하는 곳에서만 `NonEmpty<T>`로 강화하세요. |
| `any`보다 `unknown` | 외부 데이터는 `unknown`입니다. |
| 가드 전에 스키마 | 속성별 타입 가드를 손으로 작성하기 전에 저장소의 런타임 스키마 라이브러리를 사용하고 스키마에서 타입을 추론하세요. `z.infer`와 같은. |
| `as` 캐스트 없음 | 모든 `as`는 대기 중인 런타임 크래시입니다. 검증 후에만 캐스트하세요. |
| Narrowing hierarchy (좁히기 계층) | Discriminant switch > `in` 연산자 > `typeof`/`instanceof` > 사용자 정의 타입 가드 > `as`. |
| Type guards (타입 가드) | 주장을 검증해야 합니다. 거짓말하는 가드는 `as`보다 나쁩니다. 안전하다고 말하는 이름 뒤에 버그가 숨기 때문입니다. `isX` 또는 `hasX`로 명명하세요. |
| Exhaustiveness (철저함) | 기본 팔에 인라인 `const _exhaustive: never = x;`를 사용하여 새 변형이 추가될 때 컴파일러가 오류를 내도록 하세요. |
| `as`보다 `satisfies` | 리터럴 타입을 넓히지 않고 값을 검증합니다. |
| Boundary validation (경계 검증) | 데이터가 들어오는 곳에서 명명된 도메인 타입으로 파싱하세요. `Record<string, unknown>` (어떻게 철자되든)는 그 파싱에서 멈춥니다. 내부 타입을 신뢰하세요. **boundary-discipline** 원칙 스킬을 참조하세요. |
| Schema-derived types (스키마 파생 타입) | 새 인터페이스를 선언하기 전에 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`에 도달하세요. |
| Object args (객체 인수) | 인수 순서가 자체 문서화되도록 위치가 아니라 객체를 전달하세요. 핫 패스 (프레임당 렌더, 토크나이저, 파서)에서 건너뛰세요. |
| Real tests (실제 테스트) | 실행할 수 있는 것을 목하지 마세요. 누수/disposable 검사가 있는 프레임워크의 실제 테스트 기본 요소를 선호하고, 실행 중인 빌드에서 UI를 검증하세요. 로컬에서 실행할 수 없는 것만 목하세요. |
| Structured telemetry (구조화된 원격 측정) | id에서 디버그하기에 충분한 컨텍스트가 있는 구조화된 로거 진단을 선호하세요. 배송된 코드에 `console.log` 없음. |

예제: `references/patterns.md`.
