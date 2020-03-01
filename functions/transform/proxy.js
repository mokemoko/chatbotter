const { getUserInfo } = require('../util/slack');

module.exports = async (conf, msg) => {
  // TODO: 諸々対応
  const user = await getUserInfo(msg);
  return {
    text: msg.text,
    username: user.name,
    icon_url: user.profile.image_72
  };
};
