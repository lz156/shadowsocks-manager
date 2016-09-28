'use strict';

module.exports = function (ctx, next) {

  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const program = require('commander');
  const version = require(path.resolve(__dirname, '../package.json')).version;
  const config = ctx.config.all();

  let ssmgrPath = path.resolve(os.homedir() + '/.ssmgr/');

  program
    .version('shadowsocks-manager-cli ' + version)
    .option('-c, --config [file]', 'config file, default: ~/.ssmgr/default.yml')
    .option('-d, --db [file]', 'sqlite3 file, default: ~/.ssmgr/db.sqlite')
    .option('-e, --empty', 'clean database')
    .option('-t, --type [type]', 'manager type, s for server side, m for manager side, default: s')
    .option('-s, --shadowsocks [address]', 'ss-manager address, default: 127.0.0.1:6001, only for type s')
    .option('-m, --manager [address]', 'manager address, default: 127.0.0.1:6002, only for type m')
    .option('-p, --password [password]', 'manager password, both server side and manager side must be equals')
    .option('-v, --verbose', 'show verbose info')
    .parse(process.argv);

  config.type = program.type || config.type;
  config.empty = program.empty || config.empty;
  if(program.shadowsocks) {
    config.shadowsocks.address = program.shadowsocks;
  }
  if(program.manager) {
    config.manager.address = program.manager;
  }
  if(program.password) {
    config.manager.password = program.password;
  }
  if(program.verbose) {
    config.verbose = program.verbose;
  }
  if(program.db) {
    config.knex.connection.filename = path.resolve(program.db);
  } else {
    config.knex.connection.filename = path.resolve(ssmgrPath + '/' + config.knex.connection.filename);
  }
  next();
};
