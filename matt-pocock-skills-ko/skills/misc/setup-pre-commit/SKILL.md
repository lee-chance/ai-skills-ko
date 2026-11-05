---
name: setup-pre-commit
description: "현재 저장소에 lint-staged(Prettier), 타입 체크, 테스트를 포함한 Husky pre-commit 훅을 설정합니다. 사용자가 pre-commit 훅을 추가하거나, Husky를 설정하거나, lint-staged를 구성하거나, 커밋 시 포매팅/타입 체킹/테스팅을 추가하고 싶을 때 사용하세요."
---

# Setup Pre-Commit Hooks

## 이것이 설정하는 것

- **Husky** pre-commit 훅
- 모든 스테이징된 파일에 Prettier를 실행하는 **lint-staged**
- **Prettier** 설정 (없는 경우)
- pre-commit 훅의 **typecheck** 및 **test** 스크립트

## 단계

### 1. 패키지 관리자 감지

`package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun)를 확인하세요. 존재하는 것을 사용하세요. 불확실하면 npm을 기본값으로 하세요.

### 2. 의존성 설치

devDependencies로 설치:

```
husky lint-staged prettier
```

### 3. Husky 초기화

```bash
npx husky init
```

이것은 `.husky/` 디렉토리를 생성하고 package.json에 `prepare: "husky"`를 추가합니다.

### 4. `.husky/pre-commit` 생성

이 파일을 작성하세요 (Husky v9+에는 shebang이 필요하지 않음):

```
npx lint-staged
npm run typecheck
npm run test
```

**적응**: `npm`을 감지된 패키지 관리자로 교체하세요. 저장소의 package.json에 `typecheck` 또는 `test` 스크립트가 없으면, 해당 줄을 생략하고 사용자에게 알리세요.

### 5. `.lintstagedrc` 생성

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. `.prettierrc` 생성 (없는 경우)

Prettier 설정이 존재하지 않을 때만 생성하세요. 다음 기본값을 사용하세요:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 검증

- [ ] `.husky/pre-commit`이 존재하고 실행 가능
- [ ] `.lintstagedrc`이 존재
- [ ] package.json의 `prepare` 스크립트가 `"husky"`
- [ ] `prettier` 설정이 존재
- [ ] `npx lint-staged`를 실행하여 작동하는지 확인

### 8. 커밋

모든 변경/생성된 파일을 스테이징하고 다음 메시지로 커밋: `Add pre-commit hooks (husky + lint-staged + prettier)`

이것은 새로운 pre-commit 훅을 통과합니다: 모든 것이 작동하는지 좋은 스모크 테스트입니다.

## 노트

- Husky v9+는 훅 파일에 shebang이 필요하지 않음
- `prettier --ignore-unknown`은 Prettier가 파싱할 수 없는 파일(이미지 등)을 건너뜀
- pre-commit은 lint-staged를 먼저(빠름, 스테이징 전용) 실행한 다음, 전체 typecheck와 테스트를 실행
