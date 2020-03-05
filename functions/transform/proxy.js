const { getUserInfo } = require('../util/slack');

module.exports = async (conf, msg) => {
  // TODO: 諸々対応
  const user = await getUserInfo(msg);
  const res = {
    team: msg.team,
    channel: msg.channel,
    text: msg.text,
    username: user.name,
    icon_url: user.profile.image_72
  };
  if (msg.files) {
    res.text = [res.text, ...msg.files.map(file => `<${file.permalink}|${file.title}>`)].join("\n");
  }
  return res;
};
