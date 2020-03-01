const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const confdir = path.resolve(__dirname, '../conf');
const config = fs.readdirSync(confdir)
  .filter(p => path.extname(p).match(/^\.ya?ml$/))
  .map(p => {
    const name = path.basename(p, path.extname(p));
    const file = path.resolve(confdir, p);
    return Object.assign({name}, yaml.safeLoad(fs.readFileSync(file, 'utf8')));
  })
  .filter(c => !c.disabled);

console.log(`Load ${config.length} configs.`);

const credpath = path.resolve(__dirname, '../credentials.yml');
const credential = yaml.safeLoad(fs.readFileSync(credpath, 'utf8'));

module.exports = { config, credential };
