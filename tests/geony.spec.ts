// tests/main.spec.ts
import { test } from '@playwright/test';
import { Rex } from '../POM/rex_pom';


test.use({
  viewport: { width: 1920, height: 1080 },
  launchOptions: {
    slowMo: 700,
    args: ['--start-maximized', '--disable-notifications']
  }
});


test('카카오 이모티콘 샵 통합 테스트 실행', async ({ page }) => {
  const rex = new Rex(page);
  
  // 1. 초기 페이지 진입
  await page.goto('https://e.kakao.com/item/', { waitUntil: 'networkidle' });
  
  // 2. Rex 클래스에게 모든 실행 권한을 위임 (반복문 포함)
  await rex.runEmoticonTest();
});