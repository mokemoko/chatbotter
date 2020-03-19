const { get, set } = require('object-path');

module.exports = (conf, msg) => {
  const res = {};
  conf.targets.forEach(key => set(res, key, get(msg, key)));
  return res;
};
