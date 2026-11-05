# sdd-cache 훅

[`source-driven-development`](../skills/source-driven-development/SKILL.md)를 위한 세션 간 인용 캐시입니다. 스킬이 약속하는 "현재 문서와 대조해 검증한다"는 보장을 유지한 채, 중복된 `WebFetch` 호출을 건너뜁니다.

## 왜 필요한가

`source-driven-development`는 프레임워크별 결정마다 공식 문서를 가져옵니다. 같은 프로젝트를 여러 세션에 걸쳐 작업하면 같은 페이지를 반복해서 가져오게 됩니다. 내용을 로컬 메모리로 캐시하면 스킬과 어긋납니다. 문서는 바뀌고, 낡은 캐시는 그 사실을 숨깁니다.

이 훅은 가져온 내용을 디스크에 캐시하되, 재사용할 때마다 HTTP `If-None-Match` / `If-Modified-Since`로 **오리진 서버에 다시 검증합니다**. 서버가 `304 Not Modified`로 응답할 때만 캐시에서 내용을 제공합니다. 메모리에서 꺼내는 일이 아니라, 매번 오리진이 확인해 준 검증입니다.

## 설정

1. `.claude/settings.json`에 훅을 추가하세요(개인용은 `.claude/settings.local.json`).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "WebFetch",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PROJECT_DIR}/hooks/sdd-cache-pre.sh\"",
            "timeout": 10
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "WebFetch",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PROJECT_DIR}/hooks/sdd-cache-post.sh\"",
            "async": true,
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

`${CLAUDE_PROJECT_DIR}`는 Claude Code를 실행한 디렉터리로 해석됩니다. 위 스니펫은 훅이 같은 프로젝트 안에 있을 때 동작합니다. `agent-skills`를 다른 곳(예: `~/agent-skills` 아래의 공유 플러그인)에 설치했다면 `${CLAUDE_PROJECT_DIR}/hooks/...`를 각 스크립트의 절대 경로로 바꾸세요.

2. `.claude/sdd-cache/`가 `.gitignore`에 있는지 확인하세요(이 저장소에는 이미 들어 있습니다).

3. 평소처럼 `/source-driven-development`(또는 이 스킬)를 사용하세요. 스킬이나 에이전트의 워크플로우는 바꾸지 않습니다. 캐시는 투명하게 동작합니다.

## 개념 모델

URL을 키로 하는 HTTP 리소스 캐시입니다. 신선도는 `ETag` / `Last-Modified`를 통해 오리진에 맡깁니다. TTL은 없고, 키에 프롬프트도 넣지 않습니다.

저장하는 본문은 원본 HTML이 아닙니다. `WebFetch`가 호출자의 프롬프트로 각 응답을 모델에 넘겨 후처리하므로, 캐시되는 것은 한 에이전트가 그 페이지를 읽고 정리한 결과입니다. 키는 URL만 유지해서 세션이 바뀌어도 읽기를 재사용합니다. 원래 프롬프트는 메타데이터로 보관하고 히트 메시지에 보여 주므로, 다음 에이전트가 이전 해석을 그대로 써도 되는지 판단할 수 있습니다.

## 동작 방식

URL당 캐시 항목 하나이며, `.claude/sdd-cache/<sha>.json`에 JSON으로 저장됩니다.

| 이벤트 | 동작 |
|---|---|
| `PreToolUse WebFetch` | 항목이 있으면 `If-None-Match` / `If-Modified-Since`를 담은 `HEAD` 요청을 보냅니다. `304`이면 가져오기를 막고, 원래 프롬프트를 메타데이터로 보여 주며 stderr로 캐시된 내용을 에이전트에 반환합니다. 그렇지 않으면 가져오기를 허용합니다. |
| `PostToolUse WebFetch` | 응답을 캡처하고, 현재 `ETag` / `Last-Modified`를 기록하려고 `HEAD` 요청을 보낸 뒤 `{url, prompt, etag, last_modified, content, fetched_at}`를 저장합니다. |

**신선도 규칙:**

- 오리진이 `304 Not Modified`를 확인해 줄 때만 항목을 제공합니다.
- `ETag`나 `Last-Modified` 헤더가 없는 항목은 캐시하지 않습니다. 검증자가 없으면 훅이 나중에 신선도를 확인할 수 없고, 캐시하는 것은 메모리를 믿는 일이 됩니다.
- 캐시 키는 `sha256(url)`입니다. 프롬프트가 달라도 같은 URL이면 같은 항목에 히트합니다. 캐시된 본문은 첫 가져오기에 쓰인 프롬프트를 반영하고, 그 프롬프트가 히트와 함께 보이므로 에이전트가 재사용할지 직접 다시 가져올지 결정할 수 있습니다.

**에이전트가 보는 것:**

- 캐시 히트: 종료 코드 2로 `WebFetch`가 차단됩니다. Claude Code는 훅의 stderr 페이로드를 도구 오류로 에이전트에 돌려줍니다. 이것은 캐시 히트를 알리려는 신호이며, 실패 신호가 아닙니다. 페이로드는 `[sdd-cache] Cache hit for <url>`로 시작하고, 캐시된 본문을 `----- BEGIN CACHED CONTENT -----`와 `----- END CACHED CONTENT -----` 마커 사이에 넣습니다. 에이전트는 `WebFetch`가 방금 반환한 내용처럼 사용할 수 있습니다.
- 캐시 미스이거나 내용이 낡았으면 `WebFetch`가 그대로 실행되고, 결과는 다음 번을 위해 저장됩니다.

스킬 자체는 그대로입니다. 계속 `DETECT → FETCH → IMPLEMENT → CITE`를 따릅니다. 훅은 `FETCH`가 실행될 때 내부에서 일어나는 일만 바꿉니다.

