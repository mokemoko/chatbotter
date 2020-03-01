const { flatten } = require('lodash/array');

const targets = {};
[
  // MEMO: STEP毎に別functionとして登録されることを想定しているが、現状は全てsource内で実行される
  'source',
  'transform',
  'destination',
].forEach(e => Object.entries(require(`./${e}`)).forEach(([k, v]) => targets[`${e}_${k}`] = v));

module.exports = targets;
