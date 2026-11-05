---
name: scaffold-exercises
description: "린트를 통과하는 섹션, 문제, 솔루션, 설명자가 있는 연습 디렉토리 구조를 만듭니다. 사용자가 연습 구조를 만들거나, 연습 스텁을 만들거나, 새 코스 섹션을 설정하고 싶을 때 사용하세요."
---

# 연습 구조 만들기

`pnpm ai-hero-cli internal lint`를 통과하는 연습 디렉토리 구조를 만든 다음, `git commit`으로 커밋하세요.

## 디렉토리 이름

- **섹션**: `exercises/` 안의 `XX-section-name/` (예: `01-retrieval-skill-building`)
- **연습**: 섹션 안의 `XX.YY-exercise-name/` (예: `01.03-retrieval-with-bm25`)
- 섹션 번호는 `XX`, 연습 번호는 `XX.YY`입니다
- 이름은 dash-case입니다 (소문자, 하이픈)

## 연습 변형

각 연습에는 다음 하위 폴더가 하나 이상 필요합니다:

- `problem/`: 할 일(TODO)이 있는 수강생 작업 공간
- `solution/`: 참조 구현
- `explainer/`: 개념 자료. TODO가 없습니다

스텁을 만들 때, 계획이 다르게 정하지 않았으면 `explainer/`를 기본으로 하세요.

## 필수 파일

각 하위 폴더(`problem/`, `solution/`, `explainer/`)에는 `readme.md`가 필요합니다. 이 파일은 다음을 만족해야 합니다:

- **비어 있으면 안 됩니다** (실제 내용이 있어야 하며, 제목 한 줄이어도 됩니다)
- 깨진 링크가 없어야 합니다

스텁을 만들 때는 제목과 설명이 있는 최소 readme를 만드세요:

```md
# 연습 제목

여기에 설명을 적습니다
```

하위 폴더에 코드가 있으면 `main.ts`도 필요합니다 (1줄보다 길어야 합니다). 스텁이라면 readme만 있는 연습도 괜찮습니다.

## 워크플로우

1. **계획을 파싱하세요.** 섹션 이름, 연습 이름, 변형 종류를 추출하세요
2. **디렉토리를 만드세요.** 각 경로에 `mkdir -p`를 실행하세요
3. **스텁 readme를 만드세요.** 변형 폴더마다 제목이 있는 `readme.md`를 하나씩 만드세요
4. **린트를 실행하세요.** `pnpm ai-hero-cli internal lint`로 검증하세요
5. **오류를 고치세요.** 린트가 통과할 때까지 반복하세요

## 린트 규칙 요약

린터(`pnpm ai-hero-cli internal lint`)가 확인하는 항목:

- 각 연습에 하위 폴더(`problem/`, `solution/`, `explainer/`)가 있는지
- `problem/`, `explainer/`, `explainer.1/` 중 하나 이상이 있는지
- 주 하위 폴더에 `readme.md`가 있고 비어 있지 않은지
- `.gitkeep` 파일이 없는지
- `speaker-notes.md` 파일이 없는지
- readme에 깨진 링크가 없는지
- readme에 `pnpm run exercise` 명령이 없는지
- readme만 있는 경우가 아니면 하위 폴더마다 `main.ts`가 필요한지

## 연습 이동과 이름 변경

번호를 다시 매기거나 연습을 옮길 때:

1. 디렉토리 이름을 바꿀 때는 `mv` 대신 `git mv`를 사용하세요. git 이력이 남습니다
2. 순서가 유지되도록 숫자 접두사를 고치세요
3. 옮긴 뒤 린트를 다시 실행하세요

예:

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 예: 계획에서 스텁 만들기

다음과 같은 계획이 있으면:

```
섹션 05: 메모리 스킬 만들기
- 05.01 메모리 소개
- 05.02 단기 메모리 (explainer + problem + solution)
- 05.03 장기 메모리
```

다음을 만드세요:

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

그다음 readme 스텁을 만드세요:

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# 메모리 소개"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# 단기 메모리"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# 단기 메모리"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# 단기 메모리"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# 장기 메모리"
```
