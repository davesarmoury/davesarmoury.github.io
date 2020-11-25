const fs = require('fs/promises');
const path = require('path');

const cacheFile = path.resolve(__dirname, '..', '..', '.cache.json');

const paramsToKey = (params) =>
    params.join('|').replace('/', '_').replace(':', '_');

const getFullCache = () => fs.readFile(cacheFile, {encoding : 'utf-8'})

const withCache = (fn, cacheKeyFn = paramsToKey) => {
  return (...params) => { const key = cacheKeyFn(params); };
};
