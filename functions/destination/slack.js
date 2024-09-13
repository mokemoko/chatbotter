const slack = require("../util/slack");

function reflect(conf, msg) {
  delete conf.type;
  return Object.assign(msg, conf);
}

module.exports = async (conf, msg) => {
  const res = reflect(conf, msg);
  if (!res.text && !res.attachments && !res.blocks && !res.file) {
    // 必須項目がない場合はAPIエラーを避けるためスキップ
    console.log("[ignore] contents is empty.", JSON.stringify(res));
    return;
  }
  if (res.file) {
    // ファイルアップロード時
    await slack.uploadFile(res);
  } else {
    await slack.post(res);
  }
};
