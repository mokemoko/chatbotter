const { WebClient } = require('@slack/web-api');
const { credential } = require('./conf');
const { get, set } = require('./cache');

const teams = {};
credential.slack.map(e => teams[e.team] = {
  client: new WebClient(e.token),
  bot_id: e.bot_id,
  team_domain: e.team_domain,
});

console.log(`Initialize ${Object.keys(teams).length} teams.`);

function getClient(team) {
  return teams[team].client;
}

function isOwnMsg(msg) {
  return msg.bot_id && Object.values(teams).map(e => e.bot_id).includes(msg.bot_id);
}

function getMessageUrl(msg) {
  const team_domain = teams[msg.team].team_domain;
  const channel = msg.channel;
  const ts = `p${msg.ts.replace('.', '')}`;
  const url = `https://${team_domain}.slack.com/archives/${channel}/${ts}`;

  if (msg.thread_ts) {
    return `${url}?thread_ts=${msg.thread_ts}`;
  } else {
    return url;
  }
}

async function post(msg) {
  console.log(JSON.stringify(msg));
  await getClient(msg.team).chat.postMessage(msg);
}

async function getUserInfo({ team, user }) {
  const cache = get(team, user);
  if (cache) return cache;

  console.log(`cache not hit. get ${user}`)
  const info = (await getClient(team).users.info({user})).user;
  set(team, user, info);
  return info;
}

async function getChannelInfo({ team, channel }) {
  const cache = get(team, channel);
  if (cache) return cache;

  console.log(`cache not hit. get ${channel}`)
  // TODO: for debug purpose. improve future.
  if (!teams[team]) {
    console.error(`team ${team} not detected`);
    return {};
  }
  const info = (await getClient(team).conversations.info({channel})).channel;
  set(team, channel, info);
  return info;
}

module.exports = { isOwnMsg, post, getUserInfo, getChannelInfo, getMessageUrl };
