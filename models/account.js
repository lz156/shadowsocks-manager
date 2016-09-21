'use strict';

module.exports = function (ctx) {

  const knex = ctx.get('knex.client');
  const tableName = 'account';

  return knex.schema.createTableIfNotExists(tableName, function(table) {
    table.integer('port').primary();
    table.string('password');
  });
};
