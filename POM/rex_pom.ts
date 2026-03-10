import { Page, expect } from '@playwright/test';


// 함수 > 클래스로 바뀜
export class Rex {
  readonly page: Page;

  // 1. 실행할 섹션 목록을 클래스 내부에 상수로 관리
  readonly sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  constructor(page: Page) {
    this.page = page;
  }
// 여기까지 

  /**
   * ✅ 메인 실행 메서드
   * 이 메서드가 호출되면 클래스 내부에 정의된 sections를 바탕으로 4사이클을 수행합니다.
   */
  async runEmoticonTest() {
    for (let i = 0; i < this.sections.length; i++) {
      const sectionName = this.sections[i];
      console.log(`\n🚀 [Cycle ${i + 1}] ${sectionName} 시작`);
      
      // 내부 메서드들을 순서대로 호출
      await this.navigateToSection(sectionName);
      await this.clickRandomProduct(`Cycle ${i + 1}`);
      await this.checkLoginAndReturn(`Cycle ${i + 1}`);
    }
    console.log('\n🎉 모든 테스트가 성공적으로 완료되었습니다!');
  }

  // --- 기존 로직 함수들 (수정 없이 그대로 유지) ---

  async checkLoginAndReturn(cycleName: string) {
    const actionButton = this.page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
    await actionButton.waitFor({ state: 'visible', timeout: 15000 });
    
    console.log(`👆 [${cycleName}] 버튼 확인됨, 클릭 시도`);
    await this.page.waitForTimeout(1000);
    await actionButton.click();
    
    await this.page.waitForURL(/accounts\.kakao\.com/, { timeout: 20000 });
    console.log(`🔐 [${cycleName}] 로그인 페이지 진입`);
    await this.page.waitForTimeout(1500);

    console.log(`🔄 [${cycleName}] 스타일 페이지로 돌아갑니다...`);
    await this.page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000);
  }

  async navigateToSection(sectionName: string) {
    let isVisible = false;
    let scrollAttempts = 0;
    const sectionRegex = new RegExp(sectionName.replace('#', ''), 'i');
    
    while (!isVisible && scrollAttempts < 15) {
      const header = this.page.getByRole('link', { name: sectionRegex }).first();
      
      if (await header.isVisible()) {
        await header.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        isVisible = true;
        console.log(`✨ ${sectionName} 섹션 클릭!`);
        await header.click();
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000); 
      } else {
        console.log(`📜 ${sectionName} 찾는 중... 스크롤`);
        await this.page.mouse.wheel(0, 800);
        await this.page.waitForTimeout(1000);
        scrollAttempts++;
      }
    }
  }

  async clickRandomProduct(cycleName: string) {
    const productLinks = this.page.locator('a[href*="/t/"], a[href*="/item/"]').filter({
      has: this.page.locator('img')
    });

    console.log(`🔍 [${cycleName}] 상품 리스트 로딩 확인 중...`);

    await expect(async () => {
      const currentCount = await productLinks.count();
      if (currentCount < 3) {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(1000);
        await this.page.mouse.wheel(0, -200);
      }
      expect(currentCount).toBeGreaterThan(2);
    }).toPass({ timeout: 20000, intervals: [1000] });

    const totalCount = await productLinks.count();
    const randomIndex = Math.floor(Math.random() * Math.min(totalCount, 10));
    const targetProduct = productLinks.nth(randomIndex);

    console.log(`🎯 [${cycleName}] 총 ${totalCount}개 중 ${randomIndex + 1}번째 상품 클릭`);
    
    await targetProduct.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    await targetProduct.click();
    
    await this.page.waitForURL(/\/t\/|\/item\//, { timeout: 20000 });
  }
}