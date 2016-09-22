'use strict';

module.exports = function (ctx, next) {

  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const program = require('commander');
  const version = require(path.resolve(__dirname, '../package.json')).version;
  const config = ctx.config.all();

  const smcPath = path.resolve(os.homedir() + '/.smc/');

  program
    .version(version)
    .option('-c, --config [file]', 'config file, default: ~/.smc/config')
    .option('-d, --db [file]', 'sqlite3 file, default: ~/.smc/db.sqlite')
    .option('-e, --empty', 'clean db file')
    .option('-t, --type [type]', 'manager type, s for server side, m for manager type, default: s')
    .option('-h, --host [address]', 'ss-manager host, only for type s')
    .option('-p, --port [port]', 'ss-manager port, only for type s')
    .option('-l, --listen [address]', 'manager host, only for type m')
    .option('-P, --manager-port [port]', 'manager port, only for type m')
    .parse(process.argv);

  config.type = program.type || config.type;
  if(program.host) {
    config.shadowsocks.host = program.host;
  }
  if(program.port) {
    config.shadowsocks.port = program.port;
  }

  try {
    fs.statSync(smcPath);
  } catch(err) {
    fs.mkdirSync(smcPath);
  }
  config.knex.connection.filename = path.resolve(smcPath + config.knex.connection.filename);

  // console.log(ctx.config.all());
  next();
};
