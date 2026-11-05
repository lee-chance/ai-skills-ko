# 코드 고고학 (git + 저장소 안)

## 이 소스에 있는 것

- 커밋 기록 (메시지, 날짜, 작성자, diff)
- 풀 리퀘스트 설명, 리뷰 코멘트, 토론 스레드 (`gh`를 통해)
- 인라인 코드 주석, TODO, FIXME, 지원 중단(deprecation) 메모
- ADR (아키텍처 결정 기록). 저장소가 보관하는 경우
- 테스트. 이름과 어서션은 변경을 일으킨 엣지 케이스를 담는 경우가 많습니다
- 같은 커밋에서 수정된 관련 파일 (함께 변경된 신호)
- 저장소 안의 CHANGELOG 항목과 릴리스 노트
- 커밋 메시지와 풀 리퀘스트 본문의 이슈/티켓 ID

코드에 직접 묶여 있는, 가장 신뢰할 수 있고 가장 완전한 소스입니다. 저장소를 거친 것은 모두 여기에 있어야 합니다.

## 검색 방법

시드 커밋 목록을 확장하세요.

```bash
# 이름 변경을 따라가는 기록
git log --follow --oneline -- <file>

# pickaxe: 이 정확한 텍스트를 추가하거나 제거한 커밋
git log -S '<exact_string_from_code>' -- <file>

# 패턴의 경우:
git log -G '<regex>' -- <file>

# 각 줄을 누가, 언제 작성했는지
git blame -L <start>,<end> <file>

# 커밋 하나의 전체 diff
git show <hash>

# 이 파일에 영향을 준, 두 지점 사이의 커밋
git log <old>..<new> -p -- <file>
```

코드 밖의 문서를 찾으세요.

```bash
# ADR은 흔히 docs/adr/ 등에 있습니다
rg -l -i 'architecture.decision' --glob '*.md'

# 대상 근처의 TODO와 FIXME
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# 관련 테스트
rg -l '<symbol>' --glob '*test*'
```
