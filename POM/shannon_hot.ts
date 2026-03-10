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


  async gotoTop1ProductAndCacheTitle() { // 인기 1위 상품으로 진입하고 타이틀을 캐시해서 반환한다
    const top1Item = this.page.locator('li:has(span.txt_num.num_highlight:text("1"))').first(); // 번호 1이 들어있는 랭킹 li 요소를 찾는다
    const titleLink = top1Item.locator('a[href^="/t/"]').first(); // 해당 랭킹 li 안에서 첫 번째 상품 타이틀 링크를 찾는다
    const rawTitleText = (await top1Item.locator("strong").first().innerText()).trim(); // 리스트에서 보이는 타이틀 영역(뱃지 포함 가능)을 가져온다
    const titleText = rawTitleText.split(/\r?\n/).map((t) => t.trim()).filter((t) => t && t !== "NEW")[0] ?? rawTitleText; // NEW 같은 뱃지를 제거하고 "상품명"만 정규화해서 캐시한다
    await titleLink.click(); // 캐시한 타이틀을 가진 1위 상품을 클릭해서 상세페이지로 진입한다
    await this.page.waitForURL(/\/t\//); // URL 패턴이 /t/ 인 상세페이지로 바뀔 때까지 기다린다
    return titleText; // 바깥 테스트/메서드에서 사용할 수 있도록 타이틀을 반환한다
  } // 1위 상품 진입 + 타이틀 캐시 메서드 끝

  async expectTop1DetailMatches(titleFromList: string) { // 리스트에서 본 1위 타이틀과 상세페이지 타이틀이 같은지 검증한다
    await expect(this.page.getByRole("heading", { level: 3, name: titleFromList })).toBeVisible(); // 성공 기준: 상세페이지의 상품 타이틀(heading)이 리스트의 상품명과 일치해야 한다
  } // 상세페이지 타이틀 일치 검증 메서드 끝
} // 클래스 끝
