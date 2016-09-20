'use strict';

require('babel-core/register');
const path = require('path');
const program = require('commander');
program
  .version('0.0.4')
  .parse(process.argv);

console.log('This version is unavailable');
// console.log(program);

module.exports = require('bamei').create(function (ctx) {
  // ctx.task(path.resolve(__dirname, './services'));
  // console.log(ctx.config.all());

  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    // console.log(ctx.config.all());
    // ctx.getLogger('init').info('server started');
  });
});
