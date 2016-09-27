'use strict';

module.exports = function (ctx) {
  const dgram = require('dgram');
  const client = dgram.createSocket('udp4');

  const config = ctx.config.all();
  const host = config.shadowsocks.address.split(':')[0];
  const port = +config.shadowsocks.address.split(':')[1];

  const knex = ctx.get('knex.client');

  const moment = require('moment');
  let lastFlow;

  const sendPing = () => {
    client.send(new Buffer('ping'), port, host);
  };

  const sendMessage = (message) => {
    console.log('send: ' + message);
    const client = dgram.createSocket('udp4');
    client.send(message, port, host, (err) => {
      // client.on('message', function(m, r) {
        // console.log(m.toString());
        client.close();
      // });
    });
  };

  const startUp = async () => {
    client.send(new Buffer('ping'), port, host);
    const accounts = await knex('account').select([ 'port', 'password' ]);
    accounts.forEach(f => {
      sendMessage(`add: {"server_port": ${ f.port }, "password": "${ f.password }"}`);
    });
  };

  const compareWithLastFlow = (flow, lastFlow) => {
    const realFlow = {};
    if(!lastFlow) {
      return flow;
    }
    for(const f in flow) {
      if(lastFlow[f] !== flow[f]) {
        realFlow[f] = flow[f];
      }
    }
    return realFlow;
  };

  client.on('message', async (msg, rinfo) => {
    const msgStr = new String(msg);
    if(msgStr.substr(0, 5) === 'stat:') {
      let flow = JSON.parse(msgStr.substr(5));
      const realFlow = compareWithLastFlow(flow, lastFlow);
      lastFlow = flow;
      const insertFlow = Object.keys(realFlow).map(m => {
        return {
          port: +m,
          flow: +flow[m],
          time: Date.now(),
        };
      }).filter(f => {
        return f.flow > 0;
      });
      const accounts = await knex('account').select([ 'port' ]);
      insertFlow.forEach(fe => {
        const account = accounts.filter(f => {
          return fe.port === f.port;
        })[0];
        if(!account) {
          sendMessage(`remove: {"server_port": ${ fe.port }}`);
        }
      });
      knex('flow').insert(insertFlow).then();
    };
  });

  client.on('error', (err) => {
    console.log(`client error:\n${err.stack}`);
  });

  startUp();
  // sendPing();
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

  const listAccount = async (options = {}) => {
    try {
      if(!options.flow) {
        const accounts = await knex('account').select([ 'port', 'password' ]);
        return accounts;
      }
      const startTime = moment(options.startTime || new Date(0)).toDate();
      const endTime = moment(options.endTime || new Date()).toDate();

      // const accounts = await knex('account')
      // .select([ 'account.port', 'account.password', 'flow.flow' ])
      // .leftJoin('flow', 'account.port', 'flow.port')
      // .groupBy('account.port').sum('flow.flow as sumFlow')
      // .whereBetween('flow.time', [options.startTime, options.endTime]);

      const accounts = await knex('account').select([ 'port', 'password' ]);
      const flows = await knex('flow').select([ 'port', 'sumFlow' ])
      .sum('flow as sumFlow').groupBy('port')
      .whereBetween('time', [ startTime, endTime ]);

      accounts.map(m => {
        const flow = flows.filter(f => {
          return f.port === m.port;
        })[0];
        if(flow) {
          m.sumFlow = flow.sumFlow;
        } else {
          m.sumFlow = 0;
        }
        return m;
      });

      return accounts;
    } catch(err) {
      console.log(err);
      Promise.reject('error');
    }
  };

  ctx.set('shadowsocks', {
    addAccount,
    removeAccount,
    changePassword,
    listAccount,
  });
};
