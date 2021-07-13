// TODO: generalize
module.exports = (conf, msg) => {
  const text = `<#${msg.channel}> <${msg.url}|元メッセージを確認>`;
  const link = {
    fallback: text,
    footer: text,
  }
  delete conf.type;
  Object.assign(link, conf);

  msg.attachments = [...(msg.attachments || []), link];
  return msg;
};
