'use strict';
const path = require('path');
module.exports = function (ctx, next) {
  const config = ctx.config.all();
  const plugins = () => {
    if(!config.plugins) {
      return;
    }
    for(const name in config.plugins) {
      if(config.plugins[name].use) {
        ctx.task(path.resolve(__dirname, `../plugins/${ name }/index.js`));
      }
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
  }
  next();
};
