---
name: principle-test-behavior-not-implementation
description: 구현이 아닌 동작을 테스트하기
---

# 원칙: 구현이 아닌 동작을 테스트하기

공개 동작 (입력 → 출력, 부작용, 불변성)을 테스트하세요. 내부 구조, 프라이빗 메서드, 구현 세부 사항을 테스트하지 마세요.

## 이유

- **리팩토링이 안전해집니다**: 구현을 바꿔도 테스트가 깨지지 않습니다
- **더 나은 커버리지**: 동작 테스트는 실제 사용을 반영합니다
- **유지보수가 적습니다**: 내부가 바뀌어도 테스트를 다시 작성할 필요가 없습니다
- **더 명확한 계약**: 시스템이 무엇을 보장하는지 정확히 보여줍니다

## 방법

1. **공개 API를 통해 테스트하세요**: 사용자가 호출하는 것과 같은 함수/메서드
2. **관찰 가능한 출력을 검증하세요**: 반환 값, 부작용 (파일 쓰기, API 호출), 상태 변경
3. **내부를 테스트하지 마세요**: 프라이빗 메서드, 내부 데이터 구조, 구현 경로

공개 동작이 옳다면, 내부 구현은 중요하지 않습니다.

## 예시

**나쁜 예** (구현 테스트):

```python
def test_parser_internals():
    parser = Parser(code)
    assert parser._tokens[0].type == "IDENTIFIER"  # 내부
    assert parser._ast.nodes[0].kind == "FunctionDecl"  # 내부
```

이제 `_tokens` 배열을 맵으로 리팩토링하면 테스트가 깨집니다.

**좋은 예** (동작 테스트):

```python
def test_parser_output():
    result = parse("function foo() {}")
    assert result.functions[0].name == "foo"
    assert len(result.errors) == 0
```

내부를 바꿔도 공개 출력이 동일하면 테스트가 통과합니다.

## 언제 내부를 테스트할까

프라이빗 로직이 복잡하고 중요한 경우 (예: 암호화, 파싱 알고리즘), 다음 중 하나를 수행하세요:

1. **공개 API로 만드세요** (헬퍼 모듈로 추출)
2. **공개 동작을 통해 간접적으로 테스트하세요**
3. 정말 필요하다면, 내부를 직접 테스트하되 이것이 취약한 테스트라는 것을 알고 있어야 합니다

대부분의 경우 (1) 또는 (2)가 더 좋습니다.

## 부작용 테스트하기

부작용 (파일 쓰기, 네트워크 호출, 로그)도 동작입니다:

```python
def test_write_report():
    generate_report(data, "out.json")
    content = read_file("out.json")
    assert json.loads(content)["summary"]["total"] == 42
```

내부 포맷터 함수를 테스트하는 대신 최종 출력을 검증하세요.

## 불변성 테스트하기

불변성 (한 번 설정되면 절대 변하지 않음, 재시도는 멱등적임)도 동작입니다:

```python
def test_idempotent_create():
    id1 = create_resource("name")
    id2 = create_resource("name")  # 다시 호출
    assert id1 == id2  # 동일한 리소스
```

이것은 구현이 변경되어도 계약을 강제합니다.

## 관련 원칙

- **prove-it-works**: 동작 테스트는 코드가 무엇을 보장하는지 정확히 보여줍니다
- **boundary-discipline**: 공개 경계를 테스트하고 내부는 자유롭게 리팩토링하세요
- **subtract-before-you-add**: 동작 테스트는 불필요한 구현 세부 사항을 제거할 수 있게 합니다
