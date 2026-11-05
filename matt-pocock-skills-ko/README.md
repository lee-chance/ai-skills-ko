<p>
  <a href="https://www.aihero.dev/s/skills-newsletter">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skills-repo-dark_2x.png">
      <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png">
      <img alt="Skills" src="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png" width="369">
    </picture>
  </a>
</p>

# Skills For Real Engineers

[![skills.sh](https://skills.sh/b/mattpocock/skills)](https://skills.sh/mattpocock/skills)

실제 엔지니어링에 매일 사용하는 에이전트 스킬 모음입니다 - 분위기 코딩이 아닙니다.

실제 애플리케이션 개발은 어렵습니다. GSD, BMAD, Spec-Kit 같은 접근법들이 프로세스를 소유함으로써 도움을 주려 하지만, 그러는 동안 여러분의 제어권을 빼앗고 프로세스의 버그를 해결하기 어렵게 만듭니다.

이 스킬들은 작고, 쉽게 적응할 수 있으며, 조합 가능하도록 설계되었습니다. 어떤 모델과도 작동합니다. 수십 년의 엔지니어링 경험을 기반으로 합니다. 마음껏 변경하고, 여러분의 것으로 만들고, 즐기세요.

이 스킬들의 변경사항과 새로운 스킬들을 계속 받아보고 싶다면, 약 60,000명의 다른 개발자들과 함께 뉴스레터에 가입할 수 있습니다:

[뉴스레터 가입하기](https://www.aihero.dev/s/skills-newsletter)

## 설치 (30초 설정)

플러그인은 자동으로 업데이트됩니다. [skills.sh](https://skills.sh/mattpocock/skills)는 편집 가능한 파일들을 프로젝트에 복사하며, 수동으로 업데이트합니다. 에이전트당 하나를 선택하세요. 둘 다 설치하면 모든 스킬이 두 번 생깁니다.

### 1. 스킬 가져오기

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

기본적으로 자동 업데이트됩니다.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

시작 시 자동 업데이트됩니다.

</details>

<details>
<summary><strong>GitHub Copilot</strong> (CLI와 VS Code)</summary>

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

그런 다음, 한 번만, `~/.copilot/settings.json`에 추가하세요:

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": { "source": { "source": "github", "repo": "mattpocock/skills" }, "autoUpdate": true }
  }
}
```

VS Code에서는 **Chat: Install Plugin From Source**를 실행하고 `https://github.com/mattpocock/skills`를 입력하세요. 매일 업데이트됩니다.

</details>

<details>
<summary><strong>Gemini CLI</strong> (수동 업데이트)</summary>

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

업데이트하려면 두 명령어를 다시 실행하세요.

</details>

<details>
<summary><strong>다른 에이전트, 또는 편집 가능한 파일</strong> (수동 업데이트)</summary>

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, opencode, devin, windsurf, amp, pi; -a를 생략하면 선택 가능
```

설치 프로그램이 어떤 스킬을 가져올지 물으면, `setup-matt-pocock-skills`를 포함하세요. 업데이트하려면 `npx skills@latest update`를 실행하고, 새 스킬을 가져오려면 `add`를 다시 실행하세요.

</details>

### 2. `/setup-matt-pocock-skills` 실행

에이전트에서 저장소당 한 번 실행하세요. 다음을 수행합니다:

- 사용할 이슈 트래커 선택 (GitHub, GitLab, 로컬 파일, 또는 설명하는 다른 것)
- 이슈를 트리아지할 때 적용할 라벨 선택 (`/triage`가 라벨을 사용함)
- 생성할 문서를 저장할 위치 선택

### 3. 완료 - 사용 준비 완료

## 이 스킬들이 존재하는 이유

Claude Code, Codex 및 다른 코딩 에이전트에서 흔히 발생하는 실패 모드를 수정하는 방법으로 이 스킬들을 만들었습니다.

### #1: 에이전트가 원하는 대로 하지 않았어요

> "자신이 정확히 무엇을 원하는지 아는 사람은 아무도 없습니다"
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**문제점**. 소프트웨어 개발에서 가장 흔한 실패 모드는 정렬 불일치입니다. 개발자가 여러분이 원하는 것을 알고 있다고 생각합니다. 그런 다음 그들이 만든 것을 보고 - 전혀 이해하지 못했다는 것을 깨닫습니다.

AI 시대에도 마찬가지입니다. 여러분과 에이전트 사이에 의사소통 간극이 있습니다. 이를 해결하는 방법은 **그릴링 세션** - 에이전트가 여러분이 만들고 있는 것에 대해 상세한 질문을 하도록 하는 것입니다.

**해결책**은 다음을 사용하는 것입니다:

- [`/grill-me`](./skills/productivity/grill-me/SKILL.md) - 코드가 아닌 용도
- [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) - [`/grill-me`](./skills/productivity/grill-me/SKILL.md)와 같지만 더 많은 기능 추가 (아래 참조)

이것들은 제가 가장 많이 사용하는 스킬입니다. 시작하기 전에 에이전트와 정렬하고, 여러분이 만드는 변경사항에 대해 깊이 생각하도록 도와줍니다. 변경을 하고 싶을 _때마다_ 사용하세요.

### #2: 에이전트가 너무 장황해요

> 유비쿼터스 언어를 사용하면 개발자들 간의 대화와 코드 표현이 모두 동일한 도메인 모델에서 파생됩니다.
>
> Eric Evans, [Domain-Driven-Design](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

**문제점**: 프로젝트 시작 시, 개발자와 소프트웨어를 만들고 있는 대상(도메인 전문가)은 보통 다른 언어를 사용합니다.

에이전트와도 같은 긴장감을 느꼈습니다. 에이전트는 보통 프로젝트에 투입되어 진행하면서 전문 용어를 파악하라는 요청을 받습니다. 그래서 한 단어로 충분할 곳에 20단어를 사용합니다.

**해결책**은 공유 언어입니다. 에이전트가 프로젝트에서 사용되는 전문 용어를 해독하는 데 도움이 되는 문서입니다.

<details>
<summary>
예시
</summary>

다음은 제 `course-video-manager` 저장소의 [glossary](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md) 예시입니다 (고정된 커밋에서는 스킬이 관례를 이름 변경하기 전의 `CONTEXT.md`로 여전히 명명됨). 어느 것이 읽기 쉬운가요?

- **이전**: "강좌의 섹션 내 레슨이 '실제'가 될 때 (즉, 파일 시스템에 자리를 부여받을 때) 문제가 있습니다"
- **이후**: "구체화 캐스케이드에 문제가 있습니다"

이러한 간결함은 세션마다 보상을 받습니다.

</details>

이것은 [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md)에 내장되어 있습니다. 그릴링 세션이지만, AI와 공유 언어를 구축하고 설명하기 어려운 결정을 ADR에 문서화하는 데 도움이 됩니다.

이것이 얼마나 강력한지 설명하기 어렵습니다. 이 저장소에서 가장 멋진 기술일 수 있습니다. 사용해 보세요.

> [!TIP]
> 공유 언어는 장황함을 줄이는 것 외에도 많은 다른 이점이 있습니다:
>
> - **변수, 함수, 파일이 공유 언어를 사용하여 일관되게 명명됩니다**
> - 결과적으로 **코드베이스가 에이전트가 탐색하기 쉬워집니다**
> - 에이전트는 더 간결한 언어에 액세스할 수 있기 때문에 **생각하는 데 더 적은 토큰을 소비합니다**

### #3: 코드가 작동하지 않아요

> "항상 작고 신중한 단계를 밟으세요. 피드백 속도가 여러분의 속도 제한입니다. 너무 큰 작업을 맡지 마세요."
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**문제점**: 여러분과 에이전트가 무엇을 만들지 정렬되어 있다고 가정해 봅시다. 에이전트가 _여전히_ 쓰레기를 생산하면 어떻게 될까요?

피드백 루프를 살펴볼 시간입니다. 생산하는 코드가 실제로 어떻게 실행되는지에 대한 피드백 없이, 에이전트는 맹목적으로 비행할 것입니다.

**해결책**: 일반적인 피드백 루프가 필요합니다: 정적 타입, 브라우저 액세스, 자동화된 테스트.

자동화된 테스트의 경우, red-green-refactor 루프가 중요합니다. 에이전트가 먼저 실패하는 테스트를 작성한 다음 테스트를 수정하는 곳입니다. 이것은 에이전트에게 훨씬 더 나은 코드를 만드는 일관된 수준의 피드백을 제공하는 데 도움이 됩니다.

어떤 프로젝트에든 연결할 수 있는 **[`/tdd`](./skills/engineering/tdd/SKILL.md) 스킬**을 만들었습니다. red-green-refactor를 장려하고 에이전트에게 좋은 테스트와 나쁜 테스트에 대한 많은 지침을 제공합니다.

디버깅을 위해, 최선의 디버깅 관행을 단계별로 게이트된 규율적인 루프로 감싸는 **[`/diagnosing-bugs`](./skills/engineering/diagnosing-bugs/SKILL.md)** 스킬도 만들었습니다.

### #4: 진흙 공을 만들었어요

> "매일 시스템 설계에 투자하세요."
>
> Kent Beck, [Extreme Programming Explained](https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658)

> "최고의 모듈은 깊습니다. 간단한 인터페이스를 통해 많은 기능에 액세스할 수 있게 합니다."
>
> John Ousterhout, [A Philosophy Of Software Design](https://www.amazon.co.uk/Philosophy-Software-Design-2nd/dp/173210221X)

**문제점**: 에이전트로 만든 대부분의 앱은 복잡하고 변경하기 어렵습니다. 에이전트가 코딩 속도를 급격히 높일 수 있기 때문에, 소프트웨어 엔트로피도 가속화됩니다. 코드베이스는 전례 없는 속도로 더 복잡해집니다.

**해결책**은 AI 기반 개발에 대한 급진적인 새로운 접근법입니다: 코드 설계에 신경 쓰기.

이것은 이 스킬들의 모든 계층에 내장되어 있습니다:

- [`/to-spec`](./skills/engineering/to-spec/SKILL.md)은 스펙을 만들기 전에 어떤 모듈을 건드리고 있는지 퀴즈를 냅니다

그리고 결정적으로, [`/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.md)는 코드베이스를 조사하여 깊게 만들 기회를 찾고 후보를 제공합니다. 며칠마다 한 번씩 코드베이스에서 실행하는 것을 권장합니다. 이것은 조사이지, 구조가 아닙니다: 진정으로 오래된 코드베이스에서는 실제 후보를 찾지만, 진흙을 풀어주지는 않습니다.

### 요약

소프트웨어 엔지니어링 기초가 그 어느 때보다 중요합니다. 이 스킬들은 이러한 기초를 반복 가능한 관행으로 압축하여 경력에서 최고의 앱을 출시할 수 있도록 돕는 최선의 노력입니다. 즐기세요.

## 레퍼런스

이것들은 한 축으로 나뉩니다: 누가 호출할 수 있는가. **사용자 호출** 스킬은 여러분이 입력할 때만 도달할 수 있습니다 (예: `/grill-me`); 그들의 역할은 오케스트레이션입니다. **모델 호출** 스킬은 여러분 _또는_ 작업에 맞을 때 에이전트가 자동으로 도달할 수 있습니다; 재사용 가능한 규율을 담고 있습니다. 사용자 호출 스킬은 모델 호출 스킬을 호출할 수 있지만, 다른 사용자 호출 스킬은 절대 호출하지 않습니다.

### Engineering

코드 작업에 매일 사용하는 스킬입니다.

**사용자 호출**

- **[ask-matt](./skills/engineering/ask-matt/SKILL.md)**: 상황에 맞는 스킬이나 플로우를 물어보세요. 이 저장소의 사용자 호출 스킬에 대한 라우터입니다.
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)**: 프로젝트의 도메인 모델을 구축하고 용어를 다듬으며 `GLOSSARY.md`와 ADR을 인라인으로 업데이트하는 그릴링 세션입니다.
- **[triage](./skills/engineering/triage/SKILL.md)**: 트리아지 역할의 상태 머신을 통해 이슈를 이동시킵니다.
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)**: 깊게 만들 기회를 찾기 위해 코드베이스를 스캔하고 시각적 HTML 리포트로 제시한 다음, 선택한 것을 그릴합니다.
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.md)**: 엔지니어링 스킬을 위해 이 저장소를 구성합니다 (이슈 트래커, 트리아지 라벨, 도메인 문서 레이아웃). 다른 엔지니어링 스킬을 사용하기 전에 저장소당 한 번 실행하세요.
- **[to-spec](./skills/engineering/to-spec/SKILL.md)**: 현재 대화를 스펙으로 전환하고 이슈 트래커에 게시합니다. 인터뷰 없이, 이미 논의한 것을 종합합니다.
- **[to-tickets](./skills/engineering/to-tickets/SKILL.md)**: 모든 계획, 스펙 또는 대화를 tracer-bullet 티켓 세트로 분해합니다. 각각은 차단 엣지를 선언하며, 로컬 파일의 텍스트로 작성되거나 실제 트래커의 네이티브 차단 링크로 작성됩니다.
- **[implement](./skills/engineering/implement/SKILL.md)**: 스펙 또는 티켓 세트에 설명된 작업을 빌드하고, 미리 합의된 심에서 `/tdd`를 구동하고 커밋하기 전에 `/code-review`로 마무리합니다.
- **[implement-spec](./skills/engineering/implement-spec/SKILL.md)**: 하나의 통합 브랜치에서 전체 스펙을 구현합니다. 티켓을 작업 그래프로 처리하고, 최대 동시성을 위해 준비된 프론티어를 가로질러 구현자 서브에이전트를 실행한 다음, `/code-review`로 마무리합니다.
- **[wayfinder](./skills/engineering/wayfinder/SKILL.md)**: 하나의 에이전트 세션이 담을 수 있는 것보다 더 큰 작업 덩어리를 이슈 트래커의 의사 결정 티켓 공유 맵으로 계획하고, 목적지로 가는 길이 명확해질 때까지 한 번에 하나씩 해결합니다.
- **[retro](./skills/engineering/retro/SKILL.md)**: 세션 후 코딩 에이전트 환경(탐색, 자동 검사, 코딩 표준, 조향 파일, 도구)에 대한 개선 사항을 가장 심각한 것부터 제안합니다.

