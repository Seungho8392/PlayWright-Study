import { test } from "@playwright/test"; // Playwright 테스트 러너만 사용(검증은 POM으로 이동)
import { EmoticonHot } from "../POM/shannon_hot"; // 인기 페이지용 POM 클래스 가져오기

test("카카오 이모티콘샵 인기 1위 상품 진입/상세 검증", async ({ page }) => { // 인기 페이지 진입 후 1위 상품 상세까지 흐름을 확인한다
  await new EmoticonHot(page).runHotTopsFlow(); // POM에 전체 플로우를 위임해서(1줄 호출) 1위+500위 진입/상세 검증까지 수행한다
});
