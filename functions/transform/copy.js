const { get, set } = require('object-path');

module.exports = (conf, msg) => {
  delete conf.type;
  Object.keys(conf).forEach(key => set(msg, key, get(msg, conf[key])));
  return msg;
};
