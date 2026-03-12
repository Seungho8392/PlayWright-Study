const sendSlackMessage = require("./slackReporter");

class SlackReporter {

  onEnd(result) {

    const passed = result.passed;
    const failed = result.failed;
    const total = passed + failed;

    const passRate = ((passed / total) * 100).toFixed(1);
    const failRate = ((failed / total) * 100).toFixed(1);

    const duration = (result.duration / 1000).toFixed(2);

    const message = `
Playwright Test Result

진행률: 100% (Pass ${passRate}%, Fail ${failRate}%)

총 테스트: ${total}
성공: ${passed}
실패: ${failed}

실행시간: ${duration}초
`;

    sendSlackMessage(message);
  }
}

module.exports = SlackReporter;