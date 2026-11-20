---
name: principle-separate-before-serializing-shared-state
description: "동시 액터가 같은 파일, 브랜치, 키 또는 상태 객체에 쓸 수 있을 때 적용. 먼저 공유를 제거하고, 하나의 공유 작성자가 실제 불변식일 때만 구조적으로 직렬화."
disable-model-invocation: true
---

# Separate Before Serializing Shared State (공유 상태를 직렬화하기 전에 분리)

동시 액터가 같은 파일, 브랜치, 키 또는 객체에 쓸 수 있을 때, 먼저 그들에게 하나의 공유 객체가 필요한지, 아니면 독립적인 사실을 게시하는 것인지 질문하세요. 기본적으로 각 액터에게 자체 파일, 키, 브랜치 또는 상태 디렉터리를 주고, 상태를 읽는 곳에서만 병합하세요. 두 워커가 하나의 `state.json`에 각자의 필드를 쓰는 것도 여전히 공유된 변경입니다.

하나의 공유 쓰기 대상이 실제 불변식일 때만 접근을 구조적으로 직렬화하세요(lockfile, 단일 작성자, 순차 단계, compare-and-swap). 지시사항은 동시성 제어가 아니며, "락이 필요하다"는 먼저 점검해야 할 냄새입니다.
