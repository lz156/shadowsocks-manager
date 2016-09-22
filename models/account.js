'use strict';

module.exports = async function (ctx) {

  const knex = ctx.get('knex.client');
  const tableName = 'account';

  const config = ctx.config.all();
  if(config.empty) {
    await knex.schema.dropTableIfExists(tableName);
  }
  return knex.schema.createTableIfNotExists(tableName, function(table) {
    table.integer('port').primary();
    table.string('password');
  });
};
