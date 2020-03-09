const LRU = require('lru-cache');
const cache = new LRU({
  max: 1000,
  maxAge: 1000 * 60 * 60 * 24,
});

function get(...args) {
  return cache.get(args.join('.'));
}

function set(...args) {
  const value = args.pop();
  cache.set(args.join('.'), value);
}

module.exports = { get, set };
