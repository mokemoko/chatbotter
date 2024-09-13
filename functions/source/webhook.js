const functions = require('firebase-functions');
const { get } = require('object-path');
const { config } = require('../util/conf');
const { isOwnMsg, getChannelInfo, getMessageUrl } = require('../util/slack');

const regexp_params = ['team', 'channel', 'channel_name', 'user', 'text'];

function logMessage({ team, channel, channel_name, ts, text }) {
  console.log(JSON.stringify({ team, channel, channel_name, ts, text }));
}

async function parseMessage(body) {
  // TODO: 必要項目の抽出
  // bodyを丸っと引き渡してしまった方が良い？
  const msg = body.event;
  // fileアップロード時など、何故かevent内にteamが含まれないことがあるためその考慮
  msg.team = msg.team || body.team_id;

  const channel = await getChannelInfo(msg);
  msg.channel_name = channel.name;
  msg.url = getMessageUrl(msg);

  return msg;
}

async function handleMessage(msg) {
  await Promise.all(config.map(async rule => {
    // TODO: deep copy
    let res = Object.assign({}, msg);
    if (isMatchRule(res, rule)) {
      // tranformは直列実行
      await rule.transform.map(conf => async () => res = await require(`../transform/${conf.type}`)(Object.assign({}, conf), res))
        .reduce((p, m) => p.then(m), Promise.resolve());
      await Promise.all(rule.destination.map(async conf => await require(`../destination/${conf.type}`)(Object.assign({}, conf), res)));
    }
  }));
}

function isMatchRule(msg, rule) {
  // TODO: improve
  rule = Object.assign({}, rule.source.find(e => e.type === 'webhook'));
  delete rule.type;

  // TODO: transform modularize
  if (rule.sample && rule.sample < Math.random()) {
    return false;
  }
  delete rule.sample;

  if (isOwnMsg(msg)) {
    console.log('ignore own message');
    return false;
  }
  // TODO: 
  if (['message_changed'].includes(msg.subtype)) {
    console.log(`ignore ${msg.subtype}`);
    return false;
  }
  // TODO: use object-path
  if (Object.keys(rule).find(key => !(get(msg, key) || '').match(new RegExp(rule[key])))) {
    return false;
  }
  return true;
}

async function executeAsync(req) {
  const msg = await parseMessage(req.body);
  logMessage(msg);
  return await handleMessage(msg);
}

async function app(req, res) {
  if (req.body.challenge) {
    return res.json({ challenge: req.body.challenge });
  }

  // awaitしない
  executeAsync(req);

  return res.json({});
}

// TODO: separate
module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(app);
