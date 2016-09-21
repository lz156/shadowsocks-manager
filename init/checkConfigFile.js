'use strict';

module.exports = function (ctx, next) {

  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const program = require('commander');
  const version = require(path.resolve(__dirname, '../package.json')).version;
  const config = ctx.config.all();

  const smcPath = path.resolve(os.homedir() + '/.smc');

  program
    .version(version)
    .option('-h, --host [ggg]', 'abc')
    .parse(process.argv);
  console.log(program.host);
  console.log(program.ggg);

  try {
    fs.statSync(smcPath);
  } catch(err) {
    fs.mkdirSync(smcPath);
  }
  config.knex.connection.filename = path.resolve(smcPath + config.knex.connection.filename);

  // console.log(ctx.config.all());
  next();
};
