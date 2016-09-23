'use strict';

module.exports = async function (ctx) {
  const manager = ctx.get('manager');
  const inquirer = require('inquirer');

  const main = {
    type: 'list',
    name: 'main',
    message: 'Select command: ',
    choices: ['add', 'del', 'list']
  };

  const add = [{
    type: 'input',
    name: 'port',
    message: 'Enter port: ',
    validate: function (value) {
      if(Number.isNaN(+value)) {
        return 'Please enter a valid port number';
      } else if (+value <= 0 || +value >= 65536) {
        return 'Port number must between 1 to 65535';
      } else {
        return true;
      }
    },
  }, {
    type: 'input',
    name: 'password',
    message: 'Enter password: ',
    validate: function (value) {
      if(value === '') {
        return 'You can not set an empty password';
      } else {
        return true;
      }
    },
  }, {
    type: 'confirm',
    name: 'confirm',
    message: 'Is this correct?',
    default: true,
    when: (answer) => {
      const port = +answer.port;
      const password = answer.password;
      answer.cmd = {
        command: 'add',
        port,
        password,
      };
      return answer;
    },
  }];

  const del = [{
    type: 'input',
    name: 'port',
    message: 'Enter port: ',
    validate: function (value) {
      if(Number.isNaN(+value)) {
        return 'Please enter a valid port number';
      } else if (+value <= 0 || +value >= 65536) {
        return 'Port number must between 1 to 65535';
      } else {
        return true;
      }
    },
  }, {
    type: 'confirm',
    name: 'confirm',
    message: 'Is this correct?',
    default: true,
    when: (answer) => {
      const port = +answer.port;
      answer.cmd = {
        command: 'del',
        port,
      };
      return answer;
    },
  }];

  const mainMenu = () => {
    return inquirer.prompt(main)
    .then(answer => {
      if(answer.main === 'add') {
        return inquirer.prompt(add);
      } else if (answer.main === 'del') {
        return inquirer.prompt(del);
      }
    }).then(answer => {
      if(answer.confirm) {
        return manager.send(answer.cmd);
      } else {
        return Promise.reject();
      }
    }).then(() => {
      return mainMenu();
    }).catch(() => {
      return mainMenu();
    });;
  };

  mainMenu();
};
