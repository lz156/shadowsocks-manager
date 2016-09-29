require('babel-core/register');
require('./init/moveConfigFile.js');
const os = require('os');
const path = require('path');
module.exports = require('bamei').create({
  configDir: path.resolve(os.homedir() + '/.ssmgr/'),
}, function (ctx) {

  ctx.task(path.resolve(__dirname, './init/checkConfig.js'));
  ctx.module('knex');
  ctx.task(path.resolve(__dirname, './init/loadModels.js'));
  ctx.task(path.resolve(__dirname, './init/loadServices.js'));
  ctx.task(path.resolve(__dirname, './init/loadPlugins.js'));

  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
  });
});
