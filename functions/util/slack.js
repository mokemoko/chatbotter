const { WebClient } = require('@slack/web-api');

module.exports = {
  post: (msg) => console.log(`post : ${msg.text}`)
};
