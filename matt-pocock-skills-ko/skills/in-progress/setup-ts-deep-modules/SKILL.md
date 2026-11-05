---
name: setup-ts-deep-modules
description: "TypeScript 저장소에 dependency-cruiser를 연결하여 각 패키지가 깊은 모듈이 되도록 하고, 구현은 하위 폴더에 숨겨지고 진입점 파일을 통해서만 접근 가능하도록 합니다. 사용자가 호출합니다."
disable-model-invocation: true
---

# Setup TS Deep Modules

이 저장소의 모든 패키지를 **깊은 모듈**로 만드세요: 작은 인터페이스 뒤에 많은 동작이 있습니다. 패키지의 공개 표면은 **진입점**(패키지 루트의 파일들)이며, 하위 폴더의 모든 것은 숨겨집니다. 이 스킬은 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)와 진입점을 유일한 방법으로 만드는 규칙을 설치한 다음, 규칙이 작동하는지 증명합니다.

어휘(깊은 모듈, 인터페이스, 심, 깊이)는 Skill 도구를 "codebase-design"으로 호출하고 전체적으로 그 언어를 사용하세요.

## 이것이 강제하는 형태

```
src/packages/
  <name>/
    index.ts        ← 진입점 (공개). 외부에서 이것을 import하세요.
    client.ts       ← 또 다른 진입점. 패키지는 여러 개를 노출할 수 있습니다.
    lib/            ← 구현: 외부에서 숨겨져 있으며, 서로 자유롭게 import 가능.
    tests/          ← 같은 위치의 테스트 + fixture (하위 폴더이므로 private).
```

공개 표면은 패키지의 **루트 파일들**이지, 지정된 하나의 `index.ts`가 아닙니다. 관례상 구현은 `lib/`에, 테스트는 `tests/`에 있어, 모든 패키지가 동일한 두 폴더 형태를 갖습니다. 그러나 규칙 자체는 일반적입니다: *모든* 하위 폴더의 *모든 것*이 private이므로, 폴더를 추가하기 위해 설정을 확장할 필요가 없습니다.

네 가지 규칙, 모두 `error`:

1. **진입점 경계**: 패키지 외부의 코드(앱 코드 또는 다른 패키지)는 해당 패키지의 진입점(루트 파일)만 import할 수 있으며, 하위 폴더의 무엇도 import할 수 없습니다.
2. **패키지 내 자유**: 패키지의 자체 파일들은 서로 자유롭게 import합니다.
3. **진입점을 통한 테스트**: `<pkg>/tests/` 아래의 파일은 모든 패키지의 진입점과 자체 `tests/` fixture를 import할 수 있지만, 어떤 패키지의 하위 폴더 내부도(자신의 것조차도) import할 수 없습니다. 패키지 간 통합 테스트는 괜찮습니다. 깊은 import는 안 됩니다.
4. **순환 없음**: 의존성 순환이 없습니다.

**진입점이지, barrel이 아닙니다.** 공개 표면이 *모든* 루트 파일이므로, 패키지는 모든 것을 하나의 거대한 `index.ts`로 통과시키는 대신 여러 개의 작은 진입점(`index.ts`, `client.ts`, `server.ts`)을 노출할 수 있습니다. 전체 하위 트리를 재내보내는 barrel 파일은 권장되지 않습니다. 진입점을 작게 유지하고 구현을 하위 폴더에 숨기세요.

레이어링(어떤 패키지가 어떤 것에 의존할 수 있는지)은 *다른* 관심사이며, 이 저장소가 채울 수 있도록 설정에 주석 처리된 스텁으로 남겨집니다.

## 단계

### 1. 환경 감지

- **패키지 관리자**: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, 그 외 npm. 아래의 모든 명령에 이것을 사용하세요(`pnpm`/`yarn`/`npm run`/`bunx`).
- **패키지 루트**: `src/`가 존재하면 `src/packages`를 사용하고, 그렇지 않으면 `packages`. 저장소가 이미 다른 명백한 관례를 가지고 있다면 사용자와 선택을 확인하세요.
- **기존 설정**: `.dependency-cruiser.*` 파일을 확인하세요. 존재한다면 덮어쓰지 **마세요**: 네 가지 규칙과 옵션을 병합하고, 추가한 것을 사용자에게 알리세요.

**완료 조건:** 패키지 관리자, 패키지 루트, 기존 설정 상태가 모두 알려졌을 때.

### 2. dependency-cruiser 설치

감지된 패키지 관리자로 `dependency-cruiser`를 devDependency로 설치하세요.

**완료 조건:** `dependency-cruiser`가 `devDependencies`에 있을 때.

### 3. 설정 작성

