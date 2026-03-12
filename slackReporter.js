// 1. 최상단에 dotenv 설정 추가 (npm install dotenv 필요)
require('dotenv').config();
const https = require("https");

function sendSlackMessage(message) {
  console.log("Slack 전송 시도");

  // 2. 환경 변수에서 URL을 가져옵니다.
  const webhookUrl = process.env.SLACK_WEBHOOK_URL; 

  // URL이 설정되지 않았을 경우를 대비한 안전장치
  if (!webhookUrl) {
    console.error("❌ 에러: .env 파일에 SLACK_WEBHOOK_URL이 정의되지 않았습니다.");
    return;
  }

  const data = JSON.stringify({
    text: String(message)
  });

  try {
    const url = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data) // 안정적인 전송을 위해 길이 추가
      }
    };

    const req = https.request(options, (res) => {
      console.log("Slack 응답 코드:", res.statusCode);
    });

    req.on("error", (error) => {
      console.error("Slack 에러:", error);
    });

    req.write(data);
    req.end();
  } catch (err) {
    console.error("❌ 유효하지 않은 Webhook URL입니다:", err.message);
  }
}

module.exports = sendSlackMessage;