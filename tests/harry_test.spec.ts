import { test, expect } from '@playwright/test';

test('카카오 이모티콘 샵 유지보수 강화 시나리오', async ({ page }) => {
   
   test.setTimeout(120000); // 테스트 제한 시간을 2분(120초)으로 넉넉하게 늘립니다!
   
   //1. 입장
   await page.goto("https://e.kakao.com");

   // --- 첫 번째 배너 구간 ---
   await page.getByRole('button', { name: 'NaN 번째 콘텐츠' }).first().click();
   const page1Promise = page.waitForEvent('popup');
   await page.getByRole('link', { name: '링크배너' }).first().click();
   const page1 = await page1Promise;
   console.log('첫번째 배너는', await page1.title(), '입니다.');
   // await page1.waitForTimeout(1500); // 1.5초 대기
   await page1.close();

   // --- 두 번째 배너 구간 ---
   await page.getByRole('button', { name: 'NaN 번째 콘텐츠' }).nth(1).click();
   const page2Promise = page.waitForEvent('popup');
   await page.getByRole('link', { name: '링크배너' }).first().click(); // 여기서 .first()는 메인창 기준이라 그대로 써도 됨
   const page2 = await page2Promise;
   console.log('두번째 배너는', await page2.title(), '입니다.');
   // await page2.waitForTimeout(1500); // 1.5초 대기
   await page2.close();

   console.log('-----------------------------------------------------------------')

   // --- 신규 이모티콘 섹션 진입 테스트 ---
    // "신규 이모티콘" 글자를 포함하고 있는 '섹션 전체 박스'를 찾습니다.
   const newSection= page.getByText('신규 이모티콘').first();   

   // 섹션이 보일 때까지 스크롤
   await newSection.scrollIntoViewIfNeeded();

   // 신규 이모티콘 클릭 및 홈으로 이동
   await page.getByRole('link', { name: '신규 이모티콘' }).click();
   await page.getByRole('link', { name: 'kakao emoticon shop' }).click();

   // 섹션이 보일 때까지 스크롤
   await newSection.scrollIntoViewIfNeeded();

   for (let i = 0; i < 10; i++) {
       
      // 1. 홈 화면에 올 때마다 '신규 이모티콘' 위치로 스크롤을 다시 해줍니다.
      // (상세 페이지를 갔다 오면 화면 맨 위로 올라가 버리기 때문입니다)
      const newTitle = page.getByText('신규 이모티콘').first();
      await newTitle.scrollIntoViewIfNeeded();
  
      // 2. [가장 중요] 시각적으로 '첫 번째' 이모티콘이 확실히 뜰 때까지 기다립니다.
      // 이렇게 하면 '.list_emoticon' 클래스 이름 없이도 안전하게 로딩을 기다릴 수 있습니다.
      const firstItem = page.locator('a:below(:text("신규 이모티콘"))').first();
      await firstItem.waitFor({ state: 'visible' });
  
      // 3. 🚀 [마법의 DOM 등반] 
      // 첫 번째 아이템(a)의 부모(li)의 부모(ul 상자)로 두 칸 기어올라갑니다.
      // 이 상자 안에는 10개의 이모티콘이 좌->우 순서대로 예쁘게 정렬되어 있습니다!
      const gridBox = firstItem.locator('..').locator('..');
  
      // 4. 거리에 속지 않고, 그 상자 안에서 진짜 HTML 순서대로 i번째 링크를 찾습니다.
      const targetItem = gridBox.getByRole('link').nth(i);
  
      // 5. 텍스트 추출 및 출력 split('\n')[0]을 써서 이모티콘 이름만 깔끔하게 빼냅니다.
      const currentName = await targetItem.innerText();
      console.log(`[${i + 1}번째] 신규 이모티콘은 '${currentName.split('\n')[0]}' 입니다.`);
  
      // 6. 클릭 후 복귀
      await targetItem.click();
      await page.getByRole('link', { name: 'kakao emoticon shop' }).click();
      
      // 홈 화면으로 완전히 돌아올 때까지 대기
      // await page.waitForURL('https://e.kakao.com/'); 
  }
  console.log('-----------------------------------------------------------------')
   
   const popularSection= page.getByText('인기 이모티콘').first();   

   // 2. 섹션이 보일 때까지 스크롤
   await popularSection.scrollIntoViewIfNeeded();

   // 섹션이 보일 때까지 스크롤
   await popularSection.scrollIntoViewIfNeeded();

   for (let i = 0; i < 10; i++) {
      // 1. 홈으로 이동 및 초기화
      await page.goto('https://e.kakao.com');
      await page.waitForLoadState('networkidle');
  
      // 2. '인기' 섹션 찾기
      const sectionTitle = page.locator('h3:has-text("인기")').first();
      await sectionTitle.scrollIntoViewIfNeeded();
  
      // 3. 🎯 [정밀 타격] 
      // '인기' 제목 아래에 있는 진짜 리스트 아이템(li)을 i번째로 가져옵니다.
      // 이렇게 해야 작가 이름이나 이미지가 섞이지 않고 딱 '상자' 단위로 움직입니다.
      const targetBox = page.locator('li:has(a[href*="/t/"])').nth(i);
      await targetBox.waitFor({ state: 'visible' });
  
      // 4. 텍스트 추출 및 이름 정제
      const rawText = await targetBox.innerText();
      const lines = rawText.split('\n').filter(l => l.trim() !== '');
      
      // 카카오 구조상: [0]순위, [1]이름, [2]작가 순서입니다.
      // 만약 lines[1]이 작가 이름처럼 보인다면 lines[0]이나 [2]를 확인해 보세요.
      const emoName = lines[1]; 
      console.log(`현재 인기 ${i + 1}위 이모티콘은 : '${emoName}' 입니다.`);
  
      // 5. 클릭 및 상세 진입 (상자 안의 링크 아무거나 클릭)
      await targetBox.locator('a').first().click();
      await page.waitForURL(/\/t\//);
  }

  console.log('-----------------------------------------------------------------')

   await page.goto("https://e.kakao.com");

   // 1. 기준점 잡기
   const styleSection = page.locator('#kakaoContent').getByText('스타일').first();
   await styleSection.scrollIntoViewIfNeeded();

   // 2. 🚀 [필터 추가] 글자가 있는 링크만 필터링해서 3개를 뽑습니다.
   // .filter({ hasText: /[가-힣a-zA-Z]/ }) 를 추가하면 빈 상자는 무시됩니다.
   const styleTags = page.locator('a:below(:text("스타일"))')
                        .filter({ hasText: /[가-힣a-zA-Z]/ });

   for (let i = 0; i < 3; i++) {
      const tagGroup = styleTags.nth(i);
      
      // 텍스트 추출 및 정제
      const tagName = await tagGroup.innerText();
      const cleanTagName = tagName.replace(/\n/g, ' ').trim();

      console.log(`${i + 1}번째 스타일은 '${cleanTagName}' 입니다.`);
   }
  });