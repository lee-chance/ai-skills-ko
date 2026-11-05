# simplify-ignore 훅

`/code-simplify`를 위한 블록 단위 보호입니다. 단순화하면 안 되는 코드를 표시하면 모델은 그 코드를 보지 못합니다.

## 설정

1. 보호할 블록에 주석을 다세요.

```js
/* simplify-ignore-start: perf-critical */
// manually unrolled XOR — 3x faster than a loop
result[0] = buf[0] ^ key[0];
result[1] = buf[1] ^ key[1];
result[2] = buf[2] ^ key[2];
result[3] = buf[3] ^ key[3];
/* simplify-ignore-end */
```

2. `.claude/settings.json`에 훅을 추가하세요.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [{ "type": "command", "command": "bash \"${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh\"" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "bash \"${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh\"" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "bash \"${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh\"" }]
      }
    ]
  }
}
```

3. `/code-simplify`를 실행하세요. 보호된 블록은 `/* BLOCK_de115a1d: perf-critical */` 자리 표시자가 됩니다. 모델은 보호된 구현을 보지 않고 주변 코드만 놓고 추론합니다.

> **참고:** 훅은 임시 백업을 `.claude/.simplify-ignore-cache/`에 둡니다. 이 경로가 `.gitignore`에 있는지 확인하세요.

## 동작 방식

스크립트 하나, 훅 이벤트 세 가지입니다.

| 이벤트 | 동작 |
|---|---|
| `PreToolUse Read` | 파일을 백업하고, 블록을 그 자리에서 `BLOCK_<hash>` 자리 표시자로 바꿉니다 |
| `PostToolUse Edit\|Write` | 자리 표시자를 실제 코드로 되돌리고, 모델의 변경을 저장한 뒤, 다시 필터링합니다 |
| `Stop` | 디스크의 각 파일에 남은 자리 표시자를 실제 코드로 되돌려, `Edit`/`Write` 밖에서 한 변경도 유지합니다. 파일이 통째로 되돌려진 경우(`git checkout`/`stash`로 되돌리기, 실행 취소)는 낡은 백업 대신 그 파일을 유지합니다. 자리 표시자가 하나도 남지 않았을 때만 백업으로 되돌립니다 |

각 블록은 내용으로 해시합니다(`shasum`/`sha1sum`으로 16진수 8자). 모델이 자리 표시자를 복제하거나 순서를 바꿔도 왕복이 한 가지로 결정됩니다. 캐시 범위는 프로젝트라서 세션끼리 간섭하지 않습니다.

## 주석 문법

```js
/* simplify-ignore-start */           // basic — hides the block
/* simplify-ignore-start: reason */   // with reason — appears in placeholder
/* simplify-ignore-end */
```

어떤 주석 스타일이든 동작합니다(`//`, `/*`, `#`, `<!--`). 파일당 블록을 여러 개 둘 수 있고, 한 줄 블록도 지원합니다. 자리 표시자는 원래 주석 문법을 유지합니다(예: Python은 `# BLOCK_xxx`, HTML은 `<!-- BLOCK_xxx -->`).

## 충돌 복구

Claude Code가 Stop 훅을 트리거하지 못한 채 종료되면, 디스크의 파일에 `BLOCK_<hash>` 자리 표시자가 남아 있을 수 있습니다. 직접 복원하려면 다음을 실행하세요.

```bash
echo '{}' | bash hooks/simplify-ignore.sh
```

백업은 프로젝트 디렉터리 안의 `.claude/.simplify-ignore-cache/`에 저장됩니다.
훅이 켜져 있는 동안 변경이 되돌려지면, 밀려난 세션 백업이 `<id>.superseded.<pid>`라는 이름으로 거기에 남습니다. 확인하고, 더 이상 필요 없으면 지우세요.

## 알려진 제한

- **한 줄 블록은 그 줄 전체를 숨깁니다.** `simplify-ignore-start`와 `simplify-ignore-end`가 다른 코드와 같은 줄에 있으면, 주석이 달린 부분만이 아니라 그 줄 전체가 모델에서 숨겨집니다. 주석은 전용 줄에 두세요.
- **주석 접미사 감지는 `*/`와 `-->`만 포함합니다.** 표준이 아닌 주석 닫기를 쓰는 템플릿 엔진(ERB의 `%>`, Blade의 `--}}`)은 짝이 맞지 않는 자리 표시자를 만들 수 있습니다. `#`나 `//` 스타일 주석을 쓰세요.
- **폴백 확장은 점진적입니다.** 모델이 자리 표시자 형식을 바꾸면(예: 이유 문구를 바꾸면) 훅은 점점 단순한 일치를 시도합니다. 전체 자리 표시자, 이어서 접두사+해시+접미사, 이어서 해시만. 해시만 쓰는 폴백은 겉모습 찌꺼기(예: 남은 `:`나 이유 문구)를 남길 수 있습니다. 이때 stderr에 경고가 출력됩니다.
- **없어진 자리 표시자는 백업으로 되돌립니다.** 편집이 `BLOCK_<hash>` 줄을 지우거나 누군가 파일 전체를 바꾸면, 훅은 그 보호 블록이 어디에 들어가야 하는지 더 이상 알 수 없습니다. 이런 `Edit`나 `Write`는 복원할 자리 표시자와 함께 모델에 보고되고(종료 코드 2), 백업은 갱신되지 않습니다. `Stop` 시점에도 자리 표시자가 없으면 훅은 백업을 복원하고 경고를 출력합니다. 바뀐 파일은 `.claude/.simplify-ignore-cache/<id>.recovered`로 캐시에 남고, 경고가 그 경로를 출력합니다. 직접 다시 합치세요. 자리 표시자를 그대로 둔 변경(`Bash` 편집, 포매터, 외부 편집기)은 파일 안에 유지됩니다.
- **파일 이름을 바꾸면 자리 표시자가 남습니다.** 모델이 셸 명령으로 파일 이름을 바꾸거나 옮기면, 새 파일에 `BLOCK_<hash>` 자리 표시자가 남습니다. 세션이 멈추면 원래 코드는 `<old-filename>.recovered`로 저장됩니다. 복원된 코드를 새 파일에 직접 넣으세요.

## 요구 사항

- `jq`, `shasum` 또는 `sha1sum`(자동 감지), Bash 3.2+
