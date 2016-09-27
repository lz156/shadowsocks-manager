'use strict';
const path = require('path');
module.exports = function (ctx, next) {
  const config = ctx.config.all();
  const plugins = () => {
    if(config.plugins.telegram.use) {
      ctx.task(path.resolve(__dirname, '../plugins/telegram'));
    }
    if(config.plugins.cli.use) {
      ctx.task(path.resolve(__dirname, '../plugins/cli'));
    }
  };
  const shadowsocks = () => {
    ctx.task(path.resolve(__dirname, '../services/shadowsocks.js'));
    ctx.task(path.resolve(__dirname, '../services/server.js'));
  };
  const manager = () => {
    ctx.task(path.resolve(__dirname, '../services/manager.js'));
    plugins();
  };
  if(config.type === 's') {
    shadowsocks();
  } else if (config.type === 'm') {
    manager();
  } else if (config.type === 'ms' || config.type === 'sm') {
    shadowsocks();
    manager();
  }
  next();
};
