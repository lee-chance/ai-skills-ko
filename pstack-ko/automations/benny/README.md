# benny

benny는 Slack 이슈 보고서를 위한 두 개의 Cursor 자동화를 제공합니다. 하나는 각 보고서를 분류합니다. 다른 하나는 확인된 버그를 재현하고 작은 초안 수정을 준비할 수 있습니다.

이 디렉토리의 파일들은 휴면 설정 및 자동화 소스입니다. 슬래시 스킬로 나타나지 않습니다.

## 설정하기

1. Cursor를 [`FOR_AGENTS.md`](./FOR_AGENTS.md)에 가리키고 타깃 리포지토리를 명명.
2. setup이 이 전체 디렉토리를 타깃의 `.cursor/automations/benny/`로 병합하도록 하세요. 대상 전용 파일을 보존하고 로컬 편집을 덮어쓰는 대신 충돌을 검토해야 합니다.
3. setup이 공유 종속성을 위해 타깃 리포지토리의 `.cursor/settings.json`에서 pstack을 활성화하도록 하세요:

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. 사용자 소유 구성을 복사된 팩 외부에 유지하세요. 예를 들어 `.cursor/benny/`에. [`configuration.example.yaml`](./templates/configuration.example.yaml)과 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md)를 적응시키세요.
5. 어느 자동화든 활성화하기 전에 `.cursor/settings.json`, `.cursor/automations/benny/`, 비밀 없는 구성을 커밋.
6. 각 새 자동화 초안을 검토하거나 에디터에서 기존 자동화를 업데이트. 그 다음 무해한 테스트 보고서를 보내고 모든 소스 채널 게시가 원래 스레드에 머물러 있는지 확인하세요.
