import { test } from "@playwright/test"; // Playwright 테스트 러너만 사용(검증은 POM으로 이동)
import { EmoticonHot } from "../POM/shannon_hot"; // 인기 페이지용 POM 클래스 가져오기

test("카카오 이모티콘샵 인기 페이지가 잘 보인다", async ({ page }) => {
  // hot 페이지의 기본 동작(진입/표시)을 POM으로 확인
  const hot = new EmoticonHot(page); // POM 인스턴스를 생성해서 page를 위임한다
  await hot.gotoHotPage(); // 인기 페이지로 진입한다
  await hot.expectHotPageVisible(); // 상단 배너가 보이는지로 인기 페이지 노출을 검증한다
});
