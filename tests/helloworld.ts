// 모두 보시고 삭제해주세요
import { test, expect } from '@playwright/test';

test('네이버 접속 화면 보기', async ({ page }) => {
  // 네이버로 이동
  await page.goto('https://www.naver.com');
  
  // 잠시 화면을 볼 수 있게 3초만 대기 (원래는 안 써도 되지만 확인용!)
  await page.waitForTimeout(3000);
  
  // 타이틀 확인
  await expect(page).toHaveTitle(/NAVER/);
});