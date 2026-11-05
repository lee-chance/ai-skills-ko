# 번역 가이드

이 문서는 AI 스킬과 플러그인을 한국어로 번역할 때 따라야 할 규칙과 용어집을 정의합니다.

## 번역 원칙

### 1. 무엇을 번역하나요?

**번역해야 하는 것:**
- 문서 본문 (SKILL.md, README.md 등의 설명 텍스트)
- YAML frontmatter의 `description` 필드
- 사용자 대면 메시지와 설명
- 주석과 문서화 콘텐츠
- 예시 설명 텍스트

**번역하지 않는 것:**
- 코드 (함수명, 변수명, 클래스명 등)
- 명령어 (Shell 명령, npm 스크립트, git 명령 등)
- 파일 경로와 URL
- YAML frontmatter 키 (name, description 등의 키 자체)
- YAML frontmatter의 `name` 값 (스킬 ID)
- 슬래시 커맨드 이름 (`/architect`, `/arena` 등)
- 스킬 이름 참조 (예: `**how**`, `**why**`, `**arena**`)
- 기술 용어와 고유명사 (TypeScript, React, API, CLI 등)
- 파일명과 확장자
- 마크다운 문법 자체

### 2. 번역 스타일

**자연스러운 한국어 사용:**
- 직역보다는 의역으로 자연스럽게
- 기술 문서의 명확성을 유지하면서도 읽기 쉽게
- "~하세요", "~합니다" 등의 존댓말 사용

**기술 용어 처리:**
- 일반적으로 통용되는 영어 기술 용어는 그대로 사용
- 필요시 괄호로 원어 병기: "타입 시그니처(type signature)"
- 일관성 있게 용어를 사용 (아래 용어집 참조)

**마크다운 구조 유지:**
- 제목 계층 구조 유지
- 링크 형식 유지 (경로는 변경하지 않음)
- 코드 블록과 인라인 코드는 그대로

### 3. YAML Frontmatter 처리

```yaml
---
name: skill-name              # 변경하지 않음 (스킬 ID)
description: "Translated description"  # 한국어로 번역
disable-model-invocation: true  # 키와 값 모두 변경하지 않음
---
```

### 4. 파일 및 폴더 구조

- 원본과 동일한 폴더 구조 유지
- 파일명은 변경하지 않음
- 모든 파일을 번역 (README, SKILL.md, 하위 문서 등)

## 용어집

일관성을 위해 다음 용어를 사용합니다:

| 영어 | 한국어 | 비고 |
|------|--------|------|
| skill | 스킬 | 그대로 사용 |
| agent | 에이전트 | 그대로 사용 |
| runner | 러너 | 그대로 사용 |
| implementation | 구현 | |
| sketch | 스케치 | 설계 초안의 의미로 |
| architecture | 아키텍처 | |
| design | 설계 | |
| ground (v.) | 기반 다지기 | 문맥에 따라 "근거 마련" |
| mental model | 정신 모델 | |
| interface | 인터페이스 | |
| module | 모듈 | |
| signature | 시그니처 | 함수/타입 시그니처 |
| type | 타입 | |
| candidate | 후보 | 설계 후보 |
| synthesis | 합성 | 여러 대안을 통합 |
| rationale | 근거 | 설계 결정의 이유 |
| greenfield | 그린필드 | 새로 시작하는 프로젝트 |
| red flag | 레드 플래그 | 경고 신호 |
| constraint | 제약 조건 | |
| subsystem | 하위 시스템 | |
| prompt | 프롬프트 | |
| workflow | 워크플로우 | |
| task | 작업 | |
| todo list | 투두리스트 | |
| phase | 단계 | |
| artifact | 아티팩트 | 산출물 |
| reference | 참조 | |
| commit | 커밋 | git 용어 |
| branch | 브랜치 | git 용어 |
| pull request (PR) | 풀 리퀘스트 | |
| upstream | 업스트림 | |
| sync | 동기화 | |
| diff | diff | 변경사항을 보여주는 것 |
| test | 테스트 | |
| build | 빌드 | |
| CI/CD | CI/CD | 그대로 사용 |
| deployment | 배포 | |
| environment | 환경 | |
| repository | 저장소 | |
| workspace | 워크스페이스 | |