[`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs)를 저장소 루트에 `.dependency-cruiser.cjs`로 복사하세요. `PACKAGES_ROOT`를 1단계에서 감지된 루트로 설정하세요. 규칙은 경로 깊이 기반이고 확장자와 무관하므로, 다른 것을 조정할 필요가 없습니다.

**완료 조건:** `.dependency-cruiser.cjs`가 올바른 `PACKAGES_ROOT`와 함께 존재하고, 네 가지 금지 규칙이 있을 때.

### 4. 체크에 연결

- `lint:boundaries` 스크립트 추가: `depcruise <packages-root>` (또는 `depcruise src`).
- 이미 typecheck를 실행하는 저장소의 umbrella 체크 명령(예: `check` / `ci` / `validate` 스크립트)에 이를 통합하세요. `tsconfig`를 건드리거나 경로 별칭을 추가하지 **마세요**.
- umbrella 스크립트가 없다면, `lint:boundaries`를 추가하고 사용자에게 CI에 포함하도록 알리세요.

**완료 조건:** `lint:boundaries`가 존재하고 typecheck와 동일한 명령의 일부로 실행될 때.

### 5. 예제 패키지 스캐폴드

커밋된 `<packages-root>/example/`을 copy-me 템플릿으로 생성하세요:

- `index.ts`는 진입점입니다. 내부 파일에 위임하는 함수를 하나 내보내세요(패키지가 눈에 띄게 *깊고*, 통과가 아니도록).
- `lib/impl.ts`: **하위 폴더**의 내부 파일, `index.ts`에서 import하며, 외부에서 접근 불가능.
- `tests/example.test.ts`는 **오직** `../index`(진입점)만 import하고 공개 함수에 대해 assert합니다.

이것이 복사하거나 삭제할 시작 템플릿임을 사용자에게 알리세요.

**완료 조건:** 예제 패키지가 존재하고, 루트 진입점을 통해 동작을 노출하며, `impl`을 하위 폴더에 숨길 때.

### 6. 규칙이 작동하는지 증명

이것은 전체 스킬의 완료 기준입니다: 위반 시 실패하지 않는 설정은 무가치합니다.

1. `lint:boundaries`를 실행하세요. 깨끗한 예제에서 **통과**해야 합니다.
2. `tests/example.test.ts`에 일시적으로 깊은 import를 추가하세요(예: `import { thing } from "../lib/impl"`). `lint:boundaries`를 다시 실행하세요. `tests-through-entrypoints`로 **실패**해야 합니다.
3. 깊은 import를 되돌리세요. 한 번 더 실행하면, **통과**해야 합니다.

**완료 조건:** 통과를 관찰한 다음, 깊은 import에서 실패, 그 다음 다시 통과를 관찰했을 때. 2단계가 실패하지 않으면, 규칙이 올바르게 연결되지 않은 것이므로, 끝내기 전에 수정하세요.

### 7. 관례 문서화

**패키지 폴더 안에** `README.md`를 작성하세요(`<packages-root>/README.md`, 관리하는 패키지 옆에). 다음을 포함하세요: `src/packages/<name>/` 레이아웃(루트의 진입점, 구현을 위한 `lib/`, 테스트를 위한 `tests/`), "패키지의 진입점(루트 파일)을 통해서만 import", `lint:boundaries` 실행 방법. **barrel 파일을 명시적으로 권장하지 마세요**: 하나의 인덱스를 통해 전체 하위 트리를 재내보내는 대신 여러 개의 작은 진입점을 노출하세요. copy-me 스니펫과 각 한 단락의 네 가지 규칙으로 유지하세요.

그런 다음 저장소의 agent-instructions 파일(`CLAUDE.md`가 있으면, 그렇지 않으면 `AGENTS.md`, 둘 다 없으면 `AGENTS.md` 생성)에서 이에 대한 **컨텍스트 포인터**를 추가하세요. 한 줄이면 충분합니다. 예: `Packages are deep modules: see [src/packages/README.md](./src/packages/README.md) before adding or importing one.` 이것은 에이전트가 경계 규칙을 걸려 넘어지는 대신 발견하도록 만듭니다.

**완료 조건:** `<packages-root>/README.md`가 존재하고 barrel을 권장하지 않으며, 저장소의 `CLAUDE.md`/`AGENTS.md`가 이를 링크할 때.

## 노트

- 설정의 `$1` 역참조(dependency-cruiser의 그룹 매칭)는 패키지가 자체 내부에 도달할 수 있게 하면서 외부인은 할 수 없게 합니다. 이를 패키지별 별도 규칙으로 평탄화하지 마세요.
- 공개 대 private는 **깊이**로 결정됩니다: 패키지의 루트 파일은 진입점이고, 하위 폴더의 무엇이든 private입니다. 관례적인 하위 폴더는 `lib/`(구현)와 `tests/`이지만, 규칙은 이를 하드코딩하지 않습니다: 모든 하위 폴더가 private이므로, 새 폴더가 설정 변경을 필요로 하지 않습니다. 진입점 추가는 단지 루트 파일을 추가하는 것입니다(barrel 없음).
- 패키지는 **평평합니다**: 루트 아래 직계 자식의 한 계층. 패키지의 내부는 원하는 만큼 깊게 중첩될 수 있지만, 패키지는 다른 패키지를 포함할 수 없습니다.
- `"type": "module"` 저장소에서도 설정의 `module.exports`가 작동하도록 `.cjs`(`.js`가 아님)를 사용하세요.
