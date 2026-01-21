import { test, expect } from '@playwright/test';

test('네이버 접속 화면 보기', async ({ page }) => {

  await page.goto('https://www.naver.com/');
  await page.getByRole('combobox', { name: '검색어를 입력해 주세요' }).fill('이모티콘샵');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('a').filter({ hasText: /^카카오 이모티콘샵$/ }).click();
  const page1 = await page1Promise;
});