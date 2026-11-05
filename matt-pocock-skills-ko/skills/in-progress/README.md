# In Progress

베타. 이 스킬들은 의도적으로 공개되어 있습니다: 사용해 보고 무엇이 깨지는지 알려주세요. 안정적인 버킷으로 졸업할 때까지 플러그인과 최상위 README에서 제외되며, 문서 페이지가 없고, 경고 없이 변경되거나 사라질 수 있습니다.

플러그인은 이것들을 제공하지 않습니다. 하나를 직접 설치하세요:

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)**: 현재 디렉토리를 상태 저장 워크스페이스로 사용하여 여러 세션에 걸쳐 구현 가능한 워크플로우 스펙으로 자신을 그릴합니다. 사용자 호출.
- **[writing-beats](./writing-beats/SKILL.md)**: 기사를 비트의 여정으로 형성합니다. 선택-자신의-모험 스타일. 시작 비트를 선택하고, 해당 비트만 작성한 다음, 기사가 자연스러운 끝에 도달할 때까지 다음으로 피벗합니다.
- **[writing-fragments](./writing-fragments/SKILL.md)**: 파편 (이질적인 작성 덩어리)을 채굴하고 미래 기사의 원시 자료로 단일 문서에 추가하는 그릴링 세션.
- **[writing-shape](./writing-shape/SKILL.md)**: 원시 자료의 마크다운 파일을 가져와 각 단계에서 형식 선택을 논쟁하면서 단락별로 기사로 형성합니다.
- **[claude-handoff](./claude-handoff/SKILL.md)**: 현재 대화를 `claude --bg`를 통해 핸드오프 요약으로 시드된 새로운 백그라운드 에이전트에게 즉시 작업을 넘깁니다. 사용자 호출.
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**: TypeScript 저장소에 dependency-cruiser를 연결하여 각 패키지가 깊은 모듈이 되도록 합니다: 구현은 하위 폴더에 숨겨져 있고, 엔트리 포인트 파일을 통해서만 도달 가능하며, 테스트는 그것들을 통해 실행합니다. 사용자 호출.
- **[software-factory](./software-factory/SKILL.md)**: 소프트웨어 팩토리 설계를 위한 공유 언어: 실행하는 작업과 연결하는 서비스. 그릴링 세션과 함께 호출하세요. 사용자 호출.
