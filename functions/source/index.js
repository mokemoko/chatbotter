const functions = require('firebase-functions');
const { config } = require('../util/conf');
const { isOwnMsg } = require('../util/slack');

const regexp_params = ['team', 'channel', 'text'];

function parseMessage(body) {
  // TODO: 必要項目の抽出
  // bodyを丸っと引き渡してしまった方が良い？
  const msg = body.event;
  // fileアップロード時など、何故かevent内にteamが含まれないことがあるためその考慮
  msg.team = msg.team || body.team_id;
  return msg;
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
  // TODO: improve
  rule = rule.source.find(e => e.type === 'webhook');
  if (isOwnMsg(msg)) {
    console.log("ignore own message");
    return false;
  }
  if (regexp_params.find(e => rule[e] && !msg[e].match(new RegExp(rule[e])))) {
    return false;
  }
  return true;
}

// TODO: separate
exports.webhook = functions.https.onRequest(async (req, res) => {
  if (req.body.challenge) {
    return res.json({challenge: req.body.challenge});
  }

  const msg = parseMessage(req.body);
  await handleMessage(msg);

  res.json({});
});
