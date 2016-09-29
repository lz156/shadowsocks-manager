const path = require('path');
module.exports = function (ctx, next) {
  const config = ctx.config.all();
  const shadowsocks = () => {
    ctx.task(path.resolve(__dirname, '../services/shadowsocks.js'));
    ctx.task(path.resolve(__dirname, '../services/server.js'));
  };
  const manager = () => {
    ctx.task(path.resolve(__dirname, '../services/manager.js'));
  };
  if(config.type === 's') {
    shadowsocks();
  } else if (config.type === 'm') {
    manager();
  }
  next();
};
