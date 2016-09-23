const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const smcPath = path.resolve(os.homedir() + '/.smc/');
const configFile = path.resolve(os.homedir() + '/.smc/default.yml');
try {
  fs.statSync(smcPath);
} catch(err) {
  fs.mkdirSync(smcPath);
}
try {
  fs.statSync(configFile);
} catch(err) {
  fse.copySync(path.resolve('./config/default.yml'), configFile);
}
