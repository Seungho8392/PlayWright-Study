import { test } from "@playwright/test"; // Playwright 테스트 러너만 사용(검증은 POM으로 이동)
import { EmoticonHot } from "../POM/shannon_hot"; // 인기 페이지용 POM 클래스 가져오기

test("카카오 이모티콘샵 인기 1위 상품 진입/상세 검증", async ({ page }) => {
  // 인기 페이지 진입 후 1위 상품 상세까지 흐름을 확인한다
  const hot = new EmoticonHot(page); // POM 인스턴스를 생성해서 page를 위임한다
  await hot.gotoHotPage(); // 인기 페이지로 진입한다
  await hot.expectHotPageVisible(); // 상단 배너/리스트로 인기 페이지 노출을 검증한다
  const top1Title = await hot.gotoTop1ProductAndCacheTitle(); // 1위(숫자 1) 상품 타이틀을 캐시하고 상세페이지로 진입한다
  await hot.expectTop1DetailMatches(top1Title); // 상세페이지에서 캐시한 타이틀이 보이는지로 진입 성공을 검증한다
});
