const { readFileSync } = require('fs');
const { resolve } = require('path');
const { promisify } = require('util');
const { get, set } = require('object-path');
const parse = promisify(require('csv-parse'));

// TODO: improve performance
// use cache
module.exports = async (conf, msg) => {
  const { file, match_column, match_path, res_column, res_path, nomatch_text } = conf;
  const data = await parse(readFileSync(resolve(__dirname, file)));
  const target = get(msg, match_path) || '';
  const matched = (data.find(r => target.match(new RegExp(r[match_column]))) || {})[res_column];
  set(msg, res_path, matched || nomatch_text);
  return msg;
};
