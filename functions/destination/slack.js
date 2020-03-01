const slack = require('../util/slack');

function reflect(conf, msg) {
  return msg;
}

module.exports = (conf, msg) => {
  const res = reflect(conf, msg);
  slack.post(res);
};
