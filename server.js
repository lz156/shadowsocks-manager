'use strict';

require('babel-core/register');
require('./init/moveConfigFile.js');
const os = require('os');
const path = require('path');
module.exports = require('bamei').create({
  configDir: path.resolve(os.homedir() + '/.smc/'),
}, function (ctx) {

  ctx.task(path.resolve(__dirname, './init/checkConfig.js'));
  ctx.module('knex');
  ctx.task(path.resolve(__dirname, './init/loadModels.js'));
  ctx.task(path.resolve(__dirname, './init/loadServices.js'));
  // ctx.module('knex');
  // ctx.task(path.resolve(__dirname, './models'));

  // ctx.task(path.resolve(__dirname, './services'));
  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    // console.log(ctx.config.all());
    // ctx.getLogger('init').info('server started');
  });
});