**모델 호출**

- **[prototype](./skills/engineering/prototype/SKILL.md)**: 설계 질문에 답하기 위해 일회용 프로토타입을 빌드합니다. 상태/로직 질문을 위한 단일 공유 가능 HTML 파일이거나, 한 경로에서 토글 가능한 여러 급진적으로 다른 UI 변형입니다.
- **[diagnosing-bugs](./skills/engineering/diagnosing-bugs/SKILL.md)**: 어려운 버그와 성능 회귀에 대한 규율적인 진단 루프: 이 버그에 빨간색이 되는 피드백 루프 구축 → 최소화 → 가설 세우기 → 계측 → 수정 → 회귀 테스트.
- **[research](./skills/engineering/research/SKILL.md)**: 신뢰도 높은 주요 소스에 대해 질문을 조사하고 결과를 저장소의 인용된 Markdown 파일로 캡처합니다. 백그라운드 에이전트로 실행됩니다.
- **[tdd](./skills/engineering/tdd/SKILL.md)**: red-green-refactor 루프가 있는 테스트 주도 개발. 한 번에 하나의 수직 슬라이스씩 기능을 빌드하거나 버그를 수정합니다.
- **[domain-modeling](./skills/engineering/domain-modeling/SKILL.md)**: 프로젝트의 도메인 모델을 적극적으로 구축하고 다듬습니다: 용어집에 대해 용어를 도전하고, 엣지 케이스 시나리오로 스트레스 테스트하고, `GLOSSARY.md`와 ADR을 인라인으로 업데이트합니다.
- **[codebase-design](./skills/engineering/codebase-design/SKILL.md)**: 깊은 모듈 설계를 위한 공유 규율과 어휘: 작은 인터페이스 뒤에 많은 동작, 깨끗한 심에 배치, 해당 인터페이스를 통해 테스트 가능.
- **[code-review](./skills/engineering/code-review/SKILL.md)**: 고정 지점 이후 diff의 두 축 리뷰: **표준** (저장소의 코딩 표준과 Fowler 냄새 기준을 따르나?) 및 **스펙** (원래 이슈/스펙을 충실히 구현하나?), 병렬 서브에이전트로 실행되어 서로 오염되지 않도록 합니다.
- **[pr](./skills/engineering/pr/SKILL.md)**: 풀 리퀘스트 본문이 취해야 하는 형태: 변경사항을 명확하게 만드는 가장 작은 시각으로서의 요약, 작동한다는 전후 증거, 병합 위험 호출 (단방향 또는 양방향 도어, 폭발 반경 포함).
- **[wizard](./skills/engineering/wizard/SKILL.md)**: 인간만 수행할 수 있는 단계를 안내하는 대화형 bash 마법사 생성: 인프라 프로비저닝, 자격 증명 또는 CI 시크릿 설정, 익숙하지 않은 타사 대시보드 탐색, 일회성 마이그레이션 또는 전환 실행.

