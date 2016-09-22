'use strict';

module.exports = function (ctx) {
  const crypto = require('crypto');
  const config = ctx.config.all();
  const host = config.listen.host;
  const port = +config.listen.port;
  const shadowsocks = ctx.get('shadowsocks');

  const net = require('net');

  const receiveData = (receive, data) => {
    receive.data = Buffer.concat([receive.data, data]);
    checkData(receive);
  };

  const checkCode = (data, password, code) => {
    const md5 = crypto.createHash('md5').update(data + password).digest('hex');
    console.log(md5);
    return md5.substr(0, 4) === code.toString('hex');
  };

  const receiveCommand = (data) => {
    try {
      const message = JSON.parse(data.toString());
      if(message.command === 'add') {
        const port = +message.port;
        const password = message.password;
        shadowsocks.addAccount(port, password);
      }
    } catch(err) {
      throw err;
    }
  };

  const checkData = (receive) => {
    const buffer = receive.data;
    console.log(buffer);
    let length = 0;
    let data;
    let code;
    if (buffer.length < 2) {
      return;
    }
    length = buffer[0] * 256 + buffer[1];
    if (buffer.length >= length + 2) {
      data = buffer.slice(2, length);
      code = buffer.slice(length, length + 2);
      receive.data = buffer.slice(length + 2, buffer.length);
      if(!checkCode(data, '123456', code)) {
        return receive.socket.close();
      }
      receiveCommand(data);
      if(buffer.length > length + 2) {
        checkData(receive);
      }
    }
  };

  const server = net.createServer(socket => {
    const receive = {
      data: new Buffer(0),
      socket: socket,
    };
    socket.on('data', data => {
      receiveData(receive, data);
    });
    socket.on('end', () => {
      console.log('end');
    });
  }).on('error', (err) => {
    // handle errors here
    throw err;
  });

  server.listen(port, host, () => {
    console.log(`server listen on ${ host }:${ port }`);
  });
};
