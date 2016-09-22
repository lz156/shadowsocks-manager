'use strict';

module.exports = function (ctx) {
  const dgram = require('dgram');
  const message = Buffer.from('ping');
  const client = dgram.createSocket('udp4');

  const config = ctx.config.all();
  const host = config.shadowsocks.host;
  const port = +config.shadowsocks.port;

  const knex = ctx.get('knex.client');

  // console.log(config);

  const sendPing = () => {
    client.send(message, port, host, (err) => {});
  };

  const sendMessage = (message) => {
    console.log('send: ' + message);
    client.send(message, port, host, (err) => {});
  };

  client.on('message', (msg, rinfo) => {
    // console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const msgStr = new String(msg);
    if(msgStr.substr(0, 5) === 'stat:') {
      const flow = JSON.parse(msgStr.substr(5));
      console.log(flow);
      const insertFlow = Object.keys(flow).map(m => {
        return {
          port: +m,
          flow: +flow[m],
          time: Date.now(),
        };
      }).filter(f => {
        return f.flow > 0;
      });
      knex('flow').insert(insertFlow).then();
    };
  });

  client.on('error', (err) => {
    console.log(`client error:\n${err.stack}`);
  });

  sendPing();
  setInterval(() => {
    sendPing();
  }, 60 * 1000);

  const addAccount = async (port, password) => {
    try {
      const insertAccount = await knex('account').insert({
        port,
        password,
      });
      sendMessage(`add: {"server_port": ${ port }, "password": "${ password }"}`);
      return 'success';
    } catch(err) {
      Promise.reject('error');
    }
  };

  const removeAccount = async (port) => {
    try {
      const deleteAccount = await knex('account').where({
        port,
      }).delete();
      sendMessage(`remove: {"server_port": ${ port }}`);
      return 'success';
    } catch(err) {
      Promise.reject('error');
    }
  };

  const changePassword = async (port, password) => {
    try {
      const updateAccount = await knex('account').where({port}).update({
        password,
      });
      sendMessage(`remove: {"server_port": ${ port }}`);
      sendMessage(`add: {"server_port": ${ port }, "password": "${ password }"}`);
      return 'success';
    } catch(err) {
      Promise.reject('error');
    }
  };

  ctx.set('shadowsocks', {
    addAccount,
    removeAccount,
    changePassword,
  });
};
