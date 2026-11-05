# Triage Labels

스킬들은 다섯 가지 표준 트리아지 역할을 사용합니다. 이 파일은 해당 역할을 이 저장소의 이슈 트래커에서 사용하는 실제 레이블 문자열에 매핑합니다.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | 유지관리자가 이 이슈를 평가해야 함  |
| `needs-info`               | `needs-info`         | 보고자의 추가 정보를 기다리는 중 |
| `ready-for-agent`          | `ready-for-agent`    | 완전히 명시됨, AFK 에이전트 준비 완료  |
| `ready-for-human`          | `ready-for-human`    | 사람의 구현이 필요함            |
| `wontfix`                  | `wontfix`            | 조치하지 않음                     |

스킬이 역할을 언급할 때(예: "AFK-ready 트리아지 레이블 적용"), 이 표의 해당 레이블 문자열을 사용하세요.

상태를 선택하기 전에 모든 이슈를 [`SCOPE.md`](../../SCOPE.md)에 대해 판단하세요. 거부는 "not planned"로 종료됩니다.
