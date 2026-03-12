### Playwright E2E Automation – e.kakao.com

Playwright 기반으로 e.kakao.com 주요 화면을 대상으로 E2E 테스트 자동화를 실습한 팀 프로젝트입니다.

본 프로젝트는 Playwright를 처음 사용하는 팀원들이 테스트 자동화 프레임워크에 익숙해지고,
Git 협업 및 Page Object Model(POM) 구조를 학습하는 것을 목표로 진행되었습니다.

또한 테스트 결과를 Allure Report로 시각화하고, Slack Bot과 연동하여 테스트 결과를 알림으로 전달하는 환경을 구성했습니다.

---
### Project Goal

이 프로젝트는 다음과 같은 목표로 진행되었습니다.

- Playwright 테스트 자동화 프레임워크 학습

- Page Object Model(POM) 구조 실습

- Git 기반 협업 경험

- 테스트 결과 Allure Report 시각화

- Slack Bot 연동을 통한 테스트 결과 알림

실제 서비스 화면을 기반으로 테스트 시나리오를 구성하여 실무와 유사한 테스트 구조를 경험하는 데 중점을 두었습니다.

----
### Target Service

테스트 대상 서비스

👉 https://e.kakao.com/

카카오 이모티콘 서비스의 주요 탭을 기준으로 테스트를 진행했습니다.

---
### Test Scope

e.kakao.com 서비스는 로그인 시 모바일 기반 2차 인증이 필요합니다.
자동화 테스트 환경에서 해당 인증을 처리하기 어려워 로그인 이후 기능은 테스트 범위에서 제외했습니다.

따라서 본 프로젝트에서는 비로그인 상태에서 접근 가능한 주요 기능과 UI 동작을 중심으로 테스트를 구성했습니다.

주요 테스트 범위

- 메인 페이지 진입

- 탭 이동 및 페이지 로딩

- 이모티콘 목록 노출

- UI 요소 확인

- 기본적인 사용자 탐색 흐름 검증

----
### Team Members
|Name|담당 탭|
|---|---|
|장용준|	홈|
|이승호|	신규|
|정윤하|	인기|
|김건녕|	스타일|

각 팀원이 e.kakao.com의 주요 탭을 하나씩 맡아 테스트 시나리오를 설계하고 자동화 테스트를 구현했습니다.

----
### Tech Stack

- Test Framework
  - Playwright (TypeScript)

- Test Structure
  - Page Object Model (POM)

- Reporting
  - Allure Report

- Notification
  - Slack Bot

- Version Control
  - Git / GitHub

---
### Project Structure

```bash
Playwright-Study
│
├── tests
│   ├── harry_home.spec.ts
│   ├── woody_new.spec.ts
│   ├── shannon_hot.spec.ts
│   ├── rex_style.spec.ts
│   ├── main_harry.spec.ts # 메인 합치기 연습용 파일
│   ├── main_woody.spec.ts # 메인 합치기 연습용 파일
│   ├── main_shannon.spec.ts # 메인 합치기 연습용 파일
│   ├── main_rex.spec.ts # 메인 합치기 연습용 파일
│   └── main.spec.ts # 통합된 메인 파일
│
├── POM # 보통 pages라 하지만, 스터디를 위해 보다 직관적으로 폴더명을 명명함
│   ├── harry_home.ts
│   ├── woody_new.ts
│   ├── shannon_hot.ts
│   └── rex_style.ts
│
├── utils
│
├── playwright.config.ts
│
└── README.md
```

Page Object Model 구조를 적용하여

- Page Object (pages)

- Test Script (tests)

를 분리해 테스트 코드의 재사용성과 유지보수성을 높였습니다.

---
### Test Architecture

본 프로젝트는 Page Object Model(POM) 구조를 기반으로 테스트 코드를 설계했습니다.

테스트 코드의 재사용성과 유지보수성을 높이기 위해 Page Object를 class 형태로 구성했으며,
각 페이지의 기능을 하나의 객체로 관리하도록 구현했습니다.

