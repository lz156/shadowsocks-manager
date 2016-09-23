'use strict';

module.exports = function (ctx) {
  const crypto = require('crypto');
  const config = ctx.config.all();
  const password = config.listen.password;
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
    return md5.substr(0, 4) === code.toString('hex');
  };

  const receiveCommand = async (data) => {
    try {
      if(data.toString() === '{}') {
        return;
      }
      const message = JSON.parse(data.toString());
      console.log(message);
      if(message.command === 'add') {
        const port = +message.port;
        const password = message.password;
        return shadowsocks.addAccount(port, password);
      } else {
        return Promise.reject();
      }
    } catch(err) {
      throw err;
    }
  };

  const checkData = (receive) => {
    const buffer = receive.data;
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
      if(!checkCode(data, password, code)) {
        return receive.socket.close();
      }
      receiveCommand(data).then(s => {
        receive.socket.write('success');
        receive.socket.close();
      }, e => {
        receive.socket.write('failure');
        receive.socket.close();
      });
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
    socket.on('close', () => {
      console.log('close');
    });
  }).on('error', (err) => {
    throw err;
  });

  server.listen(port, host, () => {
    console.log(`server listen on ${ host }:${ port }`);
  });
};
