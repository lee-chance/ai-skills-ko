# 출처

이 폴더는 Benji Taylor Skills의 한국어 번역입니다.

- **원본 저장소**: https://github.com/benjitaylor/skills
- **원본 경로**: `/` (루트)
- **번역 기준 커밋**: `299140fafd08df55a9c234e610c3f64af3f45531`
- **동기화 날짜**: 2026-11-05
- **라이선스**: MIT (원본과 동일, `stageshow/LICENSE`)

## 번역 상태

- **시작일**: 2026-11-05
- **완료일**: 2026-11-05
- **번역율**: 마크다운 산문 100%
- **번역자**: AI 에이전트 (Cursor)

### 번역한 마크다운

**루트**
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`는 `@AGENTS.md` 포함 지시만 있어 본문 산문이 없습니다

**Stageshow**
- `stageshow/SKILL.md`
- `stageshow/README.md`
- `stageshow/NOTICE.md`
- `stageshow/references/`의 참조 문서 전부
- `stageshow/examples/cursor-morph/README.md`
- `stageshow/examples/wikipedia/PHOTOS.md`
- `stageshow/kit/brands/SOURCES.md`

코드, CSS, 이미지, `stageshow/LICENSE`와 `kit/brands/LICENSE-*.txt`는 원본과 같습니다. 이 업스트림에는 CHANGELOG가 없습니다.

## 번역 가이드

번역은 이 저장소 루트의 `TRANSLATION_GUIDE.md`를 따릅니다.
- 코드, 명령어, 파일 경로, 스킬 이름, frontmatter 키와 `name`은 변경하지 않음
- frontmatter의 `description`은 번역
- 존댓말 사용 (`~하세요`, `~합니다`)

## 동기화

업스트림 업데이트를 확인하려면:

```bash
npm run sync:check
```

업스트림 변경사항을 동기화하려면:

```bash
npm run sync benjitaylor-skills
```
