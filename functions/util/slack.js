const { WebClient } = require('@slack/web-api');
const { credential } = require('./conf');
const { get, set } = require('./cache');

const teams = {};
credential.slack.map(e => teams[e.team] = { client: new WebClient(e.token), bot_id: e.bot_id });

console.log(`Initialize ${Object.keys(teams).length} teams.`);

function getClient(team) {
  return teams[team].client;
}

function isOwnMsg(msg) {
  return msg.bot_id && Object.values(teams).map(e => e.bot_id).includes(msg.bot_id);
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
  const info = (await getClient(team).conversations.info({channel})).channel;
  set(team, channel, info);
  return info;
}

module.exports = { isOwnMsg, post, getUserInfo, getChannelInfo };
