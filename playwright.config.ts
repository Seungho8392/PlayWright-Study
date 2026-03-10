import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
<<<<<<< HEAD
  reporter: [['html', { open: 'always' }]],
=======

// 1. 리포터 설정 (여기로 이동!)
reporter: [['html', { open: 'never' }]],
>>>>>>> ad52935e26d6ada20f61db26accfb1340a0f3d47
  
  use: {
    // 1. 뷰포트 및 브라우저 기본 설정
    viewport: { width: 2560, height: 1440 },
    headless: true,   // 브라우저 실행 화면 보기
    video: 'on',       // 테스트 실패/성공 시 영상 저장

    // 2. 권한 설정 (팝업 방지 및 위치 고정)
    permissions: ['notifications', 'geolocation'],
    geolocation: { longitude: 127.1086, latitude: 37.4012 },

    // 3. 브라우저 실행 옵션
    launchOptions: {
      slowMo: 800,      // 동작 간격 조절
      args: [
        '--start-maximized',       // 창 최대화 실행
        '--disable-notifications'  // 알림 차단
      ]
      
    }
  },
});