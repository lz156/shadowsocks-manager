'use strict';

require('babel-core/register');
const path = require('path');

module.exports = require('bamei').create(function (ctx) {
  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    console.log(ctx.config.all());
    ctx.getLogger('init').info('server started');
  });
});
