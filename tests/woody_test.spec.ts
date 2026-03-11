import { test, expect } from '@playwright/test';
import { KakaoEmoticonPage_New } from '../POM/woody_pom.ts';

test('카카오 이모티콘 샵 신규 이동 테스트', async ({ page }) => {
    // 1. 전문가(클래스) 소환
    const woody = new KakaoEmoticonPage_New(page);

    // 2. 메인 접속
    await page.goto('https://e.kakao.com/item/', { waitUntil: 'networkidle' });

    // 📢 3. 시나리오 한 줄 호출
    await woody.runNewFlow();

    // 4. 이모티콘 홈으로 이동
    await page.goto('https://e.kakao.com/', { waitUntil: 'networkidle' });
});