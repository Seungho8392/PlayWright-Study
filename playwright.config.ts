import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // 1. 리포터 설정 (항상 열기)
  reporter: [
    ['html', { open: 'always' }], 
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list'],
    ['./slack-reporter.js', {}]
  ],

  use: {
    // 1. 뷰포트 및 브라우저 기본 설정
    viewport: { width: 2560, height: 1440 },
    headless: true,  // 💡 화면을 보려면 false로 두는 게 좋습니다! (기존 true였음)
    // video: 'retain-on-failure',   // 실패 시 영상 저장!
    video: 'on',
    screenshot: 'only-on-failure', // 실패 시 스크린샷 찰칵!
    // 2. 권한 설정
    permissions: ['notifications', 'geolocation'],
    geolocation: { longitude: 127.1086, latitude: 37.4012 },

    // 3. 브라우저 실행 옵션
    launchOptions: {
      slowMo: 800,
      args: [
        '--start-maximized',
        '--disable-notifications'
      ]
    } // 👈 여기서 launchOptions가 닫혀야 합니다!
  }, // 👈 여기서 use가 닫혀야 합니다!

  // 4. 프로젝트 설정 (use 바깥으로 나와야 함)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});