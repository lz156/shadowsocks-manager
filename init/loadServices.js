'use strict';
const path = require('path');
module.exports = function (ctx, next) {
  const config = ctx.config.all();
  console.log(config);
  if(config.type === 's') {
    ctx.task(path.resolve(__dirname, '../services/shadowsocks.js'));
    ctx.task(path.resolve(__dirname, '../services/server.js'));
  } else if (config.type === 'm') {
    ctx.task(path.resolve(__dirname, '../services/manager.js'));
    ctx.task(path.resolve(__dirname, '../services/cli.js'));
  } else if (config.type === 'ms' || config.type === 'sm') {
    ctx.task(path.resolve(__dirname, '../services/shadowsocks.js'));
    ctx.task(path.resolve(__dirname, '../services/server.js'));
    ctx.task(path.resolve(__dirname, '../services/manager.js'));
    ctx.task(path.resolve(__dirname, '../services/cli.js'));
  }
  if(config.plugins.telegram.token) {
    ctx.task(path.resolve(__dirname, '../plugins/telegram'));
  }
  next();
};
