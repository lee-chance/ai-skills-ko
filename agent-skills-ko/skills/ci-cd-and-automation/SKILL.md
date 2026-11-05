---
name: ci-cd-and-automation
description: CI/CD 파이프라인 설정을 자동화합니다. 빌드와 배포 파이프라인을 설정하거나 수정할 때 사용하세요. 품질 게이트를 자동화해야 할 때, CI에서 테스트 러너를 구성할 때, 배포 전략을 세울 때 사용하세요.
---

# CI/CD and Automation

## 개요

품질 게이트를 자동화해서, 테스트, 린트, 타입 체크, 빌드를 통과하지 않은 변경은 프로덕션에 도달하지 못하게 하세요. CI/CD는 다른 모든 스킬의 강제 장치입니다. 사람과 에이전트가 놓친 것을 잡고, 모든 변경에 대해 일관되게 그렇게 합니다.

**시프트 레프트 (Shift Left):** 파이프라인에서 가능한 한 일찍 문제를 잡으세요. 린트에서 잡힌 버그는 몇 분이면 끝나지만, 같은 버그가 프로덕션에서 잡히면 몇 시간이 듭니다. 검사를 업스트림으로 옮기세요. 테스트 전에 정적 분석, 스테이징 전에 테스트, 프로덕션 전에 스테이징입니다.

**빠를수록 안전합니다 (Faster is Safer):** 더 작은 배치와 더 잦은 릴리스는 위험을 키우지 않고 줄입니다. 변경 3개인 배포는 변경 30개인 배포보다 디버깅하기 쉽습니다. 잦은 릴리스는 릴리스 과정 자체에 대한 확신을 쌓습니다.

## 언제 사용하나

- 새 프로젝트의 CI 파이프라인을 설정할 때
- 자동 검사를 추가하거나 수정할 때
- 배포 파이프라인을 구성할 때
- 변경이 자동 검증을 트리거해야 할 때
- CI 실패를 디버깅할 때

## 품질 게이트 파이프라인

모든 변경은 머지 전에 이 게이트를 통과합니다.

```
풀 리퀘스트가 열림
    │
    ▼
┌─────────────────┐
│   LINT CHECK     │  eslint, prettier
│   ↓ pass         │
│   TYPE CHECK     │  tsc --noEmit
│   ↓ pass         │
│   UNIT TESTS     │  jest/vitest
│   ↓ pass         │
│   BUILD          │  npm run build
│   ↓ pass         │
│   INTEGRATION    │  API/DB tests
│   ↓ pass         │
│   E2E (optional) │  Playwright/Cypress
│   ↓ pass         │
│   SECURITY AUDIT │  npm audit
│   ↓ pass         │
│   BUNDLE SIZE    │  bundlesize check
└─────────────────┘
    │
    ▼
  리뷰 준비 완료
```

**어떤 게이트도 건너뛸 수 없습니다.** 린트가 실패하면 린트를 고치세요. 규칙을 끄지 마세요. 테스트가 실패하면 코드를 고치세요. 테스트를 건너뛰지 마세요.

## GitHub Actions 구성

### 기본 CI 파이프라인

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=high
```

### 데이터베이스 통합 테스트

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: ci_user
          POSTGRES_PASSWORD: ${{ secrets.CI_DB_PASSWORD }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
```

> **참고:** CI 전용 테스트 데이터베이스라도 값을 하드코딩하지 말고 GitHub Secrets로 자격 증명을 두세요. 좋은 습관이 되고, 테스트 자격 증명을 다른 맥락에서 실수로 재사용하는 일을 막습니다.

### E2E 테스트

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## CI 실패를 에이전트에게 되돌리기

AI 에이전트와 함께하는 CI의 힘은 피드백 루프입니다. CI가 실패하면:

```
CI 실패
    │
    ▼
실패 출력을 복사
    │
    ▼
에이전트에게 전달:
"CI 파이프라인이 다음 오류로 실패했습니다:
[구체적인 오류를 붙여 넣으세요]
문제를 고치고, 다시 푸시하기 전에 로컬에서 검증하세요."
    │
    ▼
에이전트가 수정 → 푸시 → CI가 다시 실행
```

**핵심 패턴:**

```
린트 실패 → 에이전트가 `npm run lint -- --fix`를 실행하고 커밋
타입 오류  → 에이전트가 오류 위치를 읽고 타입을 수정
테스트 실패 → 에이전트가 debugging-and-error-recovery 스킬을 따름
빌드 오류 → 에이전트가 설정과 의존성을 확인
```

## 배포 전략

### 프리뷰 배포

모든 풀 리퀘스트는 수동 테스트용 프리뷰 배포를 받습니다.

```yaml
# Deploy preview on PR (Vercel/Netlify/etc.)
deploy-preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  steps:
    - uses: actions/checkout@v4
    - name: Deploy preview
      run: npx vercel --token=${{ secrets.VERCEL_TOKEN }}
```

### 피처 플래그

피처 플래그는 배포와 릴리스를 분리합니다. 미완성이거나 위험한 기능을 플래그 뒤에 배포하면 다음이 가능합니다.

- **켜지 않은 채로 코드를 출시합니다.** main에 일찍 머지하고, 준비되면 켭니다.
- **재배포 없이 롤백합니다.** 코드를 되돌리는 대신 플래그를 끕니다.
- **새 기능을 카나리로 내보냅니다.** 사용자의 1%에게 켠 다음 10%, 그다음 100%로 넓힙니다.
- **A/B 테스트를 돌립니다.** 기능이 있을 때와 없을 때의 동작을 비교합니다.

```typescript
// Simple feature flag pattern
if (featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return renderNewCheckout();
}
return renderLegacyCheckout();
```

