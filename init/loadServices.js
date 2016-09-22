'use strict';
const path = require('path');
module.exports = function (ctx, next) {
  const config = ctx.config.all();
  console.log(config);
  if(config.type === 's') {
    ctx.task(path.resolve(__dirname, '../services/shadowsocks.js'));
  } else if (config.type === 'm') {
    ctx.task(path.resolve(__dirname, '../services/manager.js'));
  }
  next();
};
