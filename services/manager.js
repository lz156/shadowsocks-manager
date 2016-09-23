'use strict';

module.exports = function (ctx) {
  const net = require('net');
  const crypto = require('crypto');
  const config = ctx.config.all();
  const password = config.listen.password;

  const pack = (data) => {
    const message = JSON.stringify(data);
    const dataBuffer = new Buffer(message);
    const length = dataBuffer.length + 2;
    const lengthBuffer = new Buffer(('0000' + length.toString(16)).substr(-4), 'hex');
    const code = crypto.createHash('md5').update(message + '123456').digest('hex').substr(0, 4);
    const codeBuffer = new Buffer(code, 'hex');
    const pack = Buffer.concat([lengthBuffer, dataBuffer, codeBuffer]);
    return pack;
  };

  const sendMessage = (data) => {
    const client = net.connect({
      host: config.listen.host,
      port: config.listen.port,
    }, () => {
      client.write(pack(data));
    });
    client.on('data', data => {
      console.log(data.toString());
      client.end();
      client.close();
    });
  };

  sendMessage({});
  sendMessage({});
  sendMessage({});

  // const client = net.connect({
  //   host: '127.0.0.1',
  //   port: 6002
  // }, () => {
  //   console.log('connected to server!');
  //   client.write(pack({
  //     command: 'add',
  //     port: 39739,
  //     password: password,
  //   }));
  // });
  // client.on('data', (data) => {
  //   console.log(data.toString());
  //   client.end();
  // });
  // client.on('end', () => {
  //   console.log('disconnected from server');
  // });
};
