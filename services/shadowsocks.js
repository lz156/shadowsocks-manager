'use strict';

module.exports = function (ctx) {
  const dgram = require('dgram');
  const message = Buffer.from('ping');
  const client = dgram.createSocket('udp4');


  const sendPing = () => {
    client.send(message, 6001, 'v2.gyteng.com', (err) => {});
  };

  client.on('message', (msg, rinfo) => {
    // console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const msgStr = new String(msg);
    if(msgStr.substr(0, 5) === 'stat:') {
      console.log(JSON.parse(msgStr.substr(5)));
    };
  });

  client.on('error', (err) => {
    console.log(`client error:\n${err.stack}`);
  });

  sendPing();
  setInterval(() => {
    sendPing();
  }, 60 * 1000);
};
