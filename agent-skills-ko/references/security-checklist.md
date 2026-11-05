# 보안 체크리스트

웹 애플리케이션 보안을 위한 빠른 참조입니다. `security-and-hardening` 스킬과 함께 사용하세요.

## 목차

- [위협 모델링 (여기서 시작)](#위협-모델링-여기서-시작)
- [커밋 전 확인](#커밋-전-확인)
- [인증](#인증)
- [인가](#인가)
- [입력 검증](#입력-검증)
- [보안 헤더](#보안-헤더)
- [CORS 구성](#cors-구성)
- [데이터 보호](#데이터-보호)
- [의존성 보안](#의존성-보안)
- [AI / LLM 보안](#ai--llm-보안)
- [오류 처리](#오류-처리)
- [OWASP Top 10 빠른 참조](#owasp-top-10-빠른-참조)
- [LLM용 OWASP Top 10 빠른 참조](#llm용-owasp-top-10-빠른-참조)

## 위협 모델링 (여기서 시작)

컨트롤부터 집기 전에, 5분은 공격자처럼 생각하세요.

- [ ] 신뢰 경계를 그리세요 (요청, 업로드, 웹훅, 서드파티 API, LLM 출력, 그리고 여러분이 통제하지 않는 프로세스가 쓴 로컬 값)
- [ ] 자산의 이름을 적으세요 (자격 증명, PII, 결제 데이터, 관리자 동작, 자금 이동)
- [ ] 경계마다 STRIDE를 수행하세요 (Spoofing 위장, Tampering 변조, Repudiation 부인, Info disclosure 정보 노출, DoS, Elevation 권한 상승)
- [ ] 유스 케이스 옆에 남용 케이스를 적으세요 ("how would I misuse this?", 이것을 어떻게 악용할까?)

## 커밋 전 확인

- [ ] 코드에 시크릿이 없습니다 (`git diff --cached -i -G'password|secret|api_key|token' --name-only`. 스테이징된 diff가 일치하는 파일의 이름만 나열하고, 값 자체는 절대 나오지 않습니다. 출력이 있으면 커밋하기 전에 그 파일을 리뷰하세요)
- [ ] `.gitignore`가 다음을 포함합니다: `.env`, `.env.local`, `*.pem`, `*.key`
- [ ] `.env.example`은 자리 표시자 값을 사용합니다 (실제 시크릿이 아닙니다)

## 인증

- [ ] 비밀번호는 bcrypt(12라운드 이상), scrypt, 또는 argon2로 해시합니다
- [ ] 세션 쿠키: `httpOnly`, `secure`, `sameSite: 'lax'`
- [ ] 세션 만료가 구성되어 있습니다 (합리적인 max-age)
- [ ] 로그인 엔드포인트에 속도 제한이 있습니다 (15분당 10회 이하)
- [ ] 비밀번호 재설정 토큰: 시간 제한(1시간 이하), 일회용
- [ ] 반복 실패 후 계정 잠금이 있습니다 (선택, 알림과 함께)
- [ ] 민감한 작업에 MFA를 지원합니다 (선택이지만 권장)

## 인가

- [ ] 보호된 모든 엔드포인트가 인증을 확인합니다
- [ ] 모든 리소스 접근이 소유권/역할을 확인합니다 (IDOR 방지)
- [ ] 관리자 엔드포인트는 관리자 역할 검증이 필요합니다
- [ ] API 키는 필요한 최소 권한으로 범위가 제한됩니다
- [ ] JWT 토큰을 검증합니다 (서명, 만료, 발급자)

## 입력 검증

- [ ] 모든 사용자 입력을 시스템 경계에서 검증합니다 (API 라우트, 폼 핸들러)
- [ ] 검증은 허용 목록을 사용합니다 (거부 목록이 아닙니다)
- [ ] 문자열 길이를 제한합니다 (최소/최대)
- [ ] 숫자 범위를 검증합니다
- [ ] 이메일, URL, 날짜 형식을 적절한 라이브러리로 검증합니다
- [ ] 파일 업로드: 타입을 제한하고, 크기를 제한하고, 내용을 검증합니다
- [ ] SQL 쿼리는 파라미터화합니다 (문자열 연결은 하지 마세요)
- [ ] HTML 출력은 인코딩합니다 (프레임워크 자동 이스케이프를 사용하세요)
- [ ] 리다이렉트 전에 URL을 검증합니다 (오픈 리다이렉트 방지)
- [ ] 서버 측 URL 페치는 허용 목록으로 제한합니다. 사설/예약 IP는 차단합니다 (SSRF 방지)
- [ ] 파괴적인 경로 작업(삭제/이동/덮어쓰기): 심볼릭 링크를 해석하고, 허용된 루트를 쓰고, 최소 깊이를 두고, 호출 전에 소유권 근거를 읽습니다

### 파괴적인 경로 작업

데이터가 이름 붙인 대상을 가두는 방법입니다. 먼저 해석한 다음 결정하세요. 그 결과는 인가가 아니라 후보로 다루세요.

```typescript
import { realpath, readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute, join, sep } from 'node:path';

const ALLOWED_ROOTS = ['/var/lib/myapp/sessions']; // an allowlist, not a pattern
const MIN_DEPTH = 1;                               // so a root is never the target

async function resolveDeletable(candidate: string, expectedOwner: string) {
  const target = await realpath(resolve(candidate)); // symlinks resolved BEFORE the check
  const inRoot = ALLOWED_ROOTS.some((root) => {
    const rel = relative(root, target);
    // `rel === '..'` / `'../'` only — a plain `startsWith('..')` would also
    // reject a legitimate child named `..cache`.
    if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return false;
    return rel.split(sep).length >= MIN_DEPTH;
  });
  if (!inRoot) throw new Error(`refusing: outside allowed roots (${target})`);

  const owner = await readFile(join(target, '.owner'), 'utf8').catch(() => null);
  if (owner?.trim() !== expectedOwner) throw new Error(`refusing: unproven owner (${target})`);
  return target;
}
```

이 스니펫을 복사해 가는 곳에서는, 이것이 하지 않는 일을 반드시 말해야 합니다.

- **마커는 자기 증명입니다.** 루트 안에 쓸 수 있는 것은 무엇이든 `.owner`를 쓸 수 있습니다. `expectedOwner`는 인증된 상태에서 와야 하고, 마커가 잘못 유도된 대상에 대한 일관성 검사가 아니라 인가가 되려면 무결성 보호(제한적인 소유권, 또는 MAC)가 필요합니다.
- **경로를 반환하면 검사와 사용 사이의 경합이 남습니다.** 신뢰할 수 없는 프로세스가 검사와 호출 사이에 조상 경로를 바꿀 수 있는 곳에서는, no-follow와 루트 아래(beneath-the-root) 의미론이 있는 디스크립터로 작업하거나, 그 동안 계층이 불변임을 보장하세요.

## 보안 헤더

```
Content-Security-Policy: default-src 'self'; script-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  (disabled, rely on CSP)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## CORS 구성

```typescript
// Restrictive (recommended)
cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// NEVER use in production:
cors({ origin: '*' })  // Allows any origin
```

## 데이터 보호

- [ ] API 응답에서 민감 필드를 제외합니다 (`passwordHash`, `resetToken` 등)
- [ ] 민감 데이터를 로그에 남기지 않습니다 (비밀번호, 토큰, 전체 카드 번호)
- [ ] 저장 시 PII를 암호화합니다 (규정이 요구하는 경우)
- [ ] 모든 외부 통신에 HTTPS를 사용합니다
- [ ] 데이터베이스 백업을 암호화합니다
- [ ] 개인 데이터는 분류되고, 명시한 목적에 맞춰 수집되며, 최소화됩니다
- [ ] 개인 데이터에 보존 기한과 작동하는 삭제 경로가 있습니다 (백업, 캐시, 인덱스 포함)
- [ ] 요구되는 곳에서 내보내기/삭제(정보 주체) 요청을 지원합니다. 서드파티 공유에는 동의와 데이터 처리 계약이 있습니다

## 의존성 보안

먼저 **설치 경계**를 찾으세요. 패키지가 부모 `workspaces` 선언에 맞으면 그 워크스페이스 루트를 사용하세요. 그렇지 않으면 매니페스트와 의존성 그래프를 모두 소유한 가장 가까운 프로젝트 루트를 사용하세요. 그 경계에서 `packageManager`(있을 때), 락파일, CI 명령을 서로 대조하세요. 어긋나거나 그 자리에 경쟁하는 매니저 락파일이 있으면 멈추세요. 중첩 프로젝트는 부모 워크스페이스 밖에 있을 때만 독립입니다. 독립 하위 프로젝트는 서로 다른 매니저를 정당하게 쓸 수 있습니다.

| 매니저/버전 신호 | 고정/불변 CI 설치 | 알려진 권고 감사 |
|---|---|---|
| npm (`package-lock.json` 또는 `npm-shrinkwrap.json`) | `npm ci` | `npm audit` |
| pnpm | `pnpm install --frozen-lockfile` | `pnpm audit` |
| Yarn 2+ | `yarn install --immutable` | `yarn npm audit -A -R` |
| Yarn 1 | `yarn install --frozen-lockfile` | `yarn audit` |

목록에 없는 매니저나 버전은 공식 문서를 보세요. 다른 매니저의 명령이나 더 새로운 기본값으로 바꾸지 마세요.

### 설치 스크립트 게이트

기본값이 검증되지 않은 클라이언트에서 일반 설치를 먼저 실행하는 방식으로, 의존성 라이프사이클 스크립트를 발견하지 마세요.

1. 의존성 스크립트를 끈 채로 부트스트랩하거나, 문서화된 기본 거부 정책에 실패 시 닫힘 강제를 더해 부트스트랩하세요.
2. 승인 전에 정확한 스크립트 소스와 패키지 버전을 검사하세요.
3. 설치 경계에 가장 좁은 네이티브 허용/거부 정책을 기록하고 커밋하세요.
4. 그 정책으로 깨끗한 고정/불변 설치를 실행하고, 필요한 패키지가 여전히 빌드되는지 확인하세요.

**시점 스냅샷:** 패키지 매니저의 기본값과 명령 이름은 빨리 바뀝니다. 이 표를 믿기 전에, 고정된 클라이언트의 현재 공식 문서와 대조하세요.

| 매니저 버전 | 네이티브 정책 |
|---|---|
| 세분화된 승인이 검증되지 않은 npm | `npm ci --ignore-scripts`로 부트스트랩하거나, 프로젝트 전체 차단이 의도일 때 `ignore-scripts=true`를 유지하세요. 리뷰된 의존성 스크립트를 허용하기 전에 스크립트를 끈 채로 두거나, 의도적으로 업그레이드하세요. |
| npm 11.18.x (11.18.0에서 검증) | 리뷰되지 않은 의존성 스크립트는 기본적으로 경고와 함께 실행됩니다. 일반 설치 전에 `strict-allow-scripts=true`를 강제하고, 설치 경계에서 워크스페이스를 인식하지 않는 `npm install-scripts ls`를 사용하세요. 승인은 버전에 고정하고, 거부는 이름 전체로 유지하세요. |
| npm 12.x (12.0.1에서 검증) | 리뷰되지 않은 의존성 스크립트는 기본적으로 건너뜁니다. `strict-allow-scripts=true`는 실행 전에 그 존재가 설치를 실패하게 합니다. 같은 `npm install-scripts` 리뷰와 승인 흐름을 사용하세요. |
| pnpm 11+ | `pnpm approve-builds`를 사용하고 `allowBuilds` 결정을 커밋하세요. `strictDepBuilds` 기본값은 `true`이므로, 리뷰되지 않은 빌드는 실패합니다. |
| pnpm 10.26–10.x | `allowBuilds`를 명시적으로 구성하거나, 레거시 `onlyBuiltDependencies` / `ignoredBuiltDependencies` 목록과 함께 `pnpm approve-builds`를 사용하세요. `strictDepBuilds: true`를 설정하세요. v10 기본값은 `false`입니다. |
| pnpm 10.1–10.25 | `pnpm approve-builds`가 레거시 목록을 기록합니다. 지원되는 곳(10.3+)에서 `strictDepBuilds`를 켜세요. |
| 더 오래되었거나 알 수 없는 pnpm | `pnpm install --frozen-lockfile --ignore-scripts`로 부트스트랩하세요. 고정된 버전이 강제 가능한 정책을 문서화하지 않으면 스크립트를 끈 채로 두세요. |
| Yarn 4.14+ | 의존성 postinstall은 기본적으로 꺼져 있습니다. 필요한 예외만 최상위 `dependenciesMeta.<package>.built: true`로 부여하세요. |
| Yarn 2–4.13 | `.yarnrc.yml`에 `enableScripts: false`를 설정한 다음, 필요한 예외만 최상위 `dependenciesMeta.<package>.built: true`로 부여하세요. 스크립트를 전역으로 켜지 마세요. |
| Yarn 1 | `yarn install --ignore-scripts`로 부트스트랩하세요. 필요한 각 예외가 고정된 클라이언트의 문서화된 워크플로우에서 리뷰되지 않으면 스크립트를 끈 채로 두세요. |

기준 문서: [npm install-scripts](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/), [설치 정책](https://docs.npmjs.com/cli/v11/commands/npm-install/), [CLI 릴리스](https://github.com/npm/cli/releases), [pnpm approve-builds](https://pnpm.io/cli/approve-builds), [빌드 설정](https://pnpm.io/settings#allowbuilds), [Yarn 보안](https://yarnpkg.com/features/security), [매니페스트](https://yarnpkg.com/configuration/manifest#dependenciesMeta).

**공급망 위생** (권고 감사는 새로 악성인 패키지를 잡지 못합니다):
- [ ] 프로젝트/워크스페이스 루트마다 권위 있는 락파일이 정확히 하나 커밋되고, CI는 그것을 다시 쓰지 않습니다
- [ ] Critical/high 발견은 도달 가능성을 기준으로 분류합니다. 미루기에는 이유와 리뷰 날짜가 있습니다
- [ ] 강제 감사 수정(`npm audit fix --force` 또는 같은 수준의 명령)은 절대 자동이 아닙니다. 수정 diff와 변경 이력을 리뷰하세요
- [ ] 매니저가 지원하는 곳에서 레지스트리 서명/출처를 검증합니다
- [ ] 의존성 라이프사이클 스크립트는 첫 실행 전에 차단되고, 고정된 매니저의 네이티브 정책을 통해서만 승인됩니다
- [ ] 새 의존성은 소유권, 유지보수, 릴리스 연령, 출처, 전이 그래프, 타이포스쿼팅을 리뷰합니다

## AI / LLM 보안

LLM을 호출하는 모든 기능(챗봇, 요약기, 에이전트, RAG)에 대해:

- [ ] 모델 출력을 신뢰하지 않습니다. `eval`/SQL/셸/`innerHTML`/파일 경로에 절대 넣지 마세요
- [ ] 프롬프트 인젝션을 가정합니다. 권한은 시스템 프롬프트가 아니라 코드에서 강제합니다
- [ ] 시크릿, 테넌트 간 데이터, 전체 시스템 프롬프트를 컨텍스트 창 밖에 둡니다
- [ ] 도구/에이전트 권한을 범위로 제한합니다. 파괴적이거나 되돌릴 수 없는 동작은 확인이 필요합니다
- [ ] 토큰, 속도, 재귀/루프 제한을 설정합니다 (소비에 상한을 두세요)

## 오류 처리

```typescript
// Production: generic error, no internals
res.status(500).json({
  error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
});

// NEVER in production:
res.status(500).json({
  error: err.message,
  stack: err.stack,         // Exposes internals
  query: err.sql,           // Exposes database details
});
```

## OWASP Top 10 빠른 참조

| # | 취약점 | 예방 |
|---|---|---|
| 1 | 취약한 접근 제어 (Broken Access Control) | 모든 엔드포인트에서 인증을 확인하고, 소유권을 검증하세요 |
| 2 | 암호화 실패 (Cryptographic Failures) | HTTPS, 강한 해시, 코드에 시크릿 없음 |
| 3 | 인젝션 (Injection) | 파라미터화 쿼리, 입력 검증 |
| 4 | 안전하지 않은 설계 (Insecure Design) | 위협 모델링, 스펙 주도 개발 |
| 5 | 보안 설정 오류 (Security Misconfiguration) | 보안 헤더, 최소 권한, 의존성 감사 |
| 6 | 취약한 구성요소 (Vulnerable Components) | 그 생태계의 의존성 감사(`npm audit`, `pip-audit`, ...), 의존성을 갱신하고, 의존성을 최소화하세요 |
| 7 | 인증 실패 (Auth Failures) | 강한 비밀번호, 속도 제한, 세션 관리 |
| 8 | 데이터 무결성 실패 (Data Integrity Failures) | 업데이트와 의존성을 검증하고, 서명된 아티팩트를 사용하세요 |
| 9 | 로깅 실패 (Logging Failures) | 보안 이벤트를 로그하고, 시크릿은 로그하지 마세요 |
| 10 | SSRF | URL을 검증하고 허용 목록으로 제한하세요. 아웃바운드 요청을 제한하세요 |

## LLM용 OWASP Top 10 빠른 참조

LLM 기능이 있는 앱용입니다. [OWASP GenAI Security Project](https://genai.owasp.org/llm-top-10/)를 보세요.

| ID | 위험 | 예방 |
|---|---|---|
| LLM01 | 프롬프트 인젝션 (Prompt Injection) | 시스템 프롬프트를 경계로 믿지 마세요. 권한은 코드에서 강제하세요 |
| LLM02 | 민감 정보 노출 (Sensitive Information Disclosure) | 프롬프트에 시크릿/PII를 넣지 마세요. 출력을 거르세요 |
| LLM03 | 공급망 (Supply Chain) | 모델, 데이터셋, 플러그인을 다른 의존성처럼 검토하세요 |
| LLM04 | 데이터 및 모델 오염 (Data and Model Poisoning) | 신뢰할 수 있는 모델 소스를 쓰고 무결성을 검증하세요. 파인튜닝과 RAG 데이터를 검토하세요 |
| LLM05 | 부적절한 출력 처리 (Improper Output Handling) | 모델 출력을 신뢰하지 마세요. 검증하고, 파라미터화하고, 인코딩하세요 |
| LLM06 | 과도한 자율성 (Excessive Agency) | 도구 권한을 범위로 제한하세요. 파괴적 동작은 확인하세요 |
| LLM07 | 시스템 프롬프트 유출 (System Prompt Leakage) | 시스템 프롬프트는 유출될 수 있다고 가정하세요. 시크릿을 넣지 마세요 |
| LLM08 | 벡터 및 임베딩 약점 (Vector and Embedding Weaknesses) | RAG 임베딩을 테넌트별로 나누세요. 인덱싱 전에 문서를 검증하세요 |
| LLM09 | 허위 정보 (Misinformation) | 인용으로 답에 근거를 두세요. 중요한 주장을 검증하세요. 루프 안에 사람을 두세요 |
| LLM10 | 제한 없는 소비 (Unbounded Consumption) | 토큰, 요청 속도, 루프/재귀 깊이에 상한을 두세요 |
