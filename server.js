'use strict';

require('babel-core/register');
const path = require('path');
module.exports = require('bamei').create(function (ctx) {

  ctx.task(path.resolve(__dirname, './init/checkConfigFile.js'));

  ctx.module('knex');
  ctx.task(path.resolve(__dirname, './models'));
  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    // console.log(ctx.config.all());
    // ctx.getLogger('init').info('server started');
  });
});
