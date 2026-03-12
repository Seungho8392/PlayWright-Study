const https = require("https");

function sendSlackMessage(message) {
  const data = JSON.stringify({
    text: message
  });

  const options = {
    hostname: "hooks.slack.com",
    path: "/services/XXXX/XXXX/XXXX", // webhook URL path
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
}

module.exports = sendSlackMessage;