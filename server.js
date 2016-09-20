'use strict';

require('babel-core/register');
const path = require('path');
const program = require('commander');
program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);

module.exports = require('bamei').create(function (ctx) {
  // ctx.task(path.resolve(__dirname, './services'));
  console.log(ctx.config.all());

  ctx.init(err => {
    if (err) throw err;
    ctx.catchError();
    // console.log(ctx.config.all());
    // ctx.getLogger('init').info('server started');
  });
});
