const { getUserInfo } = require('../util/slack');

async function getUser(msg) {
  if (msg.user) {
    user = await getUserInfo(msg);
    return {
      username: user.name,
      icon_url: user.profile.image_72,
    };
  } else {
    return {
      username: msg.username,
      // TODO: no icon
    };
  }
}

module.exports = async (conf, msg) => {
  // TODO: 諸々対応
  // thread
  const user = await getUser(msg);
  const res = {
    team: msg.team,
    channel: msg.channel,
    text: msg.text,
    attachments: msg.attachments,
    username: user.username,
    icon_url: user.icon_url,
    unfurl_links: true,
  };
  if (msg.files) {
    res.text = [res.text, ...msg.files.map(file => `<${file.permalink}|${file.title}>`)].join("\n");
  }
  return res;
};
