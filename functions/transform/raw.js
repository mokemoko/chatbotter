module.exports = (conf, msg) => {
  delete conf.type;
  return Object.assign(msg, conf);
};
