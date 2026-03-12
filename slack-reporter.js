const sendSlackMessage = require("./slackReporter");

console.log("Slack Reporter 실행됨");

class SlackReporter {

  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.failedTests = [];
  }

  onTestEnd(test, result) {
    // 1) 성공 테스트
    if (result.status === "passed") {
      this.passed++;
      return;
    }
  
    // 2) 실패로 처리할 상태들 (failed + timedOut + interrupted)
    const isFailure =
      result.status === "failed" ||
      result.status === "timedOut" ||
      result.status === "interrupted";
  
    if (!isFailure) {
      // skipped 같은 건 통계에서 제외
      return;
    }
  
    this.failed++;
  
    const errorMessage = result.error ? result.error.message : "Unknown error";
  
    const screenshot = result.attachments.find(a => a.name === "screenshot");
    const video = result.attachments.find(a => a.name === "video");
  
    this.failedTests.push({
      title: test.title,
      file: test.location.file,
      error: errorMessage,
      screenshot: screenshot ? screenshot.path : null,
      video: video ? video.path : null
    });
  }

  onEnd(result) {

    const total = this.passed + this.failed;

    const passRate = ((this.passed / total) * 100).toFixed(0);
    const failRate = ((this.failed / total) * 100).toFixed(0);

    const duration = (result.duration / 1000).toFixed(2);

    let message =
      "🚀 Playwright Test Result\n\n" +
      `진행률: 100% (Pass ${passRate}%, Fail ${failRate}%)\n\n` +
      `총 테스트: ${total}\n` +
      `✅ Pass: ${this.passed}\n` +
      `❌ Fail: ${this.failed}\n\n` +
      `실행시간: ${duration}초`;

    if (this.failedTests.length > 0) {

      message += "\n\n❌ Failed Tests\n";

      this.failedTests.forEach((test, index) => {

        message += `\n${index + 1}️⃣ ${test.title}\n`;
        message += `파일: ${test.file}\n`;
        message += `에러: ${test.error}\n`;

        if (test.screenshot) {
          message += `📸 Screenshot: ${test.screenshot}\n`;
        }

        if (test.video) {
          message += `🎥 Video: ${test.video}\n`;
        }
      });
    }

    sendSlackMessage(message);
  }
}

module.exports = SlackReporter;