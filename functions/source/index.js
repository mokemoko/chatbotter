const targets = {};
[
  'webhook',
].forEach(e => targets[e] = require(`./${e}`));

module.exports = targets;
