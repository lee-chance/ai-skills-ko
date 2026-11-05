---
name: scaffold-exercises
description: "린팅을 통과하는 섹션, 문제, 솔루션 및 설명자를 포함한 연습 디렉토리 구조를 생성합니다. 사용자가 연습을 스캐폴드하거나, 연습 스텁을 생성하거나, 새 코스 섹션을 설정하고 싶을 때 사용하세요."
---

# Scaffold Exercises

`pnpm ai-hero-cli internal lint`를 통과하는 연습 디렉토리 구조를 생성한 다음, `git commit`으로 커밋합니다.

## 디렉토리 명명

- **섹션**: `exercises/` 내부의 `XX-section-name/` (예: `01-retrieval-skill-building`)
- **연습**: 섹션 내부의 `XX.YY-exercise-name/` (예: `01.03-retrieval-with-bm25`)
- 섹션 번호 = `XX`, 연습 번호 = `XX.YY`
- 이름은 대시 케이스(소문자, 하이픈)

## 연습 변형

각 연습은 다음 하위 폴더 중 적어도 하나가 필요합니다:

- `problem/` - TODO가 있는 학생 워크스페이스
- `solution/` - 참조 구현
- `explainer/` - 개념 자료, TODO 없음

스터빙할 때, 계획이 다르게 지정하지 않는 한 `explainer/`를 기본값으로 하세요.

## 필수 파일

각 하위 폴더(`problem/`, `solution/`, `explainer/`)는 다음과 같은 `readme.md`가 필요합니다:

- **비어 있지 않음** (실제 콘텐츠가 있어야 하며, 단일 제목 줄도 작동함)
- 깨진 링크 없음

스터빙할 때, 제목과 설명이 있는 최소한의 readme를 생성하세요:

```md
# Exercise Title

Description here
```

하위 폴더에 코드가 있으면, `main.ts` (>1 line)도 필요합니다. 그러나 스텁의 경우, readme 전용 연습이 괜찮습니다.

## 워크플로우

1. **계획 파싱** - 섹션 이름, 연습 이름, 변형 타입 추출
2. **디렉토리 생성** - 각 경로에 대해 `mkdir -p`
3. **스텁 readme 생성** - 제목이 있는 변형 폴더당 하나의 `readme.md`
4. **린트 실행** - `pnpm ai-hero-cli internal lint`로 검증
5. **에러 수정** - 린트가 통과할 때까지 반복

## 린트 규칙 요약

린터(`pnpm ai-hero-cli internal lint`)는 다음을 확인합니다:

- 각 연습에 하위 폴더(`problem/`, `solution/`, `explainer/`)가 있음
- `problem/`, `explainer/`, 또는 `explainer.1/` 중 적어도 하나가 존재
- `readme.md`가 존재하고 기본 하위 폴더에 비어 있지 않음
- `.gitkeep` 파일 없음
- `speaker-notes.md` 파일 없음
- readme에 깨진 링크 없음
- readme에 `pnpm run exercise` 명령 없음
- readme 전용이 아닌 한 하위 폴더당 `main.ts` 필요

## 연습 이동/이름 바꾸기

연습을 재번호 지정하거나 이동할 때:

1. `git mv`(`mv`가 아님)를 사용하여 디렉토리 이름 바꾸기 - git 히스토리 보존
2. 순서를 유지하기 위해 숫자 접두사 업데이트
3. 이동 후 린트 재실행

예제:

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 예제: 계획에서 스터빙

다음과 같은 계획이 주어졌을 때:

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

생성:

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

그런 다음 readme 스텁 생성:

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
