const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const ssmgrPath = path.resolve(os.homedir() + '/.ssmgr/');
const configFile = path.resolve(os.homedir() + '/.ssmgr/default.yml');
try {
  fs.statSync(ssmgrPath);
} catch(err) {
  fs.mkdirSync(ssmgrPath);
}
try {
  fs.statSync(configFile);
} catch(err) {
  fse.copySync(path.resolve('./config/default.yml'), configFile);
}
