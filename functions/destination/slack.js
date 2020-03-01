const slack = require('../util/slack');

function reflect(conf, msg) {
  // TODO: 必要項目のみ上書くように
  return Object.assign(msg, conf);
}

module.exports = async (conf, msg) => {
  const res = reflect(conf, msg);
  await slack.post(res);
};
