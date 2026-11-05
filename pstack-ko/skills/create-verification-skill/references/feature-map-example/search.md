# 노트 검색

검색은 사용자가 제목이나 본문 텍스트로 노트를 찾고, 일치하는 노트를 살펴보고, 일치하는 노트가 없는 상태와 검색을 쓸 수 없는 상태를 구별하게 합니다.

## 하위 기능

- `search-open`은 지원되는 각 브라우저 진입점에서 검색을 엽니다.
- `search-match`는 노트 데이터를 바꾸지 않고 제목과 본문 일치를 반환합니다.
- `search-open-result`는 결과를 노트 편집기에서 엽니다.
- `search-empty`는 일치가 없는 쿼리에 대해 완전한 빈 상태를 보여 줍니다.
- `search-clear`는 쿼리를 지우고 최근 노트 보기를 되돌립니다.
- `search-cli`는 터미널에서 같은 일치 노트를 반환합니다.

## 도달하는 방법 (사용자 관점)

- 브라우저 툴바에서 `Search` 버튼을 선택하세요.
- 편집 가능한 필드 밖에 포커스가 있는 동안 브라우저에서 `/`를 누르세요.
- 터미널에서 `notes search <query>`를 실행하세요.

## control-notes로 구동하기

전제 조건:

- Notes가 `http://127.0.0.1:4173`에서 정상입니다.
- 일회용 데이터 디렉터리에 본문 텍스트가 `Draft budget`인 `Quarterly plan`이 있습니다.
- `control-notes doctor`가 예상 URL과 데이터 디렉터리를 보고합니다.

- **툴바 진입.** `Search` 버튼을 선택하세요. `control-notes browser click --role button --name "Search"`를 실행하세요. `Search notes`라는 이름의 대화 상자가 나타나고, 포커스가 그 검색 상자에 있습니다.
- **키보드 진입.** 대화 상자를 닫고, 페이지에 포커스를 둔 다음 `/`를 누르세요. `control-notes browser press --key "/"`를 실행하세요. 같은 대화 상자가 나타나고, 페이지에는 슬래시가 삽입되지 않습니다.
- **제목 일치.** `quarterly`를 입력하세요. `control-notes browser fill --role searchbox --name "Search notes" --value "quarterly"`를 실행하세요. `Search results` 목록에는 `Quarterly plan`이 있고 `Grocery list`는 없습니다.
- **본문 일치.** 쿼리를 `budget`으로 바꾸세요. `control-notes browser fill --role searchbox --name "Search notes" --value "budget"`를 실행하세요. 결과 `Quarterly plan`이 본문 일치 발췌와 함께 계속 보입니다.
- **결과 열기.** `Quarterly plan`을 선택하세요. `control-notes browser click --role link --name "Quarterly plan"`를 실행하세요. 대화 상자가 닫히고 편집기 제목이 `Quarterly plan`입니다.
- **빈 상태.** 검색을 다시 열고 `volcano`를 입력하세요. `control-notes browser fill --role searchbox --name "Search notes" --value "volcano"`를 실행하세요. 검색이 끝난 뒤 `No matching notes`라는 이름의 상태가 나타납니다.
- **쿼리 지우기.** `Clear search`를 선택하세요. `control-notes browser click --role button --name "Clear search"`를 실행하세요. 검색 상자는 비어 있고, `Recent notes` 영역이 결과 목록을 대체합니다.
- **CLI 일치.** 터미널에서 검색하세요. `control-notes cli -- notes search "quarterly" --format json`을 실행하세요. 종료 코드는 `0`이고, stdout에는 제목이 `Quarterly plan`인 객체가 하나 있습니다.
- **CLI 불일치.** 없는 값을 검색하세요. `control-notes cli -- notes search "volcano" --format json`을 실행하세요. 종료 코드는 `0`이고 stdout은 `[]`입니다.
- **증명.** 결과가 채워진 상태를 캡처하세요. `control-notes browser snapshot --aria --path artifacts/search/results.aria.txt`와 `control-notes browser screenshot --path artifacts/search/results.png`를 실행하세요. 두 아티팩트 모두 Notes, 쿼리, `Quarterly plan`을 식별합니다.

## 주의점

- 편집기나 검색 상자에 포커스가 있는 동안 `/`를 누르면, 검색을 여는 대신 텍스트가 삽입됩니다.
- 결과는 짧은 디바운스 뒤에 갱신됩니다. 고정된 sleep이 아니라 결과 목록이나 빈 상태를 기다리세요.
- 사용자가 `Include archived`를 켜지 않으면 보관된 노트는 제외됩니다.
- CLI의 기본 출력은 사람이 읽기 위한 것입니다. 안정적인 단언에는 `--format json`을 사용하세요.
- 결과를 열면 브라우저 상태가 바뀝니다. 다른 쿼리를 증명하기 전에 검색을 다시 여세요.
