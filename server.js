'use strict';

require('babel-core/register');
const path = require('path');
const version = require('./package.json').version;
const program = require('commander');
program
  .version(version)
  .parse(process.argv);

console.log(`This version(${version}) is unavailable`);
// console.log(program);

module.exports = require('bamei').create(function (ctx) {
  // ctx.task(path.resolve(__dirname, './services'));
  // console.log(ctx.config.all());
  ctx.module('knex');
  ctx.task(path.resolve(__dirname, './models'));
  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    // console.log(ctx.config.all());
    // ctx.getLogger('init').info('server started');
  });
});
