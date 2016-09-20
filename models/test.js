'use strict';

module.exports = function (ctx) {

  const knex = ctx.get('knex.client');
  const tableName = 'admin_test';

  return knex.schema.hasTable('admin_test').then(exists => {
    if(exists) {
      knex('admin_test').insert({a: '1'}).then(console.log);
      return Promise.resolve();
    }
    return knex.schema.createTableIfNotExists(tableName, function(table) {
      table.string('a');
    });
  });
};
