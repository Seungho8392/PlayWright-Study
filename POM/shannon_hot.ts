import { Page, expect } from "@playwright/test"; // POM에서 Page 타입/검증(expect) 사용

export class EmoticonHot {
  // 카카오 이모티콘샵 "인기" 페이지 전용 POM 클래스
  readonly page: Page; // 외부에서 주입받은 페이지 객체 보관

  constructor(page: Page) {
    // 테스트에서 생성 시 page를 주입받는다
    this.page = page; // 주입받은 page를 클래스 멤버로 저장한다
  } // 생성자 끝

  hotBannerTextImage() {
    // 상단 배너(텍스트가 이미지로 제공됨) 로케이터를 반환한다
    return this.page.getByRole("img", { name: "배너 텍스트 이미지" }); // 접근성 이름(alt)으로 배너 이미지를 찾는다
  } // 로케이터 헬퍼 끝

  async gotoHotPage() {
    // 인기 페이지로 진입한다
    await this.page.goto("https://e.kakao.com/item/hot", {
      waitUntil: "networkidle",
    }); // 인기 페이지로 이동하고 네트워크 안정 상태까지 기다린다
  } // 진입 메서드 끝

  async expectHotPageVisible() {
    // 인기 페이지가 잘 보이는지 검증한다
    await expect(this.hotBannerTextImage()).toBeVisible(); // 성공 기준: "배너 텍스트 이미지"가 화면에 보여야 한다
    await expect(this.page.locator('a[href^="/t/"]').first()).toBeVisible(); // 보조 기준: 인기 리스트의 첫 상품 링크가 화면에 보여야 한다
  } // 검증 메서드 끝
} // 클래스 끝
