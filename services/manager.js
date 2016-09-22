'use strict';

module.exports = function (ctx) {
  const BufferHelper = require('bufferhelper');
  const config = ctx.config.all();
  const host = config.listen.host;
  const port = +config.listen.port;

  const net = require('net');

  // const checkBuffer = (bh, socket) => {
  //   const buffer = bh.toBuffer();
  //   let dataLength;
  //   let data;
  //   if(buffer.length >= 2) {
  //     dataLength = buffer[0] * 256 + buffer[1];
  //   }
  //   if(buffer.length >= 2 + dataLength) {
  //     data = buffer.slice(2, 2 + dataLength);
  //     const bh = new BufferHelper();
  //     if(buffer.length > 2 + dataLength) {
  //       bh.concat(buffer.slice(2 + dataLength, buffer.length));
  //     }
  //     console.log(data);
  //     return bh;
  //   } else {
  //     return null;
  //   }
  // };
  const receiveData = (receive, data) => {
    receive.data = Buffer.concat([receive.data, data]);
    checkData(receive);
  };

  const checkData = (receive) => {
    const buffer = receive.data;
    let length = 0;
    let data;
    let codes;
    if (buffer.length < 2) {
      return;
    }
    length = buffer[0] * 256 + buffer[1];
    if (buffer.length >= length + 2) {
      data = buffer.slice(2, length);
      codes = buffer.slice(length, length + 2);
      receive.data = buffer.slice(length + 2, buffer.length);
      console.log('length: ' + length);
      console.log(data);
      console.log(codes);

      if(buffer.length > length + 2) {
        checkData(receive);
      }
    }
  };

  const server = net.createServer(socket => {
    const receive = {
      data: new Buffer(0),
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
