// TODO: generalize
module.exports = (conf, msg) => {
  const link = {
    fallback: `<#${msg.channel}>`,
    footer: `<#${msg.channel}>`,
  }
  delete conf.type;
  Object.assign(link, conf);

  msg.attachments = [...(msg.attachments || []), link];
  return msg;
};