## 로컬 테스트

### 1. 스크립트를 직접 스모크 테스트

```bash
# Simulate a PostToolUse payload: cache a page
echo '{
  "tool_input": {
    "url": "https://react.dev/reference/react/useActionState",
    "prompt": "extract the signature"
  },
  "tool_response": "useActionState(action, initialState) returns [state, formAction, isPending]"
}' | bash hooks/sdd-cache-post.sh

# Inspect the stored entry
ls .claude/sdd-cache/
cat .claude/sdd-cache/*.json | jq .

# Simulate the next PreToolUse on the same URL + prompt
echo '{
  "tool_input": {
    "url": "https://react.dev/reference/react/useActionState",
    "prompt": "extract the signature"
  }
}' | bash hooks/sdd-cache-pre.sh
echo "exit=$?"
```

예상:

- 첫 명령은 `.claude/sdd-cache/` 아래에 파일 하나를 만듭니다(서버가 `ETag` 또는 `Last-Modified`를 돌려준 경우에만).
- 두 번째 명령은 오리진이 `304`로 응답하면 stderr에 캐시된 내용을 담아 `2`로 종료하고, 그 외에는 출력 없이 `0`으로 종료합니다.

### 2. 실제 세션에서 끝까지 확인

1. 위에 나온 대로 `.claude/settings.local.json`에 훅을 등록하세요.
2. 이 저장소에서 Claude Code 세션을 시작하세요.
3. 에이전트에게 문서 페이지를 가져오라고 요청하세요(예: "fetch `https://react.dev/reference/react/useActionState` and summarize", 즉 해당 URL을 가져와서 요약해 달라고 하세요).
4. `.claude/sdd-cache/` 아래에 파일이 생기는지 확인하세요.
5. 같은 프롬프트로 같은 페이지를 다시 가져오라고 에이전트에게 요청하세요.
6. 두 번째 `WebFetch`가 차단되고 캐시된 내용이 반환되는지 확인하세요(세션 기록에서 `[sdd-cache]` 접두사가 붙은 도구 오류로 보입니다).

### 3. 신선도 검증

문서가 바뀔 때 캐시가 무효화되는지 확인하려면 `ETag` 불일치를 강제하세요. 항목을 하나만 고르세요. 캐시에 파일이 둘 이상이면 `*.json`은 안전하지 않습니다.

```bash
# Pick the entry you want to corrupt (swap in the actual filename)
ENTRY=.claude/sdd-cache/e49c9f378670cfbb1d7d871b6dee16d9.json

# Patch its ETag to something the origin will not recognize
jq '.etag = "W/\"stale-etag-forced\""' "$ENTRY" > "$ENTRY.tmp" && mv "$ENTRY.tmp" "$ENTRY"

# Next PreToolUse should miss (server returns 200, not 304)
echo '{"tool_input":{"url":"...", "prompt":"..."}}' | bash hooks/sdd-cache-pre.sh
echo "exit=$?"   # expect 0 (fetch allowed through)
```

### 4. 디버깅

두 훅 모두 디버그 모드가 켜져 있으면 `.claude/sdd-cache/.debug.log`에 시각이 찍힌 이벤트를 기록합니다. 다음 중 하나로 켜세요.

```bash
# Option A: env var (per-session)
SDD_CACHE_DEBUG=1 claude

# Option B: sentinel file (persistent)
mkdir -p .claude/sdd-cache && touch .claude/sdd-cache/.debug
# …disable with: rm .claude/sdd-cache/.debug
```

로그에는 URL, 감지된 `tool_response` 형태, HEAD 상태, 각 호출이 히트하거나 미스한 이유가 남습니다. 캐시 미스가 예상 밖으로 보일 때 유용합니다. 대개 오리진이 검증자 헤더를 더 이상 보내지 않는 경우입니다.

## 알려진 제한

- **본문은 프롬프트에 맞춰져 있습니다.** 히트는 이전 에이전트가 페이지를 읽은 결과를 반환하고, 원래 프롬프트를 함께 보여 줍니다. 현재 에이전트가 그 해석을 써도 되는지 판단할 수 있습니다. 맞지 않으면 `.claude/sdd-cache/` 아래 파일을 지워 다시 가져오게 하세요.
- **캐시를 쓸 때마다 HEAD가 한 번 더 듭니다.** Claude Code는 `WebFetch`가 이미 받은 응답 헤더를 노출하지 않으므로, post 훅이 `ETag` / `Last-Modified`를 얻으려고 오리진에 다시 질의합니다. 미스마다 왕복이 한 번 더 듭니다. 코어를 바꾸지 않는 순수 훅으로 유지하는 대가입니다.
- **`ETag`나 `Last-Modified`가 없는 서버는 캐시되지 않습니다.** 대부분의 공식 문서 사이트(react.dev, docs.djangoproject.com, developer.mozilla.org)는 검증자를 보냅니다. 보내지 않는 사이트는 항상 다시 가져옵니다.
- **오동작하는 서버는 잘못된 `304`를 보낼 수 있습니다.** 진단해야 할 서버 버그입니다. 캐시가 막아야 할 불변 조건으로 보지 않으며, TTL로 가리지도 않습니다. 낡은 항목이 보이면 지우세요.
- **캐시는 로컬이고 프로젝트마다 따로입니다.** 팀 전체가 공유하는 캐시는 없습니다. 공유 캐시를 넣으려면 서명된 콘텐츠 주소 지정 저장 계층이 필요하며, 이 훅의 범위 밖입니다.

## 요구 사항

- `jq`
- `curl`
- `shasum` 또는 `sha256sum`(자동 감지)
- Bash 3.2+