### Productivity

일반 워크플로우 도구, 코드 전용이 아닙니다.

**사용자 호출**

- **[grill-me](./skills/productivity/grill-me/SKILL.md)**: 설계 트리의 모든 분기가 해결될 때까지 계획이나 설계에 대해 끊임없이 인터뷰를 받으세요.
- **[handoff](./skills/productivity/handoff/SKILL.md)**: 현재 대화를 핸드오프 문서로 압축하여 다른 에이전트가 작업을 계속할 수 있도록 합니다.
- **[teach](./skills/productivity/teach/SKILL.md)**: 현재 디렉토리를 상태 저장 교육 워크스페이스로 사용하여 여러 세션에 걸쳐 사용자에게 새로운 스킬이나 개념을 가르칩니다.
- **[to-questionnaire](./skills/productivity/to-questionnaire/SKILL.md)**: 혼자 답할 수 없는 결정을 답할 수 있는 한 사람을 위한 Markdown 설문지로 전환합니다. 비동기식으로 작성되거나 회의 중에 함께 작성됩니다. 주제가 아니라 전송(누구를 위한 것인지, 무엇을 돌려받아야 하는지)에 대해 그릴합니다.
- **[wait-what](./skills/productivity/wait-what/SKILL.md)**: 메시지가 이해되지 않는 순간 발동하세요. 에이전트가 누락된 컨텍스트로 다시 피치하며, `GLOSSARY.md` 어휘를 사용하여 평이한 영어로 설명합니다.

**모델 호출**

- **[grilling](./skills/productivity/grilling/SKILL.md)**: 설계 트리의 모든 분기가 해결될 때까지 계획, 결정 또는 아이디어에 대해 사용자를 끊임없이 인터뷰합니다. `grill-me`, `grill-with-docs`, `triage`, `wayfinder` 및 `improve-codebase-architecture` 뒤의 재사용 가능한 인터뷰 프리미티브입니다.
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**: 에이전트를 위한 문서 작성: 스킬, AGENTS.md/CLAUDE.md, 에이전트가 포인터로 도달하는 모든 문서.
