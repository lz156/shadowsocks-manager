require('babel-core/register');

const path = require('path');
global.appRequire = (filePath) => {
  return require(path.resolve(__dirname, filePath));
};

require('./init/moveConfigFile');

const config = appRequire('services/config');

console.log(config.all());

console.log('GG');
