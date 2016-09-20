'use strict';

module.exports = function (ctx) {
  const dgram = require('dgram');
  const message = Buffer.from('ping');
  const client = dgram.createSocket('udp4');
  client.send(message, 6001, 'v2.gyteng.com', (err) => {

  });

  client.on('message', (msg, rinfo) => {
    console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  client.on('error', (err) => {
    console.log(`client error:\n${err.stack}`);
  });

  setInterval(() => {
    client.send(message, 6001, 'v2.gyteng.com', (err) => {

    });
  }, 90 * 1000);
};
