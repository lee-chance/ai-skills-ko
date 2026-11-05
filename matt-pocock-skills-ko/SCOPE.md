# 범위

이 저장소는 제가 매일 사용하는 스킬 세트입니다. 큐레이션되어 있습니다: 아이디어는 환영하며, 각각은 아래 기준에 따라 판단됩니다. 이슈는 스킬에 대한 변경사항을 추적하기 위한 것입니다. 질문과 토론은 [GitHub Discussions](https://github.com/mattpocock/skills/discussions)로 가세요.

## 기준

아이디어나 피드백 이슈는 **두 부분** 모두를 통과할 때만 열린 상태로 유지됩니다:

1. **관찰된 실패.** 실제 세션에서 잘못된 것을 설명합니다: 무엇을 실행했는지, 스킬이 무엇을 했는지, 무엇을 기대했는지. 가상의 개선("...하면 더 좋을 것 같습니다")은 이 부분을 통과하지 못합니다.
2. **철학에 맞음.** [`.out-of-scope/`](./.out-of-scope/)의 어떤 것이나 과거 거부와 일치하지 않으며, 설정 옵션, 하네스 전용 분기, 또는 한 사람의 워크플로우에 맞춘 조정이 아닙니다. 그것들은 여러분의 `CLAUDE.md` / `AGENTS.md`나 포크에 속합니다 (skills.sh가 편집 가능한 사본을 제공합니다).

크기는 관련이 없습니다: 한 단어 수정과 다시 작성은 같은 기준을 마주합니다. 리액션과 +1 코멘트는 기준에 포함되지 않습니다.

## 버킷별

- **`engineering/`, `productivity/`, `in-progress/`**: 위의 기준.
- **`misc/`**: 동결되고 유지보수되지 않습니다. 모든 이슈가 닫힙니다. [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)를 참조하세요.
- **새 스킬**: 제안과 기여는 닫힙니다. 동작이 기존 스킬로 구성되면, 새로운 스킬을 얻지 못합니다. [`new-skills.md`](./.out-of-scope/new-skills.md)를 참조하세요.

## 이미 결정됨

[`.out-of-scope/`](./.out-of-scope/)의 각 파일은 거부된 한 개념과 그 이유를 기록합니다. 제출하기 전에 읽어보세요:

- [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)
- [`harness-name-collisions.md`](./.out-of-scope/harness-name-collisions.md)
- [`mainstream-issue-trackers-only.md`](./.out-of-scope/mainstream-issue-trackers-only.md)
- [`native-question-tool.md`](./.out-of-scope/native-question-tool.md)
- [`new-skills.md`](./.out-of-scope/new-skills.md)
- [`question-limits.md`](./.out-of-scope/question-limits.md)
- [`setup-skill-verify-mode.md`](./.out-of-scope/setup-skill-verify-mode.md)
- [`subagent-recursion.md`](./.out-of-scope/subagent-recursion.md)

## 불명확한 이슈

기준에 따라 판단할 수 없는 이슈는 한 번의 질문 라운드와 `needs-info` 라벨을 받습니다. 보고자로부터 14일 내에 답변이 없으면 닫힙니다. 거부는 "not planned"로 닫힙니다.
