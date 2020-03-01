const { WebClient } = require('@slack/web-api');
const { credential } = require('./conf');

const clients = {};
credential.slack.map(e => clients[e.team] = new WebClient(e.token));

console.log(`Initialize ${Object.keys(clients).length} teams.`);

async function post(msg) {
  await clients[msg.team].chat.postMessage(msg);
}

// TODO: remove
const users = {};
async function fetchUsers(team) {
  const list = [];
  for await (const page of clients[team].paginate('users.list', {name: 'value'})) {
    list.push(...page.members);
  }
  users[team] = list;
}

async function getUserInfo({ team, user }) {
  return (await clients[team].users.info({user})).user;
}

module.exports = { post, getUserInfo };
