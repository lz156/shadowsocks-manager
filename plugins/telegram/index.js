'use strict';

module.exports = async function (ctx) {
  console.log('TelegramBot');
  const TelegramBot = require('node-telegram-bot-api');
  const manager = ctx.get('manager');
  const config = ctx.config.all();
  const token = config.plugins.telegram.token;

  const bot = new TelegramBot(token, {polling: true});

  const knex = ctx.get('knex.client');

  const setManager = async (id) => {
    const findId = await knex('telegram').select(['value']).where({
      key: 'manager',
    });
    if(findId.length > 0) {
      return Promise.reject();
    }
    const insertId = await knex('telegram').insert({
      key: 'manager',
      value: id,
    });
    return id;
  };

  const isManager = async (id) => {
    const findId = await knex('telegram').select(['value']).where({
      key: 'manager',
      value: id,
    });
    if (findId.length > 0) {
      return findId.value;
    } else {
      return Promise.reject('Unauthorized');
    }
  };

  bot.onText(/\/auth/, (msg, match) => {
    const fromId = msg.from.id;
    setManager(fromId).then(s => {
      bot.sendMessage(fromId, 'Set manager success');
    }, e => {
      bot.sendMessage(fromId, 'Manager is already set');
    });
  });

  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    setManager(fromId);
    console.log(msg);
    var resp = match[1];
    bot.sendMessage(fromId, resp, {
      reply_markup: {
        keyboard: [['a', 'b', 'c', 'd'], ['1', '2', '3', '4'] ],
        one_time_keyboard: true,
      }
    });
  });

  bot.onText(/\/add (.+)/, (msg, match) => {
    const fromId = msg.from.id;
    isManager(fromId).then(s => {
      const port = +match[1].split(' ')[0];
      const password = match[1].split(' ')[1];
      return manager.send({
        command: 'add',
        port,
        password,
      });
    }).then(s => {
      bot.sendMessage(fromId, `Add account success. [${ s.port }][${ s.password }]`);
    }).catch(e => {
      bot.sendMessage(fromId, 'Error');
    });
  });

  bot.onText(/\/del (.+)/, (msg, match) => {
    const fromId = msg.from.id;
    isManager(fromId).then(s => {
      const port = +match[1].split(' ')[0];
      return manager.send({
        command: 'del',
        port,
      });
    }).then(s => {
      bot.sendMessage(fromId, `Del account success. [${ s.port }]`);
    }).catch(e => {
      bot.sendMessage(fromId, 'Error');
    });
  });

  bot.onText(/\/pwd (.+)/, (msg, match) => {
    const fromId = msg.from.id;
    isManager(fromId).then(s => {
      const port = +match[1].split(' ')[0];
      const password = match[1].split(' ')[1];
      manager.send({
        command: 'pwd',
        port,
        password,
      });
    }).then(s => {
      bot.sendMessage(fromId, `Change password success. [${ s.port }][${ s.password }]`);
    }).catch(e => {
      bot.sendMessage(fromId, 'Error');
    });;
  });

  bot.onText(/\/list/, (msg, match) => {
    const fromId = msg.from.id;
    isManager(fromId).then(s => {
      return manager.send({
        command: 'list',
      });
    }).then(s => {
      bot.sendMessage(fromId, JSON.stringify(s));
    }).catch(() => {
      bot.sendMessage(fromId, 'Error');
    });
  });
};
