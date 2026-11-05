# 노트 만들기

노트 만들기는 사용자가 브라우저나 CLI에서 제목이 있는 노트를 저장하고, 끝나지 않은 초안을 취소하고, 두 번째 사용자 대면 보기에서 저장된 노트를 확인하게 합니다.

## 하위 기능

- `create-open`은 각 브라우저 진입점에서 빈 편집기를 엽니다.
- `create-save`는 제목과 본문을 저장합니다.
- `create-cancel`은 끝나지 않은 브라우저 초안을 버립니다.
- `create-cli`는 터미널에서 같은 형태의 노트를 만듭니다.

## 도달하는 방법 (사용자 관점)

- 브라우저 툴바에서 `New note` 버튼을 선택하세요.
- 편집 가능한 필드 밖에 포커스가 있는 동안 브라우저에서 `n`을 누르세요.
- 터미널에서 `notes create --title <title> --body <body>`를 실행하세요.

## control-notes로 구동하기

전제 조건:

- Notes가 `http://127.0.0.1:4173`에서 정상입니다.
- 제목이 `Release checklist`인 노트가 없습니다.
- `control-notes doctor`가 예상 URL과 일회용 데이터 디렉터리를 보고합니다.

- **편집기 열기.** `New note`를 선택하세요. `control-notes browser click --role button --name "New note"`를 실행하세요. `Note editor`라는 이름의 폼이 나타나고, 포커스가 `Title` 텍스트 상자에 있습니다.
- **내용 입력.** 제목과 본문을 입력하세요. `control-notes browser fill --role textbox --name "Title" --value "Release checklist"`와 `control-notes browser fill --role textbox --name "Body" --value "Tag and publish"`를 실행하세요. `Save note` 버튼이 활성화됩니다.
- **노트 저장.** `Save note`를 선택하세요. `control-notes browser click --role button --name "Save note"`를 실행하세요. `Note saved`라는 이름의 상태가 나타나고, 제목이 `Release checklist`입니다.
- **지속 확인.** 노트 목록으로 돌아가 노트를 다시 여세요. `control-notes browser click --role link --name "All notes"`와 `control-notes browser click --role link --name "Release checklist"`를 실행하세요. 편집기가 저장된 두 값을 모두 보여 줍니다.
- **초안 취소.** 새 노트를 열고 `Discard me`를 입력한 다음 `Cancel`을 선택하세요. `control-notes browser click --role button --name "New note"`, `control-notes browser fill --role textbox --name "Title" --value "Discard me"`, `control-notes browser click --role button --name "Cancel"`을 실행하세요. 노트 목록으로 돌아오고 `Discard me` 링크는 없습니다.
- **CLI 진입.** 두 번째 노트를 만드세요. `control-notes cli -- notes create --title "CLI note" --body "Created from terminal" --format json`을 실행하세요. 종료 코드는 `0`이고, stdout에 새 노트 ID와 제목이 있습니다.
- **증명.** `All notes`에서 저장된 노트 둘을 다시 여세요. `control-notes browser snapshot --aria --path artifacts/create-note/list.aria.txt`와 `control-notes browser screenshot --path artifacts/create-note/list.png`를 실행하세요. 아티팩트에 `Release checklist`와 `CLI note`가 보입니다.

## 주의점

- 텍스트 상자에 포커스가 있는 동안 `n`을 누르면, 새 편집기를 여는 대신 그 문자가 입력됩니다.
- 제목은 저장할 때 앞뒤 공백이 제거됩니다. 초안 입력값이 아니라 렌더된 제목을 단언하세요.
- 저장 상태만으로는 증명이 충분하지 않습니다. 목록에서 노트를 다시 여세요.
- 픽스처 정리 중에 `Release checklist`와 `CLI note`는 제거하되, 그 증명 아티팩트는 남기세요.
