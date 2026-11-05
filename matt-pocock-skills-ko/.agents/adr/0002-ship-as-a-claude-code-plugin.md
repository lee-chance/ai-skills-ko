# 네이티브 Claude Code 플러그인으로 스킬 세트 제공; 네이티브 Codex 플러그인 연기

이 스킬들은 항상 [skills.sh](https://skills.sh/mattpocock/skills) (`npx skills add mattpocock/skills`)를 통해 설치 가능했습니다. 이것은 편집 가능한 스킬 파일을 Claude Code, Codex 및 다른 Agent-Skills-표준 하네스에 걸쳐 사용자 프로젝트에 복사합니다. 반복되는 요청은 **플러그 앤 플레이** 배포입니다: 여러분이 소유한 포크가 아니라 편집하지 않는 읽기 전용, 항상 최신 번들로 세트를 구독하는 것입니다. 그것이 정확히 네이티브 플러그인 시스템이 제공하는 것입니다.

우리는 네이티브 **Claude Code 플러그인**을 제공하고, 당분간 네이티브 **Codex 플러그인**을 **연기**합니다. 분할은 각 생태계의 플러그인 매니페스트가 이 저장소의 버킷화된 레이아웃에 대해 스킬을 선택하는 방식에 의해 강제됩니다.

## 제약: 버킷화된 스킬 vs. 단일 경로 선택

스킬은 `skills/` 아래의 버킷 폴더에 있습니다: `engineering/`과 `productivity/`는 **홍보됨**(제공됨); `misc/`, `personal/`, `in-progress/`, `deprecated/`는 **그렇지 않음**. 플러그인은 홍보된 세트만 노출해야 하며, 이는 두 개의 버킷 폴더에 걸쳐 있습니다.

- **Claude Code**: `.claude-plugin/plugin.json`은 `skills`를 **명시적 스킬 디렉토리 경로 배열**로 받아들입니다. 우리는 홍보된 스킬을 하나씩 나열하고, 모호함 없이 나머지를 모두 제외하며, `.claude-plugin/marketplace.json`을 추가하여 저장소가 자체 단일 플러그인 마켓플레이스가 되도록 합니다. 엔드 투 엔드 검증됨: `claude plugin validate . --strict`가 통과하고, `marketplace add` → `install`이 모든 홍보된 스킬을 해결합니다.

- **Codex**: `.codex-plugin/plugin.json`은 `skills`를 **단일 경로 문자열**로만 받아들입니다(배열은 `missing or invalid plugin.json`으로 거부됨), Codex는 그 아래에서 `SKILL.md` 파일을 재귀적으로 발견합니다. 한 경로에서 두 버킷 폴더를 명명하거나 하위 집합을 큐레이션할 방법이 없습니다. 두 탈출구가 테스트되고 거부되었습니다:
  - `./skills/`를 가리키면 `deprecated/`, `in-progress/`, `personal/`, `misc/`도 함께 제공됩니다: 의도적으로 홍보하지 않는 은퇴, 초안, 개인 스킬입니다.
  - 버킷으로의 **심볼릭 링크**의 큐레이션된 플랫 디렉토리는 설치에서 살아남지 못합니다: Codex는 플러그인 트리를 캐시에 복사하고 **심볼릭 링크를 삭제**하므로 스킬이 비어 도착합니다.

Codex에게 단일 홍보 전용 경로를 제공하는 유일한 견고한 방법은 (a) `skills/`가 홍보된 스킬만 포함하도록 **재구조화**(홍보되지 않은 버킷을 밖으로 이동, `CLAUDE.md`, `scripts/link-skills.sh`, 버킷 README, `in-progress/`와 `personal/`에 의존하는 로컬 개발 워크플로우에 걸친 큰 폭발 반경), 또는 (b) 홍보된 스킬의 **중복 사본을 커밋**하여 플랫 디렉토리에 (동기화 부담과 두 번째 진실의 원천). 둘 다 구조적 결정이며, Claude 플러그인 제공에 번들로 제공할 것이 아닙니다. 이것은 아마도 플러그인이 더 일찍 제공되지 않은 원래의, 반쯤 기억된 이유일 것입니다: 매니페스트 형식이 버킷화된 저장소의 큐레이션된 하위 집합을 깨끗하게 표현하지 못했습니다.

## 결정

- 헤드라인 v1.2 제공물로, 홍보된 세트로 큐레이션된 **Claude Code 플러그인**을 지금 제공합니다(`.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`).
- **skills.sh**를 범용 설치 프로그램으로 유지합니다: 오늘날 이미 Codex와 다른 하네스를 제공하므로, Codex 사용자는 설치 경로 없이 남겨지지 않습니다.
- `skills/`를 홍보 전용으로 재구조화 vs. 생성된 플랫 사본 커밋 사이에서 결정할 때까지 네이티브 Codex 플러그인을 **연기**합니다. Codex가 `skills` 배열 / 포함 목록을 지원하거나 설치 시 심볼릭 링크를 보존할 때 재검토합니다.

## 이것이 만드는 불변성

- 모든 홍보된 스킬은 `.claude-plugin/plugin.json`의 `skills` 배열에 항목이 있습니다(이것은 이미 `CLAUDE.md` 규칙으로 서 있었습니다. 이제 플러그인의 콘텐츠도 게이트합니다).
- `.claude-plugin/plugin.json`의 `version`은 `package.json`의 버전을 추적합니다: 릴리스 시 둘 다 함께 범프합니다. Claude는 플러그인 `version`을 사용하여 설치된 사용자가 업데이트를 볼 때를 결정합니다.

## 업데이트, 2026-08-05

`mattpocock-skills`는 **Claude Code의 공식 마켓플레이스**(구성된 이름 `claude-plugins-official`, 소스 저장소 `anthropics/claude-plugins-official`)에 승인되었으며, 모든 Claude Code 설치가 기본적으로 가지고 있습니다. `claude plugins install mattpocock-skills`가 이제 문서화된 경로이며, 위의 `marketplace add` → `install` 경로는 대체되었습니다. 설치 문구는 [.agents/install-block.md](../install-block.md)에 있습니다.

공식 목록은 이 저장소의 git URL을 가리키고 `.claude-plugin/plugin.json`을 직접 읽으므로 `.claude-plugin/marketplace.json`에 의존하지 않습니다. 해당 파일은 저장소를 직접 설치하는 것의 대체로만 보존됩니다(릴리스되지 않은 커밋 또는 포크).

Claude Code 2.1.222에서, 라이브 목록에 대해 2026-08-05에 검증됨:

- `claude plugins install mattpocock-skills`는 먼저 추가된 마켓플레이스 없이 해결되며, `mattpocock-skills@claude-plugins-official`을 보고합니다.
- `claude plugin details mattpocock-skills`는 그런 다음 버전 1.2.0을 보고하고 홍보된 스킬을 로드합니다.
- 목록의 `source`는 `{"source": "url", "url": "https://github.com/mattpocock/skills.git", "sha": …}`: **sha가 고정됨**이므로, 릴리스는 우리가 태그하는 순간이 아니라 해당 핀이 이동할 때 설치된 사용자에게 도달합니다. 작성 시점에 핀은 `main` 뒤에 두 커밋 있으며, 이것이 `plugin.json`의 24개가 아니라 22개 스킬을 나열하는 이유입니다.
- 세션 내 `/plugin install mattpocock-skills`는 **실행되지 않았습니다**: `/plugin`은 헤드리스(`claude -p`) 세션에서 사용할 수 없습니다. CLI와 동일한 해결기를 실행하며, 문서화된 예제 형식은 `/plugin install <name>@claude-plugins-official`입니다.

## 업데이트, 2026-10-07

위의 Codex 제약은 더 이상 유지되지 않습니다. Codex `main`은 `skills` 문자열 배열을 받아들이고 `.codex-plugin/`이 없을 때 `.claude-plugin/`으로 대체합니다([manifest.rs](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/manifest.rs)). Codex는 여전히 심볼릭 링크를 삭제합니다.

Codex 0.161.0에서, `@mattpocock` 마켓플레이스 설치는 홍보된 모델 호출 스킬을 로드하고 `misc/` 또는 `in-progress/`에서 아무것도 로드하지 않습니다. Copilot CLI는 동일한 매니페스트를 읽고 "Installed 27 skills"를 보고합니다.

## 업데이트, 2026-10-08: 관리 설치 우선

`@mattpocock`은 이제 Codex, Copilot 및 VS Code의 리드 경로이며, Copilot에서 한 번의 옵트인 비용이 듭니다. Claude Code는 2026-08-05 업데이트에서와 같이 `claude-plugins-official`에 머물며, 기본적으로 자동 업데이트되므로 `marketplace add`가 필요하지 않습니다.

위의 버전 불변성은 이제 모든 관리 경로에 적용됩니다. `npm run version`은 이미 `scripts/sync-plugin-version.mjs`를 실행하여 이것을 유지합니다. `marketplace.json`에는 `version` 필드가 없으므로 표류할 수 없습니다.
