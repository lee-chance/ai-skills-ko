---
name: principle-separate-before-serializing-shared-state
description: 공유 상태를 직렬화하기 전에 분리하기
---

# 원칙: 공유 상태를 직렬화하기 전에 분리하기

병렬 작업이 상태를 공유해야 할 때 (예: 누적된 오류 목록, 커버리지 맵, 벤치마크 결과), 각 워커가 자체 격리된 사본을 생성하도록 하고 마지막에 병합하세요. 공유 전역 상태를 직렬화 접근으로 보호하지 마세요.

## 이유

- **락과 대기를 제거합니다**: 각 워커가 독립적으로 실행됩니다
- **정확성이 더 명확합니다**: 병합 로직은 한 곳에 있습니다
- **스케일이 더 좋습니다**: N명의 워커 = N배의 처리량; 락 경쟁이 없습니다
- **재시도와 롤백이 간단합니다**: 각 워커 상태는 격리되어 있습니다

## 방법

1. 각 워커가 로컬 결과 구조를 생성하도록 합니다 (리스트, 맵, 객체)
2. 워커가 완료되면 모든 로컬 결과를 하나의 merge 단계로 결합합니다
3. 작업자가 성공/실패 신호를 보내고 상태에 접근하지 않도록 합니다

병합은 직렬일 수 있습니다 (보통 빠릅니다), 또는 맵-리듀스를 통해 병렬화할 수도 있습니다.

## 예시

**나쁜 예** (공유 전역에 락):

```python
# 전역 상태, 뮤텍스로 보호
errors = []
lock = threading.Lock()

def worker(file):
    result = lint(file)
    with lock:
        errors.extend(result.errors)  # 직렬화

# 모든 워커가 락에서 대기
```

**좋은 예** (분리된 다음 병합):

```python
def worker(file):
    return lint(file).errors  # 로컬 리스트 반환

# 병렬로 실행
results = run_parallel(worker, files)

# 마지막에 한 번 병합
all_errors = [err for r in results for err in r]
```

## 언제 적용할까

- 여러 워커가 결과를 수집할 때 (오류, 경고, 메트릭)
- 통계를 계산할 때 (카운터, 히스토그램, 타이밍)
- 인덱스나 커버리지 맵을 빌드할 때

각 워커가 자체 누산기를 갖도록 하고, 마지막에 reduce하세요.

## 병합 전략

- **리스트**: 연결 (`all = sum(lists, [])`)
- **카운터**: 합산 (`total = sum(counts.values())`)
- **맵**: 업데이트 또는 키별 병합
- **세트**: 합집합 (`final = set().union(*sets)`)

커스텀 병합이 필요하다면 한 곳에 작성하세요; 워커는 그것을 호출하지 않습니다.

## 관련 원칙

- **make-operations-idempotent**: 로컬 결과는 재시도와 멱등성을 더 쉽게 만듭니다
- **sequence-verifiable-units**: 각 워커 출력을 독립적으로 검증할 수 있습니다
- **never-block-on-the-human**: 병렬 워크플로우는 인간 응답을 기다리는 동안 진행을 차단하지 않습니다
