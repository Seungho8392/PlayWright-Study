import { Page, expect } from '@playwright/test';

export class Rex {
  readonly page: Page;

  // 1. 실행할 섹션 목록
  readonly sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ✅ [추가] 스타일 페이지로 이동하는 전용 메서드
   */
  async goToStylePage() {
    console.log('🚚 스타일 카테고리 페이지로 이동 중...');
    await this.page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000); // 안정적인 로딩을 위한 대기
  }

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
   * ✅ 섹션 탐색 및 클릭
   */
  async navigateToSection(sectionName: string) {
    console.log(`🔍 ${sectionName} 섹션 찾는 중...`);
    const tab = this.page.locator(`a:has-text("${sectionName}"), li:has-text("${sectionName}")`).last();

    try {
      await tab.waitFor({ state: 'attached', timeout: 5000 });
      console.log(`✨ ${sectionName} 섹션 클릭 시도!`);
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
   * ✅ 상품 랜덤 클릭
   */
  async clickRandomProduct(cycleName: string, sectionName: string) {
    console.log(`🔍 [${cycleName}] 상품 리스트 갱신 확인 중...`);
    await this.page.waitForLoadState('domcontentloaded');
    
    const productLinks = this.page.locator('ul[class*="list_emoticon"] li a, .item_list li a, a[href*="/t/"], a[href*="/item/"]');

    await expect(async () => {
      const currentCount = await productLinks.count();
      console.log(`📊 [${cycleName}] 발견된 상품 수: ${currentCount}개`);
      expect(currentCount).toBeGreaterThan(0);
    }).toPass({ timeout: 15000, intervals: [1000] });

    const totalCount = await productLinks.count();
    const randomIndex = Math.floor(Math.random() * Math.min(totalCount - 1, 15)) + 1;
    const targetProduct = productLinks.nth(randomIndex);

    console.log(`🎯 [${cycleName}] ${randomIndex + 1}번째 상품 클릭 시도`);
    await targetProduct.scrollIntoViewIfNeeded();

    try {
      const navigationPromise = this.page.waitForURL(/\/(item|t)\//, { timeout: 15000 });
      await Promise.all([navigationPromise, targetProduct.click({ force: true })]);
      console.log(`✅ [${cycleName}] 상세 페이지 진입 성공`);
    } catch (error) {
      console.log(`⚠️ [${cycleName}] 클릭 실패 재시도 중...`);
      await this.page.waitForURL(/\/(item|t)\//, { timeout: 10000 });
    }
  }

  /**
   * ✅ 로그인 확인 후 스타일 페이지로 복귀
   */
  async checkLoginAndReturn(cycleName: string) {
    const actionButton = this.page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
    await actionButton.waitFor({ state: 'visible', timeout: 15000 });
    await actionButton.click();
    
    await this.page.waitForURL(/accounts\.kakao\.com/, { timeout: 20000 });
    console.log(`🔐 [${cycleName}] 로그인 페이지 진입`);

    // [수정] 하드코딩된 URL 대신 클래스 내부 메서드 호출
    await this.goToStylePage();
  }
}