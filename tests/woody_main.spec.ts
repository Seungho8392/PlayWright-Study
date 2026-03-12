import { test } from '@playwright/test';
import { KakaoEmoticonPage_New } from '../POM/woody_pom';
import { Rex } from '../POM/rex_pom';
import { EmoticonHot } from '../POM/shannon_hot';

// // 1번 방식
// // [test.describe]란? (역할: 여러 개의 테스트(test)를 하나로 묶어주는 '커다란 보관함' 혹은 '그룹')
// test.describe('카카오 이모티콘 페이지 통합 테스트', () => {
//     // 시간을 무한대로 가져감 (기본 30초)
//     test.setTimeout(0);
//     // beforeEach라는 이름 자체가 각 함수 별 테스트(Each test)가 시작되기 전(Before)에 자동으로 실행해라
//     test.beforeEach(async ({ page }) => {
//         await page.goto('https://e.kakao.com/');
//     });

//     test('우디 시나리오', async ({ page }) => {
//         // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
//         const woody = new KakaoEmoticonPage_New(page);
//         await woody.runNewFlow();
//     });

//     test('렉스 시나리오', async ({ page }) => {
//         // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
//         const rex = new Rex(page);
//         await rex.runEmoticonTest();
//     });

//     test('섀넌 시나리오', async ({ page }) => {
//         // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
//         const shannon = new EmoticonHot(page);
//         await shannon.runHotTopsFlow();
//     });
// });


// 2번 방식
// [test.describe]란? (역할: 여러 개의 테스트(test)를 하나로 묶어주는 '커다란 보관함' 혹은 '그룹')
test.describe('카카오 이모티콘 페이지 통합 테스트', () => {
    // 시간을 무한대로 가져감 (기본 30초)
    test.setTimeout(0);
    // [1. 변수 미리 선언 (이름표 만들기) / 이렇게 밖에 꺼내놔야 아래에 있는 개별 test 함수들이 이 이름들을 인식할 수 있음
    let woody: KakaoEmoticonPage_New;
    let rex: Rex;
    let shannon: EmoticonHot;

    test.beforeEach(async ({ page, context }) => {
        // [2. 내용물 채우기] 시작 전마다 3명 모두 세팅 + 홈 이동
        woody = new KakaoEmoticonPage_New(page);
        rex = new Rex(page);
        shannon = new EmoticonHot(page);
        await page.goto('https://e.kakao.com/', { waitUntil: 'networkidle' });
    });

    // 각 test 함수 안에 { page }를 명시해주는 것이 Playwright의 정석입니다.
    test('우디 시나리오_1', async ({ }) => {
        await woody.runNewFlow(); 
    });

    test('렉스 시나리오_1', async ({ page }) => {
        await page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
        await rex.runEmoticonTest(); 
    });

    test('섀넌 시나리오_1', async ({ }) => {
        await shannon.runHotTopsFlow(); 
    });
});