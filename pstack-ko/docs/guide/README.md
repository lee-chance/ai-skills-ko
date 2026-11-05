# pstack 가이드

pstack은 에이전트를 미세 관리하는 것을 멈출 때 가장 잘 작동합니다. 원하는 것과 완료되었는지 아는 방법을 설명하세요. `/poteto-mode`가 플레이북을 선택하고, 단계가 필요할 때 다른 스킬들을 실행하고, 증거를 보여줍니다. 이 가이드는 현실적인 프롬프트로 그 습관을 가르칩니다.

배우게 될 내용:

1. [pstack 설정하기](./01-setup.md). 플러그인을 설치하고 모델을 선택.
2. [`/poteto-mode`를 통한 작업 라우팅](./02-poteto-mode.md). 목표를 주고 플레이북을 선택하는 것을 관찰.
3. [코드 이해하기](./03-understand.md). 읽기 전용 조사, 그 다음 무엇이든 편집하기 전에 `/how`, `/why`, `/teach`, `/recall`.
4. [변경 설계하기](./04-design.md). 코드가 형태로 고정되기 전에 `/architect`, `/arena`, `/swarm`, `/interrogate`, 프로토타입, 계획.
5. [변경 빌드 및 정리](./05-build-and-clean.md). 빌드 플레이북, `/tdd`, `/unslop`, `/no-comments`.
6. [검증 및 배포](./06-verify-and-ship.md). 실제 앱에서 동작을 증명하고, 테스트가 거의 도달하지 못하는 것을 공식적으로 검증하고, `/benchmark-checklist`로 숫자를 검증한 다음, 집중된 PR을 열고 병합까지 주도.
7. [수면 중 작업 실행](./07-overnight.md). 루프 전 신뢰, 야간 계약, 감사할 수 있는 의사결정 로그, 그리고 하나의 에이전트를 넘어 확장되는 프로젝트와 자동화.
8. [원칙 이름으로 조향](./08-principles.md). 작업 중간에 에이전트를 리디렉션하는 24개의 이름.
9. [당신의 것으로 만들기](./09-make-it-yours.md). 자신만의 모드, 반복된 실수를 위한 `/correct`, 스킬 변경을 테스트하는 방법.
10. [레시피와 함정](./10-recipes-and-pitfalls.md). 복사할 프롬프트와 건너뛸 실수.

처음에는 페이지를 순서대로 읽으세요. 그 후에는 각 페이지가 독립적입니다.

막히거나 어떤 스킬이 맞는지 알 수 없을 때, 질문과 함께 [`/poteto-help`](../../skills/poteto-help/SKILL.md)를 입력하세요:

```text
/poteto-help which skill should i use to review this branch?
```

답변을 하고, 보낼 프롬프트를 제공하고, 답변이 나온 스킬 또는 가이드 페이지를 링크합니다. pstack 실행은 실제 토큰을 소비하므로 작업을 시작하지 않으며, 준비가 되면 프롬프트를 보냅니다. 입력할 때만 실행됩니다.

## 한 가지만 기억한다면

에이전트에게 목표와 확인 방법을 자신의 말로 제공하세요:

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

플레이북을 명명하거나 스킬을 나열할 필요가 없습니다. "repro first"와 확인 가능한 결과가 `/poteto-mode`가 필요한 모든 라우팅 신호입니다. Bug fix 플레이북에 매칭하고, 단계를 todo 리스트에 복사하고, 각 단계가 실행될 때 올바른 스킬을 호출합니다.

다음: [pstack 설정하기](./01-setup.md).
