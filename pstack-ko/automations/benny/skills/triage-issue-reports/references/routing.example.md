# 라우팅 맵 예시

이 파일을 `.cursor/automations/benny/` 밖으로 복사하세요. 예를 들어 `.cursor/benny/routing.md`로 복사하고, 모든 플레이스홀더를 바꾸세요. `routing.map_path`가 복사본을 가리키게 하세요. 팩 새로 고침이 그것을 덮어쓰면 안 됩니다.

분류 스킬은 이것을 데이터로 다룹니다. 경로에는 보고서나 원인 추적에서 온 증거가 필요합니다. 키워드가 맞는 것만으로는 충분하지 않습니다.

```yaml
routes:
  - name: "billing-example"
    match:
      product_areas:
        - "billing-area-placeholder"
      code_paths:
        - "billing-code-path-placeholder"
      error_signatures:
        - "billing-error-placeholder"
    destination:
      slack_channel: "billing-channel-placeholder"
      tracker_team: "billing-team-placeholder"
    owners:
      - "billing-owner-placeholder"
    allow_feature_owner_ping: false

  - name: "desktop-example"
    match:
      product_areas:
        - "desktop-area-placeholder"
      code_paths:
        - "desktop-code-path-placeholder"
      error_signatures:
        - "desktop-error-placeholder"
    destination:
      slack_channel: "desktop-channel-placeholder"
      tracker_team: "desktop-team-placeholder"
    owners:
      - "desktop-owner-placeholder"
    allow_feature_owner_ping: false

fallback:
  destination: ""
  owners: []
  allow_feature_owner_ping: false

ping_policy:
  default: "off"
  allow:
    - "configured-feature-owner"
    - "confirmed-regression-author"
  deny:
    - "broad-on-call-group"
    - "unverified-owner"
```

## 규칙

- 맞지 않는 보고서를 모두 받는 팀이 없다면 `fallback.destination`은 비워 두세요.
- 안정적인 제품 영역, 코드 경로, 오류 시그니처를 사용하세요.
- 공개될 복사본에 비공개 데이터를 넣지 마세요.
- 공개될 예시에 가공하지 않은 사용자 ID나 채널 ID를 붙여 넣지 마세요.
- 대상 팀이 동의하기 전에는 기능 소유자 핑을 꺼 두세요.
- 재라우팅은 보고자에게 어디로 가면 되는지만 알려 줍니다. 자동화는 교차 게시하지 않습니다.