예시 구조
``` TypeScript
class HomePage {
  constructor(private page: Page) {}

  async goHome() {
    await this.page.goto('/');
  }

  async clickEmoji() {
    await this.page.click('...');
  }
}
```

이러한 구조를 통해

- 페이지별 기능을 객체 단위로 관리
- 테스트 코드에서 재사용 가능
- UI 변경 시 Page Object만 수정하면 전체 테스트에 반영
할 수 있도록 설계했습니다.

---
### POM을 Class로 구성한 이유

Page Object Model을 class 형태로 구성한 이유는 다음과 같습니다.

1. 코드 재사용성
페이지의 기능을 class 내부 메서드로 관리하면 여러 테스트에서 동일한 동작을 재사용할 수 있습니다.

예시
``` TypeScript
await homePage.goHome()
await homePage.clickEmoji()
```

2. 유지보수 용이성
UI 요소가 변경되더라도 Page Object 내부의 locator만 수정하면 모든 테스트 코드에 자동으로 반영됩니다.

3. 역할 분리
테스트 코드와 페이지 로직을 분리하여
- Test Code → 테스트 시나리오
- Page Object → 페이지 동작
으로 책임을 명확하게 나눌 수 있습니다.

---
### Test Execution Structure

본 프로젝트에서는 여러 테스트를 한 번에 실행할 수 있도록 main.spec.ts를 구성했습니다.

각 Page Object에는 여러 `async` 동작이 존재하지만
테스트 코드의 가독성과 유지보수를 위해 Page 단위 실행 함수로 한 번 더 래핑했습니다.

예시 구조

Page Object
``` TypeScript
class HomePage {
  async goHome() {}

  async checkBanner() {}

  async checkEmojiList() {}
}
```

Page 실행 함수

``` TypeScript
export async function runHomeTest(page: Page) {
  const homePage = new HomePage(page)

  await homePage.goHome()
  await homePage.checkBanner()
  await homePage.checkEmojiList()
}
```
main.spec.ts

``` TypeScript
test('전체 테스트 실행', async ({ page }) => {
  await runHomeTest(page)
  await runNewTest(page)
  await runPopularTest(page)
  await runStyleTest(page)
})
```

----
### 이 구조를 사용한 이유
1. spec 파일 단순화

spec.ts 파일에서는 테스트 시나리오 호출만 담당하도록 설계했습니다.

`await runHomeTest(page)`

이렇게 하면 테스트 흐름이 한눈에 들어옵니다.

2. 유지보수 편의성

각 테스트 로직은 페이지 실행 함수 내부에서 관리되므로
spec 파일을 수정하지 않고도 테스트 로직을 개선할 수 있습니다.

3. 협업 시 충돌 최소화

팀원들이 각 페이지 테스트 파일을 독립적으로 수정할 수 있어
Git 협업 시 충돌을 줄일 수 있습니다.


----
### Test Execution

전체 테스트 실행
`npx playwright test`

특정 테스트 실행
`npx playwright test tests/home`

----
### Allure Report

테스트 결과는 Allure Report를 통해 확인할 수 있습니다.
```bash
allure generate
allure open
```

Allure Report에서는 다음 정보를 확인할 수 있습니다.

- 테스트 실행 결과
- 실패 테스트 케이스
- 테스트 단계
- 실행 시간

----
### Slack Notification

테스트 실행 후 결과를 Slack Bot으로 자동 전송하도록 구성했습니다.

이를 통해
- 테스트 실행 결과 공유
- 실패 테스트 알림
- 팀 협업 시 빠른 피드백
이 가능하도록 환경을 구성했습니다.

----
### What We Learned

이번 프로젝트를 통해 다음을 경험했습니다.

- Playwright 기반 E2E 테스트 작성
- Page Object Model 구조 설계
- Git을 활용한 협업 방식
- 테스트 리포트(Allure) 활용
- Slack Bot을 통한 테스트 알림 자동화
