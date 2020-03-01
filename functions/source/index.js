const functions = require('firebase-functions');
const rules = require('../util/conf');

function parseMessage(body) {
  // TODO: 必要項目の抽出
  // bodyを丸っと引き渡してしまった方が良い？
  return body.event;
}

function handleMessage(msg) {
  rules.forEach(rule => {
    if (isMatchRule(msg, rule)) {
      const res = rule.transform.reduce((prev, conf) => require(`../transform/${conf.type}`)(conf, prev), msg);
      rule.destination.forEach(conf => require(`../destination/${conf.type}`)(conf, res));
    }
  });
}

function isMatchRule(msg, rule) {
  return true;
}

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.body.challenge) {
    return res.json({challenge: req.body.challenge});
  }

  const msg = parseMessage(req.body);
  handleMessage(msg);

  res.json({});
});
