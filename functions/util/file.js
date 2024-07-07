const { readFileSync } = require('fs');
const { resolve } = require('path');

async function read(path) {
  let url = {};
  try {
    url = new URL(path);
  } catch (error) {
    // ignore
  }
  if (url.protocol === 'gs:') {
    // GCS path
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    return (await storage.bucket(url.host).file(url.pathname.substring(1)).download()).toString();
  } else {
    // local path
    return readFileSync(resolve(__dirname, '..', path))
  }
}

module.exports = { read };
