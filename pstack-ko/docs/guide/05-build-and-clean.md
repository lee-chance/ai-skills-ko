# 변경 빌드 및 diff 정리

빌드 플레이북은 하나의 규율을 공유합니다. 관찰한 것을 말하고, 플레이북이 증거를 요구하도록 하세요. 이 페이지는 각 일반적인 빌드 작업에 대한 프롬프트에 무엇을 넣을지, 그리고 diff를 검토 가능하게 유지하는 정리 습관을 보여줍니다.

## 알고 있는 것으로 각 빌드 플레이북 프롬프트

버그 프롬프트는 증상을 명시하고 먼저 재현을 요청합니다:

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

기능 프롬프트는 동작과 변경되지 않아야 하는 것을 명시합니다:

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

리팩토링 프롬프트는 구조가 이동하기 전에 동작을 고정합니다:

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

성능 프롬프트는 인상이 아니라 측정을 명시합니다:

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

이들 각각은 플레이북([Bug fix](../../skills/poteto-mode/playbooks/bug-fix.md), [Feature](../../skills/poteto-mode/playbooks/feature.md), [Refactoring](../../skills/poteto-mode/playbooks/refactoring.md), [Perf issue](../../skills/poteto-mode/playbooks/perf-issue.md))으로 라우팅되며, 플레이북은 입력하지 않은 단계를 제공합니다: 수정 전에 재현, 구현 전에 데이터 형태 명명, 재구성 전에 동작 고정, 최적화 전에 프로파일링.

하나의 숫자를 지속적으로 개선하기 위해, [Hillclimb 플레이북](../../skills/poteto-mode/playbooks/hillclimb.md)이 있습니다. 메트릭, 목표, 시도 하한을 주면, 고정된 측정 하네스로 한 번에 하나의 가설을 반복합니다. 승리를 유지하고 다른 모든 것을 되돌립니다.

두 성능 플레이북 모두 숫자에 대해 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)를 실행합니다. Perf issue는 기준선과 그 이후의 모든 숫자를 검증하고, Hillclimb은 고정하기 전에 하네스를 검증합니다. [검증 및 배포](./06-verify-and-ship.md#vet-a-measured-number-with-benchmark-checklist)는 직접 입력할 시점을 보여줍니다.

때로는 수정 전에 원인을 원합니다. 누수, 유휴 CPU 스핀 또는 시각적 글리치와 같은 라이브 증상의 경우, [Runtime forensics 플레이북](../../skills/poteto-mode/playbooks/runtime-forensics.md)이 실행 중인 프로세스를 계측합니다. 이미 캡처한 프로파일의 경우, [Trace forensics 플레이북](../../skills/poteto-mode/playbooks/trace-forensics.md)이 아티팩트를 읽고 핫 프레임을 소스에 매핑합니다. 둘 다 수정이 아니라 진단을 반환합니다:

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## `/tdd`로 실패하는 테스트를 먼저 작성

버그에 저렴한 로컬 테스트 경로가 있을 때, 전체 프롬프트는 두 단어일 수 있습니다:

```text
/tdd implement
```

컨텍스트에서, 그것으로 충분합니다. [`/tdd`](../../skills/tdd/SKILL.md)는 의도된 이유로 실패하는 가장 작은 테스트를 작성한 다음 수정하고 테스트를 재실행합니다. 테스트가 광범위한 하네스 설정이나 취약한 mock이 필요한 경우, 스킬이 그렇게 말하고 대신 가장 가까운 실행 가능한 체크를 사용합니다. 실제 명령이 더 강력한 증거인 곳에 테스트를 강제하지 마세요.

## 이름으로 TypeScript 규칙 로드

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md)는 타입 시스템 원칙을 구체적인 규칙으로 바꿉니다: 판별된 유니온, 경계에서 `unknown`, 완전한 변형, 스키마 파생 타입. 자체적으로 로드되지 않으므로, 작업이 `.ts` 또는 `.tsx` 파일을 건드릴 때 `/typescript-best-practices`를 입력하세요.

## 커밋 전에 정리

[PR 열기 플레이북](../../skills/poteto-mode/playbooks/opening-a-pr.md)은 각 커밋 전에 diff에 대해 `/deslop`을 실행하고 PR 설명과 커밋 본문에 [`/unslop`](../../skills/unslop/SKILL.md)을 적용합니다. `/deslop`은 pstack이 아니라 `cursor-team-kit` 플러그인에서 제공됩니다. 없으면, 동일한 결과를 명확한 단어로 요청하세요: 내레이션 주석, 지원되지 않는 가드, 죽은 호환성 경로, 관련 없는 편집 제거.

산문의 경우, `/unslop`은 대상과 가진 추가 규칙을 취합니다:

```text
/unslop the readme changes, no emdashes
```

자신만의 속기를 개발할 것입니다. 스킬은 `unslop that, tighten it`와 같은 간결한 프롬프트에서 의도를 잘 읽습니다.

## `/no-comments`로 주석 제거

주석은 자체 패스가 필요하며, 그것을 작성한 에이전트로부터가 아닙니다. 저자는 당신이 당신의 주석을 방어하는 방식으로 주석을 방어합니다. 그래서 리뷰 전에, 새로운 눈에 전달하세요:

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md)는 [Comment Sicko](../../agents/comment-sicko.md)를 생성하며, 짧은 keep 리스트를 가진 읽기 전용 리뷰어입니다: 라이선스 헤더, 공개 API의 doc 주석, 코드가 할 수 없는 것을 설명하는 링크, 재형성할 수 없는 외부 의존성에 의해 강제된 동작. 다른 모든 것은 사라집니다. 자신의 코드의 놀라움은 그러한 패스를 얻지 못합니다. 주석은 리팩토링 플래그로 돌아오고, `/no-comments`는 근본 원인에서 수락하는 플래그를 수정합니다. 주석이 제약을 주장할 때, "do not remove", 스킬은 주장을 타입, 테스트 또는 lint로 인코딩할 것을 제안합니다. 어느 쪽이든, 주석은 나옵니다.

노동의 분담은 곧게 유지할 가치가 있습니다. `/deslop`은 코드에서 slop을 정리하고, `/unslop`은 산문에서 정리하고, `/no-comments`는 주석을 작성하지 않은 리뷰어에게 전달합니다.

**함정:** 정리는 선택적 폴리시가 아닙니다. 내레이션 주석과 방어적 데드 웨이트가 있는 diff는 리뷰어에게 미완성으로 읽히고, 추가 코드는 다음 버그가 숨는 곳입니다. diff가 패딩된 것처럼 느껴지면, 리뷰가 지적한 후가 아니라 커밋하기 전에 `deslop it`이라고 말하세요.

다음: [검증 및 배포](./06-verify-and-ship.md).
