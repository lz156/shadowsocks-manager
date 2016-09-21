'use strict';

module.exports = function (ctx) {
  const config = ctx.config.all();
  const host = config.listen.host;
  const port = +config.listen.port;

  const net = require('net');
  const server = net.createServer(socket => {
    socket.on('data', data => {
      console.log(data);
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
