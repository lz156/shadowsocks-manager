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
    bot.sendMessage(fromId, resp);
  });

  bot.onText(/\/add (.+)/, (msg, match) => {
    try {
      const port = +match[1].split(' ')[0];
      const password = match[1].split(' ')[1];
      console.log(match[1]);
      console.log(port);
      manager.send({
        command: 'add',
        port,
        password,
      }).then(s => {
        console.log(s);
      }, e => {
        console.log(e);
      });
    } catch(err) {
      console.log(err);
    }
  });

  bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    var photo = 'cats.png';
    bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
  });
};