**플래그 수명 주기:** 생성 → 테스트용 활성화 → 카나리 → 전체 롤아웃 → 플래그와 죽은 코드 제거. 영원히 남는 플래그는 기술 부채가 됩니다. 만들 때 정리 날짜를 정하세요.

### 단계적 롤아웃

```
main에 풀 리퀘스트 머지
    │
    ▼
  스테이징 배포 (자동)
    │ 수동 검증
    ▼
  프로덕션 배포 (수동 트리거, 또는 스테이징 후 자동)
    │
    ▼
  오류 모니터링 (15분 구간)
    │
    ├── 오류 감지 → 롤백
    └── 깨끗함 → 완료
```

### 롤백 계획

모든 배포는 되돌릴 수 있어야 합니다.

```yaml
# Manual rollback workflow
name: Rollback
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback deployment
        env:
          VERSION: ${{ inputs.version }}
        run: |
          # Deploy the specified previous version. Pass the input through env,
          # never interpolate it into the script (shell injection).
          npx vercel rollback "$VERSION"
```

## 환경 관리

```
.env.example       → 커밋됨 (개발자용 템플릿)
.env                → 커밋하지 않음 (로컬 개발)
.env.test           → 커밋됨 (테스트 환경, 실제 시크릿 없음)
CI 시크릿           → GitHub Secrets / 볼트에 저장
프로덕션 시크릿     → 배포 플랫폼 / 볼트에 저장
```

CI에는 프로덕션 시크릿이 있으면 안 됩니다. CI 테스트에는 별도의 시크릿을 쓰세요.

## CI를 넘는 자동화

### Dependabot / Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
```

### 빌드 담당 (Build Cop)

CI를 녹색으로 유지할 담당자를 지정하세요. 빌드가 깨지면 고치거나 되돌리는 일은 빌드 담당의 역할입니다. 그 변경을 넣은 사람의 역할이 아닙니다. 모두가 다른 누군가가 고칠 것이라고 생각하는 동안 깨진 빌드가 쌓이는 일을 막습니다.

### 풀 리퀘스트 검사

- **필수 리뷰:** 머지 전 최소 1명의 승인
- **필수 상태 검사:** 머지 전에 CI가 통과해야 함
- **브랜치 보호:** main에 force-push 금지
- **자동 머지:** 모든 검사가 통과하고 승인되면 자동으로 머지

## CI 최적화

파이프라인이 10분을 넘으면, 영향이 큰 순서대로 이 전략을 적용하세요.

```
CI 파이프라인이 느리다면?
├── 의존성 캐시
│   └── 패키지 매니저 캐시에는 setup-node의 cache 옵션(또는 actions/cache)을 쓰세요. node_modules는 캐시하지 마세요
├── 잡을 병렬로 실행
│   └── 린트, 타입 체크, 테스트, 빌드를 별도의 병렬 잡으로 나누세요
├── 변경된 것만 실행
│   └── 경로 필터로 관련 없는 잡을 건너뛰세요 (예: 문서만 바꾼 풀 리퀘스트에서는 e2e를 건너뜀)
├── 매트릭스 빌드 사용
│   └── 테스트 스위트를 여러 러너에 나눠 실행
├── 테스트 스위트 최적화
│   └── 느린 테스트를 핵심 경로에서 빼고, 대신 스케줄로 실행
└── 더 큰 러너 사용
    └── CPU를 많이 쓰는 빌드에는 GitHub 호스팅 대형 러너 또는 자체 호스팅
```

**예시: 캐시와 병렬성**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage
```

## 흔한 합리화

| 합리화 | 현실 |
|---|---|
| "CI가 너무 느립니다" | 파이프라인을 최적화하세요 (CI 최적화 참고). 건너뛰지 마세요. 5분짜리 파이프라인이 몇 시간의 디버깅을 막습니다. |
| "이 변경은 사소하니 CI를 건너뛰겠습니다" | 사소한 변경도 빌드를 깨뜨립니다. 사소한 변경이라면 CI도 어차피 빠릅니다. |
| "테스트가 불안정하니 다시 실행만 하겠습니다" | 불안정한 테스트는 실제 버그를 가리고 모두의 시간을 낭비합니다. 불안정함을 고치세요. |
| "CI는 나중에 넣겠습니다" | CI가 없는 프로젝트는 깨진 상태가 쌓입니다. 첫날부터 설정하세요. |
| "수동 테스트로 충분합니다" | 수동 테스트는 확장되지 않고 반복할 수 없습니다. 자동화할 수 있는 것은 자동화하세요. |

## 레드 플래그

- 프로젝트에 CI 파이프라인이 없음
- CI 실패를 무시하거나 잠재움
- 파이프라인을 통과시키려고 CI에서 테스트를 끔
- 스테이징 검증 없이 프로덕션 배포
- 롤백 수단이 없음
- 시크릿이 코드나 CI 설정 파일에 있음 (시크릿 관리자가 아님)
- CI 시간이 긴데 최적화 노력이 없음

## 검증

CI를 설정하거나 수정한 뒤:

- [ ] 모든 품질 게이트가 있습니다 (린트, 타입, 테스트, 빌드, 감사)
- [ ] 모든 풀 리퀘스트와 main 푸시에서 파이프라인이 실행됩니다
- [ ] 실패가 머지를 막습니다 (브랜치 보호가 구성됨)
- [ ] CI 결과가 개발 루프로 되돌아옵니다
- [ ] 시크릿이 코드가 아니라 시크릿 관리자에 있습니다
- [ ] 배포에 롤백 수단이 있습니다
- [ ] 테스트 스위트 기준 파이프라인이 10분 안에 끝납니다
