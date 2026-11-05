# 출처

이 폴더는 Matt Pocock Skills의 한국어 번역입니다.

- **원본 저장소**: https://github.com/mattpocock/skills
- **원본 경로**: `/` (루트)
- **번역 기준 커밋**: `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`
- **동기화 날짜**: 2026-11-05
- **라이선스**: MIT (원본과 동일)

## 번역 상태

- **시작일**: 2026-11-05
- **완료일**: 2026-11-05
- **번역율**: 100% (모든 파일 번역 완료)
- **번역자**: AI 에이전트 (Cursor)

### 번역 완료 파일 (113개)

**루트 문서 (6개):**
- ✅ `README.md` - 메인 문서
- ✅ `CLAUDE.md` - Claude 전용 가이드
- ✅ `CONTRIBUTING.md` - 기여 가이드
- ✅ `GLOSSARY.md` - 용어집
- ✅ `SCOPE.md` - 범위 정의
- ✅ `SOURCE.md` - 출처 및 번역 상태 (이 파일)

**Bucket READMEs (5개):**
- ✅ `skills/engineering/README.md`
- ✅ `skills/productivity/README.md`
- ✅ `skills/deprecated/README.md`
- ✅ `skills/misc/README.md`
- ✅ `skills/in-progress/README.md`

**Engineering 스킬 (20개):**
- ✅ `ask-matt/SKILL.md` - 스킬 라우터
- ✅ `codebase-design/SKILL.md` - 코드베이스 설계
- ✅ `code-review/SKILL.md` - 코드 리뷰
- ✅ `diagnosing-bugs/SKILL.md` - 버그 진단
- ✅ `domain-modeling/SKILL.md` - 도메인 모델링
- ✅ `grill-with-docs/SKILL.md` - 문서 기반 그릴링
- ✅ `implement/SKILL.md` - 구현
- ✅ `implement-spec/SKILL.md` - 스펙 구현
- ✅ `improve-codebase-architecture/SKILL.md` - 아키텍처 개선
- ✅ `pr/SKILL.md` - PR 작성
- ✅ `prototype/SKILL.md` - 프로토타입
- ✅ `research/SKILL.md` - 리서치
- ✅ `retro/SKILL.md` - 회고
- ✅ `setup-matt-pocock-skills/SKILL.md` - 초기 설정
- ✅ `tdd/SKILL.md` - TDD
- ✅ `to-spec/SKILL.md` - 스펙 작성
- ✅ `to-tickets/SKILL.md` - 티켓 분할
- ✅ `triage/SKILL.md` - 트리아지
- ✅ `wayfinder/SKILL.md` - 경로 탐색
- ✅ `wizard/SKILL.md` - 마법사 생성

**Productivity 스킬 (7개):**
- ✅ `grilling/SKILL.md` - 그릴링 프리미티브
- ✅ `grill-me/SKILL.md` - 상태 비저장 그릴링
- ✅ `handoff/SKILL.md` - 핸드오프
- ✅ `teach/SKILL.md` - 교육
- ✅ `to-questionnaire/SKILL.md` - 설문지 생성
- ✅ `wait-what/SKILL.md` - 명확화
- ✅ `writing-for-agents/SKILL.md` - 에이전트 문서 작성

**In-progress 스킬 (8개):**
- ✅ `chief-of-staff/SKILL.md`
- ✅ `claude-handoff/SKILL.md`
- ✅ `loop-me/SKILL.md`
- ✅ `setup-ts-deep-modules/SKILL.md`
- ✅ `software-factory/SKILL.md`
- ✅ `writing-beats/SKILL.md`
- ✅ `writing-fragments/SKILL.md`
- ✅ `writing-shape/SKILL.md`

**Misc 스킬 (4개):**
- ✅ `git-guardrails-claude-code/SKILL.md`
- ✅ `migrate-to-shoehorn/SKILL.md`
- ✅ `scaffold-exercises/SKILL.md`
- ✅ `setup-pre-commit/SKILL.md`

**.agents 문서 (5개):**
- ✅ `writing-docs.md`
- ✅ `invocation.md`
- ✅ `install-block.md`
- ✅ `adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md`
- ✅ `adr/0002-ship-as-a-claude-code-plugin.md`

**보조 문서 및 CHANGELOG (기타):**
- 모든 보조 마크다운 파일 번역 완료
- `CHANGELOG.md` 번역 완료

## 번역 가이드

번역은 이 저장소 루트의 `TRANSLATION_GUIDE.md`를 따릅니다:
- 코드, 명령어, 파일 경로는 변경하지 않음
- YAML frontmatter의 `name`과 기술 ID는 그대로, `description`은 번역
- 슬래시 커맨드 이름은 그대로 (`/grill-me`, `/tdd` 등)
- 기술 용어는 일관된 한국어 사용 (GLOSSARY.md 참조)
- 존댓말 사용 (~하세요, ~합니다)

## 기여

번역 개선에 기여하고 싶으시다면:
1. 원본 저장소: https://github.com/lee-chance/ai-skills-ko
2. `TRANSLATION_GUIDE.md`를 읽고 일관성 유지
3. 이슈 등록 또는 풀 리퀘스트 제출

## 동기화

업스트림 업데이트를 확인하려면:
```bash
npm run sync:check
```

업스트림 변경사항을 동기화하려면:
```bash
npm run sync
```
