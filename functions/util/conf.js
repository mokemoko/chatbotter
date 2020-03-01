const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const confdir = path.resolve(__dirname, '../conf');

const conf = fs.readdirSync(confdir)
  .filter(p => path.extname(p).match(/^\.ya?ml$/))
  .map(p => {
    const name = path.basename(p, path.extname(p));
    const file = path.resolve(confdir, p);
    return Object.assign({name}, yaml.safeLoad(fs.readFileSync(file, 'utf8')));
  });

module.exports = conf;
