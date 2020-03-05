const { WebClient } = require('@slack/web-api');
const { credential } = require('./conf');

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
  await getClient(msg.team).chat.postMessage(msg);
}

// TODO: remove
const users = {};
async function fetchUsers(team) {
  const list = [];
  for await (const page of getClient(team).paginate('users.list', {name: 'value'})) {
    list.push(...page.members);
  }
  users[team] = list;
}

async function getUserInfo({ team, user }) {
  return (await getClient(team).users.info({user})).user;
}

module.exports = { isOwnMsg, post, getUserInfo };
