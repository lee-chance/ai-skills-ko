---
name: setup-pre-commit
description: "현재 저장소에 lint-staged(Prettier), 타입 체크, 테스트가 포함된 Husky pre-commit 훅을 설정합니다. 사용자가 pre-commit 훅을 추가하거나, Husky를 설정하거나, lint-staged를 구성하거나, 커밋 시점의 포매팅, 타입 체크, 테스트를 넣고 싶을 때 사용하세요."
---

# pre-commit 훅 설정

## 설정되는 것

- **Husky** pre-commit 훅
- 스테이징된 모든 파일에 Prettier를 실행하는 **lint-staged**
- **Prettier** 설정 (없을 때)
- pre-commit 훅 안의 **typecheck**와 **test** 스크립트

## 단계

### 1. 패키지 매니저 감지

`package-lock.json`(npm), `pnpm-lock.yaml`(pnpm), `yarn.lock`(yarn), `bun.lockb`(bun)가 있는지 확인하세요. 있는 것을 사용하세요. 불명확하면 npm을 기본으로 하세요.

### 2. 의존성 설치

devDependencies로 설치하세요:

```
husky lint-staged prettier
```

### 3. Husky 초기화

```bash
npx husky init
```

이렇게 하면 `.husky/` 디렉토리가 생기고, package.json에 `prepare: "husky"`가 추가됩니다.

### 4. `.husky/pre-commit` 만들기

다음 내용을 작성하세요 (Husky v9+에서는 shebang이 필요 없습니다):

```
npx lint-staged
npm run typecheck
npm run test
```

**맞추세요**: 감지한 패키지 매니저로 `npm`을 바꾸세요. package.json에 `typecheck` 또는 `test` 스크립트가 없으면 그 줄을 빼고 사용자에게 알리세요.

### 5. `.lintstagedrc` 만들기

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. `.prettierrc` 만들기 (없을 때)

Prettier 설정이 없을 때만 만드세요. 다음 기본값을 사용하세요:

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

### 7. 확인

- [ ] `.husky/pre-commit`이 있고 실행 가능합니다
- [ ] `.lintstagedrc`가 있습니다
- [ ] package.json의 `prepare` 스크립트가 `"husky"`입니다
- [ ] `prettier` 설정이 있습니다
- [ ] `npx lint-staged`를 실행하여 동작하는지 확인합니다

### 8. 커밋

변경되거나 생성된 파일을 모두 스테이징하고, 다음 메시지로 커밋하세요: `Add pre-commit hooks (husky + lint-staged + prettier)`

이렇게 하면 새 pre-commit 훅이 실행됩니다. 모든 것이 동작하는지 보는 좋은 스모크 테스트입니다.

## 참고

- Husky v9+에서는 훅 파일에 shebang이 필요 없습니다
- `prettier --ignore-unknown`은 Prettier가 파싱할 수 없는 파일(이미지 등)을 건너뜁니다
- pre-commit은 먼저 lint-staged를 실행하고(빠르고, 스테이징된 파일만 대상), 그다음 전체 타입 체크와 테스트를 실행합니다
