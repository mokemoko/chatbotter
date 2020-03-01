const functions = require('firebase-functions');
const { config } = require('../util/conf');

function parseMessage(body) {
  // TODO: 必要項目の抽出
  // bodyを丸っと引き渡してしまった方が良い？
  return body.event;
}

async function handleMessage(msg) {
  await Promise.all(config.map(async rule => {
    if (isMatchRule(msg, rule)) {
      let res = msg;
      await Promise.all(rule.transform.map(async conf => res = await require(`../transform/${conf.type}`)(conf, res)));
      await Promise.all(rule.destination.map(async conf => await require(`../destination/${conf.type}`)(conf, res)));
    }
  }));
}

function isMatchRule(msg, rule) {
  return true;
}

exports.webhook = functions.https.onRequest(async (req, res) => {
  if (req.body.challenge) {
    return res.json({challenge: req.body.challenge});
  }

  const msg = parseMessage(req.body);
  await handleMessage(msg);

  res.json({});
});
