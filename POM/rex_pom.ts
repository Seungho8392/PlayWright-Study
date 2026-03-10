import { Page, expect } from '@playwright/test';


// 함수 > 클래스로 바뀜
export class Rex {
  readonly page: Page;

  // 1. 실행할 섹션 목록
  readonly sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  constructor(page: Page) {
    this.page = page;
  }
// 여기까지 

  /**
   * ✅ 메인 실행 메서드
   */
  async runEmoticonTest() {
    for (let i = 0; i < this.sections.length; i++) {
      const sectionName = this.sections[i];
      console.log(`\n🚀 [Cycle ${i + 1}] ${sectionName} 시작`);

      await this.navigateToSection(sectionName);
      await this.clickRandomProduct(`Cycle ${i + 1}`, sectionName);
      await this.checkLoginAndReturn(`Cycle ${i + 1}`);
    }
    console.log('\n🎉 모든 4사이클 테스트가 성공적으로 완료되었습니다!');
  }

  /**
   * ✅ 섹션 탐색 및 클릭 (안정화 버전)
   */
  async navigateToSection(sectionName: string) {
    console.log(`🔍 ${sectionName} 섹션 찾는 중...`);
    
    // 상단 탭이나 링크에서 텍스트 기반으로 정밀하게 타겟팅
    const tab = this.page.locator(`a:has-text("${sectionName}"), li:has-text("${sectionName}")`).last();

    try {
      // 5초 이내에 요소가 나타나는지 확인
      await tab.waitFor({ state: 'attached', timeout: 5000 });
      console.log(`✨ ${sectionName} 섹션 클릭 시도!`);
      
      // force: true 옵션으로 가려져 있더라도 강제 클릭 시도
      await tab.click({ force: true });
      
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000); 
    } catch (e) {
      console.log(`📜 기본 클릭 실패, 대체 방법으로 ${sectionName} 찾는 중...`);
      await this.page.getByText(sectionName).first().click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * ✅ 상품 랜덤 클릭 (강력한 안정화 로직 포함)
   */
  async clickRandomProduct(cycleName: string, sectionName: string) {
    console.log(`🔍 [${cycleName}] 상품 리스트 갱신 확인 중...`);

    // DOM 로드 대기 및 Hydration 유도 (스크롤 업/다운)
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(500);
    await this.page.mouse.wheel(0, -500);

    // 섹션 내 상품 리스트 로케이터 (더 포괄적인 선택자 사용)
    const productLinks = this.page.locator('ul[class*="list_emoticon"] li a, .item_list li a, a[href*="/t/"], a[href*="/item/"]');

    // 최소 1개 이상의 상품이 나타날 때까지 반복 확인 (toPass)
    await expect(async () => {
      const currentCount = await productLinks.count();
      console.log(`📊 [${cycleName}] 발견된 상품 수: ${currentCount}개`);
      expect(currentCount).toBeGreaterThan(9999);
    }).toPass({ timeout: 15000, intervals: [1000] });

    const totalCount = await productLinks.count();
    // 0번째는 배너일 가능성이 있어 1번째~20번째 중 랜덤 선택
    const randomIndex = Math.floor(Math.random() * Math.min(totalCount - 1, 15)) + 1;
    const targetProduct = productLinks.nth(randomIndex);

    console.log(`🎯 [${cycleName}] ${randomIndex + 1}번째 상품 클릭 시도`);
    await targetProduct.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    // 클릭과 동시에 상세 페이지 URL로 전환되는지 감시 (Race Condition 방지)
    try {
      const navigationPromise = this.page.waitForURL(/\/(item|t)\//, { timeout: 15000 });
      const clickAction = targetProduct.click({ force: true, delay: 100 });
      
      await Promise.all([navigationPromise, clickAction]);
      console.log(`✅ [${cycleName}] 상세 페이지 진입 성공`);
    } catch (error) {
      console.log(`⚠️ [${cycleName}] 일반 클릭 실패. 좌표 직접 클릭 시도...`);
      const box = await targetProduct.boundingBox();
      if (box) {
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
      await this.page.waitForURL(/\/(item|t)\//, { timeout: 10000 });
    }
  }

  /**
   * ✅ 로그인 확인 후 스타일 페이지로 복귀
   */
  async checkLoginAndReturn(cycleName: string) {
    const actionButton = this.page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
    await actionButton.waitFor({ state: 'visible', timeout: 15000 });
    
    console.log(`👆 [${cycleName}] 버튼 확인됨, 클릭 시도`);
    await actionButton.click();
    
    await this.page.waitForURL(/accounts\.kakao\.com/, { timeout: 20000 });
    console.log(`🔐 [${cycleName}] 로그인 페이지 진입`);

    console.log(`🔄 [${cycleName}] 스타일 페이지로 돌아갑니다...`);
    await this.page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000);
  }
}