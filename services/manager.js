'use strict';

module.exports = function (ctx) {
  const net = require('net');
  const crypto = require('crypto');
  const config = ctx.config.all();
  let host;
  let port;
  let path;
  if(config.manager.address.indexOf(':') < 0) {
    path = config.manager.address;
  } else {
    host = config.manager.address.split(':')[0];
    port = +config.manager.address.split(':')[1];
  }
  const password = config.manager.password;

  const pack = (data) => {
    const message = JSON.stringify(data);
    const dataBuffer = new Buffer(message);
    const length = dataBuffer.length + 2;
    const lengthBuffer = new Buffer(('0000' + length.toString(16)).substr(-4), 'hex');
    const code = crypto.createHash('md5').update(message + password).digest('hex').substr(0, 4);
    const codeBuffer = new Buffer(code, 'hex');
    const pack = Buffer.concat([lengthBuffer, dataBuffer, codeBuffer]);
    return pack;
  };

  const sendMessage = (data) => {
    return new Promise((res, rej) => {
      const client = net.connect(path || {
        host,
        port,
      }, () => {
        client.write(pack(data));
      });
      client.on('data', data => {
        const message = JSON.parse(data.toString());
        if(message.code === 0) {
          res(message.data);
        } else {
          rej('failure');
        }
        client.end();
      });
    });
  };

  // sendMessage({
  //   command: 'list',
  //   port: 60001,
  //   password: 'gyttyg',
  // }).then(s => { console.log(s); }, e => { console.log(e); });
  // sendMessage({}).then(s => { console.log(s); }, e => { console.log(e); });
  // sendMessage({}).then(s => { console.log(s); }, e => { console.log(e); });

  ctx.set('manager', {
    send: sendMessage,
  });
};
