---
name: reflect
description: 활성 트랜스크립트에 대해 세 개의 병렬 리뷰 서브에이전트를 생성하고, 학습을 표면화하고, 각각을 기존 스킬에 대한 구체적인 편집으로 라우팅하세요. 사용자가 reflect라고 말할 때 사용하세요.
disable-model-invocation: true
---

# Reflect

현재 대화에서 내구성 있는 학습을 마이닝한 다음 스킬 편집으로 라우팅하세요.

사용자가 "reflect" 또는 "/reflect"라고 말할 때 호출하세요. 대화가 사소하거나, 주제에서 벗어나거나, 부모가 올바르게 따른 기존 스킬에 의해 이미 커버될 때는 건너뛰세요. 일회성은 학습이 아닙니다.

## 1. 활성 트랜스크립트 찾기

팬 아웃하기 전에 시스템 프롬프트가 명명하는 `agent-transcripts/` 디렉토리에서 이 대화의 트랜스크립트를 찾으세요. `~/.cursor/projects/*/` 전체에 glob하지 마세요. 그것은 워크스페이스 경계를 넘고 관련 없는 프로젝트에서 비공개 채팅을 읽습니다.

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

그것은 레거시 플랫 (`<id>.jsonl`), 현재 중첩 (`<id>/<id>.jsonl`), 그리고 서브에이전트 (`<parent>/subagents/<child>.jsonl`) 레이아웃을 커버합니다. 각 후보에 대해 첫 번째 JSONL 라인을 읽으세요. `message.content[0].text`가 대화의 시작 사용자 프롬프트를 포함하는 파일을 취하세요. 일치하는 것이 없으면 대신 세션의 간결한 요약을 전달하세요.

## 2. 세 명의 리뷰어를 병렬로 생성

하나의 메시지, 세 개의 `Task` 호출, `subagent_type: generalPurpose`, 에이전트 모드 (`readonly: false`). 리뷰어는 트랜스크립트가 참조하는 티켓, 채팅 스레드 및 관찰 가능성 추적을 조회하기 위해 MCP 접근이 필요하며, readonly는 MCP를 제거합니다.

각 리뷰어와 합성기는 `pstack-models.mdc` 규칙의 역할 라인과 기본값을 명명합니다. `model`을 해당 라인의 값으로 설정하거나, 규칙이나 라인이 없으면 기본값으로 설정하세요. 값이 `auto` 또는 `inherit-parent`일 때 `model`을 설정하지 않은 채로 두세요. Task 도구가 슬러그를 거부하면 기본값을 사용하고 그렇게 말하세요. 기본값을 거부하면 오류 메시지에서 동일한 패밀리의 가장 가까운 유효한 슬러그를 사용하세요. **poteto-mode** 스킬의 Subagents 섹션에 따라 작업에 대한 각 서브에이전트의 추론 수준과 빠른 또는 표준 속도를 선택하세요.

| 렌즈 | 역할 라인 | 기본 `model` | 프롬프트 템플릿 |
|---|---|---|---|
| Judgment | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| Tooling | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| Divergent | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

각 템플릿을 표시된 곳에서 트랜스크립트 경로 또는 요약을 대체하여 그대로 전달하세요. 리뷰어는 `Task` 응답 본문에서 발견 사항을 반환합니다.

## 3. 합성

하나의 `Task` 호출, `subagent_type: generalPurpose`, `reflect judgment, divergent, synthesizer` 라인의 `model` (기본값 `claude-opus-5-5-xhigh`), 에이전트 모드 (`readonly: false`). MCP를 통해 인용을 스팟 검증하며, readonly는 MCP를 제거합니다. `references/synthesizer.md`를 표시된 곳에서 각 리뷰어의 전체 출력이 인라인된 채로 그대로 전달하세요. Accepted / Rejected / Backlog 목록을 반환합니다.

## 4. 구조적 강제 확인

린트 규칙, 스크립트, 메타데이터 플래그 또는 런타임 검사가 더 안정적으로 강제할 모든 Accepted 항목을 Backlog로 이동하세요. **encode-lessons-in-structure** 원칙 스킬을 참조하세요.

## 5. 적용

합성기의 전체 Accepted / Rejected / Backlog 출력을 제시하고 Accepted 편집을 적용하기 전에 명시적 승인을 기다리세요. 사용자가 하위 집합을 선택하고 라우팅을 리디렉션할 수 있습니다. 스킬 변경은 조직의 모든 미래 에이전트에 영향을 미칩니다. 자동 적용하지 마세요.

승인을 기다리지 않고 각 Backlog 항목을 팀의 devex 또는 backlog 트래커에 파일하세요. Accepted 목록만 승인을 기다립니다.

`plugins/cache/` 아래의 스킬을 절대 편집하지 마세요. 승인 전에 대상 `.cursor/skills/<skill>/` 또는 `~/.cursor/skills/<skill>/`를 보여주세요. 승인 후 스킬 폴더를 거기에 복사하고 사본을 편집하세요. PR을 열거나 푸시하지 마세요.

각 승인된 행의 Routing을 정확히 따르세요:

- 사소한 기존 스킬 편집 (한 줄 글머리 기호, 조이는 문장, 수정된 오래된 사실): 부모가 직접 수행합니다.
- 실질적인 기존 스킬 편집 (새 섹션, 새 패턴 테이블, ~10줄 이상): Cursor의 내장 `create-skill` 스킬에 넘기고 draft / test / iterate 루프를 실행하세요.
- `tune description: <skill path>` (스킬이 존재하지만 해야 할 때 트리거되지 않음): `create-skill`에 넘기고 설명 최적화 루프를 실행하세요.
- `new skill via create-skill: <kebab-name>`: 생성을 `create-skill`에 넘기세요. 애드혹으로 형태를 발명하지 마세요.

환경이 SKILL.md 검증기를 배송하면 완료를 선언하기 전에 터치된 모든 스킬에 대해 실행하세요.

## 6. 사용자에게 요약

짧은 목록, 서문 없음:

- 적용된 편집: `<skill path>`. 변경된 것, 각각 한 줄.
- 생성된 새 스킬: `<skill path>`. 각각 한 줄 (드물게).
- devex 트래커에 파일된 Backlog: `<issue title>` (`<tags>`). 각각 한 줄.
- 삭제됨: 합성기의 거부된 발견 사항 + 이유당 한 줄.
