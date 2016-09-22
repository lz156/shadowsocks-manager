'use strict';

module.exports = function (ctx) {
  const net = require('net');
  const crypto = require('crypto');

  const pack = (data) => {
    const dataBuffer = new Buffer(data);
    const length = dataBuffer.length + 2;
    const lengthBuffer = new Buffer(('0000' + length.toString(16)).substr(-4), 'hex');
    const code = crypto.createHash('md5').update(data + '123456').digest('hex').substr(0, 4);
    const codeBuffer = new Buffer(code, 'hex');
    const pack = Buffer.concat([lengthBuffer, dataBuffer, codeBuffer]);
    return pack;
  };

  const client = net.connect({
    host: '127.0.0.1',
    port: 6002
  }, () => {
    console.log('connected to server!');
    client.write(pack('1234'));
  });
  client.on('data', (data) => {
    console.log(data.toString());
    client.end();
  });
  client.on('end', () => {
    console.log('disconnected from server');
  });
};
