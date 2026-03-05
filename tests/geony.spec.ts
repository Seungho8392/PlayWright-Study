import { test, expect } from '@playwright/test';

// 브라우저 설정: 전체 화면 및 팝업 차단
test.use({
  viewport: null,
  launchOptions: {
    slowMo: 800,
    args: [
      '--start-maximized',
      '--disable-notifications',
      '--disable-features=DialMediaRouteProvider',
    ]
    
  }
});

test('스타일 카테고리 4사이클 테스트 (최종 안정화 및 타임아웃 해결)', async ({ page }) => {
  // 전체 테스트 시간을 2분으로 늘립니다 (여유 있는 확인을 위해)
  test.setTimeout(120000);
  
  const checkLoginAndReturn = async (cycleName: string) => {
    const actionButton = page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
    await actionButton.waitFor({ state: 'visible', timeout: 15000 });
    
    console.log(`👆 [${cycleName}] 버튼 확인됨, 클릭 시도`);
    await page.waitForTimeout(1000);
    await actionButton.click();
    
    await page.waitForURL(/accounts\.kakao\.com/, { timeout: 20000 });
    console.log(`🔐 [${cycleName}] 로그인 페이지 진입`);
    await page.waitForTimeout(1500);

    console.log(`🔄 [${cycleName}] 스타일 페이지로 돌아갑니다...`);
    await page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  };

  const navigateToSection = async (sectionName: string) => {
    let isVisible = false;
    let scrollAttempts = 0;
    const sectionRegex = new RegExp(sectionName.replace('#', ''), 'i');
    
    while (!isVisible && scrollAttempts < 15) {
      const header = page.getByRole('link', { name: sectionRegex }).first();
      
      if (await header.isVisible()) {
        await header.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        isVisible = true;
        console.log(`✨ ${sectionName} 섹션 클릭!`);
        await header.click();
        
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // 페이지 이동 후 충분한 로딩 대기
      } else {
        console.log(`📜 ${sectionName} 찾는 중... 스크롤`);
        await page.mouse.wheel(0, 800);
        await page.waitForTimeout(1000);
        scrollAttempts++;
      }
    }
  };

  const clickRandomProduct = async (cycleName: string) => {
    // 상품 링크 로케이터
    const productLinks = page.locator('a[href*="/t/"], a[href*="/item/"]').filter({
      has: page.locator('img')
    });

    console.log(`🔍 [${cycleName}] 상품 리스트 로딩 확인 중...`);

    // 상품이 로드될 때까지 반복해서 시도 (toPass)
    await expect(async () => {
      const currentCount = await productLinks.count();
      if (currentCount < 3) {
        // 상품이 없으면 동적 로딩을 위해 스크롤을 위아래로 살짝 흔듦
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(1000);
        await page.mouse.wheel(0, -200);
      }
      expect(currentCount).toBeGreaterThan(2);
    }).toPass({ timeout: 20000, intervals: [1000] });

    const totalCount = await productLinks.count();
    const randomIndex = Math.floor(Math.random() * Math.min(totalCount, 10));
    const targetProduct = productLinks.nth(randomIndex);

    console.log(`🎯 [${cycleName}] 총 ${totalCount}개 중 ${randomIndex + 1}번째 상품 클릭`);
    
    await targetProduct.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await targetProduct.click();
    
    await page.waitForURL(/\/t\/|\/item\//, { timeout: 20000 });
  };

  // --- 메인 흐름 ---
  await page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });

  const sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i];
    console.log(`\n🚀 [Cycle ${i + 1}] ${sectionName} 시작`);
    
    await navigateToSection(sectionName);
    await clickRandomProduct(`Cycle ${i + 1}`);
    await checkLoginAndReturn(`Cycle ${i + 1}`);
  }

  console.log('\n🎉 모든 4사이클 테스트가 성공적으로 완료되었습니다!');
});
