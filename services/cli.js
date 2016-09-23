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
    message: 'Enter port: '
  }, {
    type: 'input',
    name: 'password',
    message: 'Enter password: '
  }];

  const mainMenu = () => {
    return inquirer.prompt(main);
  };

  mainMenu().then(answer => {
    if(answer.main === 'add') {
      return inquirer.prompt(add);
    }
  }).then(answer => {
    manager.send({
      command: 'add',
      port: +answer.port,
      password: answer.password,
    });
  }).then(() => {
    return mainMenu();
  });
};
