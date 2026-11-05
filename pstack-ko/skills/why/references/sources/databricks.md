# Databricks 분석 및 시스템 테이블

## 이 소스에 있는 것

Databricks는 제품 분석, 데이터 파이프라인, 웨어하우스 텔레메트리 층입니다. Datadog을 보완합니다. Datadog은 *인프라/런타임* 시점이고, Databricks는 *제품/데이터* 시점입니다 (사용자가 무엇을 했는지, 어떤 실험이 돌았는지, 기능 사용이 어떻게 바뀌었는지, 임계값 상수가 어디서 왔는지).

- **제품 분석 이벤트.** `your_warehouse.events.analytics_track_event` (원시)와 `<your_analytics_db>.<schema>.<table>` 안의, 타입이 지정되고 이벤트별로 중복이 제거된 dbt 모델. 사용자 행동: 기능 호출, 클릭, 수락/거절, 제출, 클라이언트가 보고한 오류.
- **사용량 및 청구 이벤트.** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`, `your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`. 비용이나 규모가 결정을 이끈 경우에 해당합니다.
- **실험 / 기능 플래그 데이터.** 노출 및 결과 테이블. **스키마는 회사마다 다릅니다.** 이름을 가정하기 전에 `SHOW TABLES`로 확인하세요.
- **시스템 테이블.** `system.query.history`, `system.compute.warehouses`, `system.billing.*`, `system.access.audit`. "이 쿼리는 비쌌나?", "누군가 이것을 얼마나 자주 실행했나?", "웨어하우스 부하가 언제 급증했나?"에 답합니다.
- **dbt 계보.** `<your_analytics_db>.<schema>`의 모델은 어떤 파이프라인이 테이블/필드에 의존하는지를 보여 줍니다. 업스트림 변경이 소비자 코드 변경의 동기인 경우가 많습니다.
- **Databricks 노트북.** 엔지니어가 코드를 바꾸기 전에 작성한 탐색적 분석. **SQL MCP로는 쿼리할 수 없습니다.** 근거가 노트북에 있다고 의심되면 공백으로 이름 붙이세요.

## 검색 방법

Databricks SQL MCP를 사용하세요. 주 도구는 `execute_sql_read_only`입니다. `statement_id`를 반환하면 다시 실행하지 말고 `poll_sql_result`로 결과를 확인하세요.

**쿼리하기 전에 방향을 잡으세요.** 스키마는 회사마다 다릅니다. 테이블 이름을 믿기 전에 확인하세요.

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**모든 쿼리에 시간 범위를 두세요.** 이 테이블들은 거대하고, 제한 없는 스캔은 타임아웃됩니다. 출시일을 둘러싼 창으로 `_timestamp` (이벤트) 또는 `start_time` (`system.query.history`)을 필터하세요. 보통 전후 약 30일이고, 강한 이유가 있을 때만 더 넓히세요.

**원시 테이블보다 타입이 지정된 dbt 모델을 우선하세요.** `<your_analytics_db>.<schema>.<table>`은 중복이 제거되고, 타입이 지정되고, liquid clustering이 적용되어 있습니다. `your_warehouse.events.analytics_track_event`에는 중복과 타입이 없는 `properties_json`이 있습니다. 모델 이름 패턴은 `stg_<source>_<event_name_with_underscores>`이며, `<source>`는 `app`, `backend`, `website`, 또는 `cli`입니다. 패턴만으로 정해지지 않으면 `SHOW TABLES`로 정확한 모델 이름을 확인하세요. 아직 dbt 모델이 없거나, dbt 새로고침 지연 안의 이벤트가 필요할 때만 원시 테이블로 내려가세요.

**타입이 지정된 dbt 모델의 열 관례** (`DESCRIBE`를 왕복하지 않아도 됩니다):

- `_timestamp`, `_id`, `_auth_id`, `_request_id`, `event_name`. 모든 모델의 표준입니다
- `properties_<name>`. 타입이 지정되고 밑줄 표기인 이벤트 속성 (`properties_entrypoint`, `properties_size_bytes` 등)
- `context_team_id`, `context_client_version`, `context_country`, `context_client_os`. 미리 추출된 클라이언트 컨텍스트

### 효과가 있는 조사 패턴

대상과 맞는 테이블과 열 조합을 고르세요.

1. **이벤트 사용 궤적.** 풀 리퀘스트 머지를 중심으로 ±30일 창에서 관련 `stg_*` 모델의 일별 개수. 머지 후 하루나 이틀 안에 0에서 안정적인 양으로 올라가는 계단 함수는, 그 풀 리퀘스트가 기능을 출시했다는 강한 정황 증거입니다. 0으로 줄어들면 지원 중단이나 삭제를 시사합니다.
2. **가드레일 / 방어적 검사의 기원.** 풀 리퀘스트 *이전* 14일 동안 관련 `properties_<name>` 열의 분포 (중앙값 / p99 / 최댓값). p99가 대상의 임계값 상수와 일치하면, 그 숫자가 데이터에서 선택되었음을 시사합니다.
3. **실험 / 기능 플래그 조회.** `SHOW TABLES ... LIKE '*experiment*'`로 노출 테이블을 찾은 다음, 풀 리퀘스트 날짜 부근의 해당 플래그 키에 대해 변형(variant)별 노출 수를 가져오세요.
4. **마이그레이션, 백필, 성능 재작성에 대한 쿼리 기록 증거.** `statement_text ILIKE '%<table_or_symbol>%'`과 촘촘한 `start_time` 창으로 거른 `system.query.history`는, 변경의 동기였을 비싼 쿼리를 드러냅니다 (`total_duration_ms`로 정렬하거나 `SUM(read_bytes)`, `COUNT(*)`를 집계하세요).
5. **dbt 계보.** 대상이 `<your_analytics_db>.<schema>` 모델을 읽거나 그 모델에 쓰면, 그 모델 자체의 git 기록 (이 저장소 안)이 근거를 담고 있는 경우가 많습니다. 그 단서는 git 조사자에게 넘기세요. 직접 따라가지 마세요.

## 여기서 좋은 증거는 어떤 모습인가

위의 패턴 형태에 더해:

- 오류를 분류하는 이벤트의 개수가 방어적 코드 풀 리퀘스트 이후 며칠 안에 거의 0으로 떨어집니다. 그 풀 리퀘스트가 해당 오류 클래스를 해결했음을 시사합니다
- 노출 테이블 행이 대상의 기능 플래그 키를 가리키고, 풀 리퀘스트 출시일 무렵에 "shipped" / "concluded" 결정이 있습니다

## 흔한 함정

- **계측되었다고 해서 원인이 되지는 않습니다.** 이벤트가 존재한다는 것은 누군가 그것을 기록할 만큼 신경 썼다는 뜻이지, 대상 코드가 그것 *때문에* 존재한다는 뜻은 아닙니다. 원인을 주장하기 전에 git 조사자의 풀 리퀘스트/커밋 인용과 짝을 이루세요.
- **조용한 계측 변경.** 이벤트 양의 계단 함수는 사용자 행동이 바뀐 것이 아니라, 새 이벤트가 기록되기 시작했다는 뜻일 수 있습니다. 증가를 기능 출시 신호로 읽기 전에 같은 창의 계측 풀 리퀘스트를 확인하세요.
- **스키마 드리프트.** 이벤트 속성은 변합니다. 오늘 타입이 지정된 dbt 모델에 있는 열이 대상이 작성될 때는 없었을 수 있습니다. 더 오래된 데이터는 그 속성을 원시 `properties_json` 안에만 담고 있을 수 있습니다.
- **dbt 새로고침 지연.** `<your_analytics_db>.<schema>.*`는 일정에 따라 다시 만들어집니다 (대개 시간별/일별). 최근 몇 시간의 이벤트는 `your_warehouse.events.*`로 돌아가 `_id`로 중복을 제거하세요.
- **회사별 테이블.** 실험, 기능 플래그, 청구, 사용량 테이블은 제각각입니다. 존재를 확인하지 않은 테이블의 결과를 보고하는 것은 전형적인 실패입니다. 먼저 `SHOW TABLES` / `DESCRIBE TABLE`로 확인하세요.
- **보존 기간 절벽.** 관련 창이 테이블의 보존 기간이나 dbt 모델 생성일보다 앞이면, 그것은 *공백*입니다. null 결과가 아닙니다. 합성기가 "결과 없음"을 "활동 없음"으로 읽지 않도록 명시적으로 이름 붙이세요.
- **노트북은 쿼리할 수 없습니다.** SQL MCP는 Databricks 노트북을 볼 수 없습니다. 근거가 그 안에 있다고 의심되면 공백을 반환하세요.

## 반환할 내용

관련된 각 발견에 대해:
- 유형 (제품 이벤트 / 실험 노출 / 사용량 또는 청구 이벤트 / 시스템 테이블 행 / dbt 모델)
- 완전히 한정된 테이블 이름과 실행한 정확한 쿼리
- 쿼리한 시간 창
- 압축된 수치 요약 (개수, 백분위수, 처음/마지막 관측 타임스탬프). **원시 행을 그대로 덤프하지 마세요.**
- 대상의 출시일과의 시간적 상관 (예: "첫 행 2024-08-15, 풀 리퀘스트 #49074는 2024-08-14에 머지")
- 관련성 + 강도: 직접 / 정황 / 약함
