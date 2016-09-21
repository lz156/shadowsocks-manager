'use strict';

module.exports = function (ctx) {

  const knex = ctx.get('knex.client');
  const tableName = 'flow';

  return knex.schema.createTableIfNotExists(tableName, function(table) {
    table.integer('port');
    table.integer('flow');
    table.dateTime('time');
  });
};