## 번역 예시

### 원본 (영어)
```markdown
---
name: architect
description: "Sketch types, signatures, and module structure before code"
---

# Architect

Sketch types, function signatures, class shapes, and module boundaries.

## Start

Open a todolist with one entry per phase:

1. Ground
2. Sketch
3. Agree
```

### 번역 (한국어)
```markdown
---
name: architect
description: "코드를 작성하기 전에 타입, 시그니처, 모듈 구조를 스케치하세요"
---

# Architect

타입, 함수 시그니처, 클래스 형태, 모듈 경계를 스케치하세요.

## 시작

각 단계마다 하나의 항목이 있는 투두리스트를 여세요:

1. 기반 다지기 (Ground)
2. 스케치 (Sketch)
3. 합의 (Agree)
```

## 번역 워크플로우

### 새 파일 번역하기

1. **원본 파일 구조 확인**
   - 파일의 frontmatter, 제목, 섹션 구조 파악
   - 코드 블록, 링크, 참조 위치 확인

2. **번역 수행**
   - frontmatter의 description만 번역
   - 본문을 위에서 아래로 번역
   - 용어집을 참고하여 일관된 용어 사용
   - 코드, 명령어, 파일 경로는 그대로 유지

3. **검토**
   - 마크다운 문법이 올바른지 확인
   - 링크가 깨지지 않았는지 확인
   - 용어 사용이 일관적인지 확인
   - 자연스러운 한국어인지 확인

### 업데이트된 파일 번역하기

1. **변경사항 확인**
   ```bash
   # 동기화 스크립트로 확인
   npm run sync:check
   ```

2. **수정된 부분만 번역**
   - 추가된 섹션/문단 번역
   - 수정된 내용 업데이트
   - 삭제된 부분 제거

3. **기존 번역과 일관성 유지**
   - 이미 번역된 용어와 동일하게 사용
   - 번역 스타일 유지

## AI 에이전트를 위한 팁

AI 에이전트가 번역 작업을 수행할 때:

1. **이 가이드를 먼저 읽으세요**
   - 번역 원칙과 용어집을 숙지
   - 예시를 참고하여 스타일 파악

2. **pstack-ko를 참고 예시로 활용**
   - 이미 번역된 파일들의 스타일을 확인
   - 비슷한 구조의 파일은 비슷하게 번역

3. **일관성이 최우선**
   - 같은 영어 단어는 항상 같은 한국어로
   - 번역 톤과 스타일을 일관되게 유지

4. **불확실한 경우**
   - 기술 용어는 영어 그대로 사용하는 것이 안전
   - 문맥상 자연스러운 쪽을 선택

## 번역 체크리스트

번역을 완료했다면 다음을 확인하세요:

- [ ] frontmatter의 `name`은 변경하지 않았나?
- [ ] frontmatter의 `description`은 번역했나?
- [ ] 슬래시 커맨드 이름은 그대로 유지했나?
- [ ] 파일 경로와 URL은 변경하지 않았나?
- [ ] 코드 블록의 코드는 그대로인가?
- [ ] 용어집의 용어를 일관되게 사용했나?
- [ ] 마크다운 문법이 올바른가?
- [ ] 링크가 정상적으로 작동하나?
- [ ] 자연스러운 한국어인가?
- [ ] 원본의 의미가 정확히 전달되는가?

## 참고 자료

- **pstack-ko/**: 완성된 번역 예시
- **sources.yaml**: 소스 레지스트리
- **AGENTS.md**: AI 에이전트를 위한 추가 가이드
