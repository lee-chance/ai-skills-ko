# 분류 자동화 프롬프트

> 복사된 setup 워크플로우의 출처 자료입니다. `automate`가 복사된 팩이 자동화가 실행될 저장소에 커밋되었음을 확인한 다음, 이 의도를 내장 `automate` 초안에 패러프레이즈하세요.

이 실행에서는 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`를 읽고 따르세요.

구성 소스. 이 저장소 상대 경로는 같은 대상 저장소에 커밋되어 있을 때만 넣으세요. 그렇지 않으면 구성된 값을 패러프레이즈하세요. 플러그인 소스나 캐시 경로는 절대 쓰지 마세요.

```text
{{BENNY_CONFIG_PATH}}
```

트리거:

```json
{
	"source_channel_id": "{{SLACK_CHANNEL_ID}}",
	"message_ts": "{{SLACK_MESSAGE_TS}}",
	"thread_ts": "{{SLACK_THREAD_TS_OR_EMPTY}}"
}
```

생성 의도는 이것을 구성된 소스 Slack 채널의 새 최상위 보고서로 설명해야 합니다.

소스 채널과 루트 스레드 타임스탬프는 불변으로 취급하세요. 둘 중 하나라도 없거나 구성과 맞지 않으면, 게시하거나 이슈 추적기에 쓰지 말고 멈추세요.

커밋된 운영 파일이 분류, 첨부 검토, 원인 추적, 라우팅, 중복 확인, 추적기 쓰기, 최종 판정을 담당합니다. 진행 메시지는 게시하지 마세요. 소스 채널에 루트 메시지를 절대 게시하지 마세요.

Slack에 게시하는 주체는 코디네이터뿐입니다. 위임된 워커는 읽기 전용이어야 하고, 발견 사항만 반환해야 하며, 모든 Slack 쓰기 동작에 대한 명시적 금지를 받아야 합니다.

하나의 판정을 구성된 마커 정확히 하나로 끝내세요.

```text
[benny:bug]
[benny:performance]
[benny:other]
```

버그나 성능 마커에는 `tracker=<URL>`을 덧붙일 수 있습니다.
