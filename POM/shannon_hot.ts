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
    await this.page.goto("https://e.kakao.com/item/", {
      waitUntil: "domcontentloaded",
    }); // 이모티콘샵 진입(메뉴가 보일 정도까지만 빠르게 로드)
    await this.page.getByRole("link", { name: "인기" }).click(); // 상단 메뉴에서 '인기' 탭을 클릭해 hot 페이지로 이동
    await this.page.waitForURL(/\/item\/hot/); // URL이 /item/hot 으로 바뀌었는지로 진입 완료를 확인
    await this.page.waitForLoadState("networkidle"); // hot 페이지의 주요 요청이 끝날 때까지 한 번 더 안정화 대기
  } // 진입 메서드 끝

  async expectHotPageVisible() {
    // 인기 페이지가 잘 보이는지 검증한다
    await expect(this.hotBannerTextImage()).toBeVisible(); // 성공 기준: "배너 텍스트 이미지"가 화면에 보여야 한다
    await expect(this.page.locator('a[href^="/t/"]').first()).toBeVisible(); // 보조 기준: 인기 리스트의 첫 상품 링크가 화면에 보여야 한다
  } // 검증 메서드 끝

  async gotoTop1ProductAndCacheTitle() {
    // 인기 1위 상품으로 진입하고 타이틀을 캐시해서 반환한다
    const top1Item = this.page
      .locator('li:has(span.txt_num.num_highlight:text("1"))')
      .first(); // 번호 1(하이라이트)로 1위 랭킹 li를 찾는다
    const titleEl = top1Item.locator("span.txt_tit").first(); // 1위 li 안에서 상품 타이틀 요소(span.txt_tit)만 찾는다
    const titleText = (await titleEl.innerText()).replace(/\s+/g, " ").trim(); // 타이틀 텍스트를 공백/줄바꿈 정리해서 캐시한다
    await top1Item.locator('a[href^="/t/"]').first().click(); // 1위 상품 링크를 클릭해서 상세페이지로 진입한다
    await this.page.waitForURL(/\/t\//, { timeout: 15000 }); // URL 패턴이 /t/ 인 상세페이지로 바뀔 때까지 기다린다(타임아웃 명시)
    return titleText; // 바깥 테스트/메서드에서 사용할 수 있도록 타이틀을 반환한다
  } // 1위 상품 진입 + 타이틀 캐시 메서드 끝

  async expectTop1DetailMatches(titleFromList: string) {
    // 리스트에서 본 1위 타이틀과 상세페이지 타이틀이 같은지 검증한다
    await expect(
      this.page.getByRole("heading", { level: 3, name: titleFromList }),
    ).toBeVisible(); // 성공 기준: 상세페이지의 상품 타이틀(heading)이 리스트의 상품명과 일치해야 한다
  } // 상세페이지 타이틀 일치 검증 메서드 끝

  async scrollUntilRankVisible(rank: number) {
    // 원하는 랭킹 번호가 화면/DOM에 나타날 때까지 스크롤한다
    const rankText = String(rank); // 숫자 랭킹을 텍스트로 바꾼다
    const rankLocator = this.page.locator(
      `span.txt_num:has-text("${rankText}")`,
    ); // 리스트의 랭킹 번호(span.txt_num) 요소를 찾는다
    for (let i = 0; i < 40; i++) {
      // 무한 스크롤 방지를 위해 시도 횟수 상한을 둔다
      if ((await rankLocator.count()) > 0) return; // 랭킹 번호가 보이면(존재하면) 즉시 종료한다
      await this.page.mouse.wheel(0, 1400); // 아래로 스크롤한다
      await this.page.waitForTimeout(150); // 다음 렌더/로딩을 위해 짧게 대기한다
    } // 스크롤 반복 끝
    await expect(rankLocator).toHaveCount(1, { timeout: 1000 }); // 마지막으로도 못 찾으면 명확히 실패시킨다
  } // 랭킹 스크롤 유틸 끝

  async gotoTop500ProductAndCacheTitle() {
    // 인기 500위 상품으로 진입하고 타이틀을 캐시해서 반환한다
    await this.scrollUntilRankVisible(500); // 500위가 나타날 때까지 스크롤한다
    const top500Item = this.page
      .locator('li:has(span.txt_num:has-text("500"))')
      .first(); // 번호 500이 들어있는 랭킹 li 요소를 찾는다
    await top500Item.scrollIntoViewIfNeeded(); // 500위 요소가 화면에 오도록 스크롤을 맞춘다
    const titleEl = top500Item.locator("span.txt_tit").first(); // 500위 li 안에서 상품 타이틀 요소(span.txt_tit)만 찾는다
    const titleText = (await titleEl.innerText()).replace(/\s+/g, " ").trim(); // 타이틀 텍스트를 공백/줄바꿈 정리해서 캐시한다
    await top500Item.locator('a[href^="/t/"]').first().click(); // 500위 상품 링크를 클릭해서 상세페이지로 진입한다
    await this.page.waitForURL(/\/t\//, { timeout: 15000 }); // URL 패턴이 /t/ 인 상세페이지로 바뀔 때까지 기다린다
    return titleText; // 바깥 테스트/메서드에서 사용할 수 있도록 타이틀을 반환한다
  } // 500위 상품 진입 + 타이틀 캐시 메서드 끝

  async expectTop500DetailMatches(titleFromList: string) {
    // 리스트에서 본 500위 타이틀과 상세페이지 타이틀이 같은지 검증한다
    await expect(this.page.getByRole("heading", { level: 3 })).toContainText(
      titleFromList,
    ); // 성공 기준: 상세페이지의 상품 타이틀(heading)에 리스트 상품명이 포함돼야 한다
  } // 500위 상세페이지 타이틀 일치 검증 메서드 끝

  async runHotTopsFlow() {
    // spec에서 한 줄로 호출할 수 있게 전체 플로우를 묶는다
    await this.gotoHotPage(); // 인기 탭을 통해 hot 페이지로 진입한다
    await this.expectHotPageVisible(); // 인기 페이지가 정상 노출되는지 확인한다
    const top1Title = await this.gotoTop1ProductAndCacheTitle(); // 1위 상품으로 들어가며 상품명을 캐시한다
    await this.expectTop1DetailMatches(top1Title); // 상세에서 캐시한 상품명이 보이는지로 진입을 검증한다
    await this.gotoHotPage(); // 상세에서 다시 상단 '인기' 탭을 눌러 hot 목록으로 복귀한다
    const top500Title = await this.gotoTop500ProductAndCacheTitle(); // 500위 상품으로 들어가며 상품명을 캐시한다
    await this.expectTop500DetailMatches(top500Title); // 상세에서 캐시한 상품명이 보이는지로 500위 진입을 검증한다
  } // 통합 플로우 메서드 끝
} // 클래스 끝
