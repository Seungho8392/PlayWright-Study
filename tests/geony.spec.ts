import { test } from '@playwright/test';
import { Rex } from '../POM/rex_pom';

test('카카오 이모티콘 샵 통합 테스트 실행', async ({ page }) => {
    const rex = new Rex(page);

    // 1. 초기 메인 페이지 진입
    await page.goto('https://e.kakao.com/', { waitUntil: 'networkidle' });
    test.setTimeout(120000);

    // 2. POM 메서드를 통해 스타일 페이지로 이동
    await rex.goToStylePage();

    // 3. Rex 클래스에게 모든 실행 권한을 위임
    await rex.runEmoticonTest();
});