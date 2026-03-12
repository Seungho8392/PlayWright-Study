import { test, Page, Locator, expect } from '@playwright/test';

// 1. 설계도 (클래스) - POM 파일
export class KakaoEmoticonPage_New {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }
    

    // 신규 탭 진입
    async clickNewTab1() {
        // 1. 신규 탭 클릭
        await this.page.getByRole('link', { name: '신규', exact: true }).click();
        
        // 2. 클래스 내부에서 직접 검증 (URL이 제대로 바뀌었는지)
        try { // 여기서 검증을 시도합니다. 실패하면 바로 catch로 점프!
            await expect(this.page).toHaveURL('https://e.kakao.com/item/new'); //해당 주소가 맞는지
            console.log(`✅ 신규 이동 완료: ${this.page.url()}`);
        } 
        catch  { // 위 expect가 실패했을 때만 이쪽으로 옵니다.
            throw new Error(`❌ 이동 실패! (현재 주소: ${this.page.url()})`); // new Error 이라는 변수를 새롭게 만들어서 현재 위치 추출 
        // 2초 대기
        }
        
        await this.page.waitForTimeout(2000);
    }


    // 첫번째 아이템 진입
    async clickNewTab2() {
        // 1. 신규 탭 클릭
        await test.step('첫 번째 이모티콘 동적 추출 및 검증', async () => {
            // 1. 클릭할 대상 찾기 및 텍스트 미리 저장
            // .txt_tit 또는 .tit_inner 등 이름이 들어있는 클래스를 가져옵니다.
            const firstEmoticon = this.page.locator('div.link_new').first();
            const expectedName = (await firstEmoticon.locator('.txt_tit').innerText()).trim();

            // 3. 클릭해서 상세 페이지 이동
            await firstEmoticon.click();

            try {
                await expect(this.page.locator('h2, h3', { hasText: expectedName }).first()).toBeVisible();
                console.log(`✅ '${expectedName}' 진입 성공`); // 2. [성공] 위에서 찾으면 이 줄이 실행됩니다.
            } 
            catch { // 3. 위에서 못 찾으면 바로 이쪽으로 점프
                throw new Error(`❌ '${expectedName}' 진입 실패 (현재: ${this.page.url()})`);
            }

            await this.page.waitForTimeout(2000);
        });
    }

    // spec에서 한 줄로 호출할 수 있게 전체 플로우를 묶는다
    async runNewFlow() {
        await this.clickNewTab1();
        await this.clickNewTab2();
    }
}