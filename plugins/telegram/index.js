'use strict';

module.exports = async function (ctx) {
  console.log('TelegramBot');
  const TelegramBot = require('node-telegram-bot-api');
  const manager = ctx.get('manager');
  const config = ctx.config.all();
  const token = config.plugins.telegram.token;

  const bot = new TelegramBot(token, {polling: true});

  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    console.log(msg);
    var resp = match[1];
    bot.sendMessage(fromId, resp, {
      reply_markup: {
        keyboard: [[{
          text: 'A',
          
        }, 'b', 'c', 'd'], ['1', '2', '3', '4'] ]
      }
    });
  });

  bot.onText(/\/add (.+)/, (msg, match) => {
    const port = +match[1].split(' ')[0];
    const password = match[1].split(' ')[1];
    manager.send({
      command: 'add',
      port,
      password,
    });
  });

  bot.onText(/\/del (.+)/, (msg, match) => {
    const port = +match[1].split(' ')[0];
    manager.send({
      command: 'del',
      port,
    });
  });

  bot.onText(/\/list (.+)/, (msg, match) => {
    console.log('list');
    manager.send({
      command: 'list',
    }).then(s => {
      console.log(s);
      var fromId = msg.from.id;
      bot.sendMessage(fromId, JSON.stringify(s));
    }, e => {
      console.log(e);
    });
  });

  // bot.on('message', function (msg) {
  //   var chatId = msg.chat.id;
  //   var photo = 'cats.png';
  //   bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
  // });
};
