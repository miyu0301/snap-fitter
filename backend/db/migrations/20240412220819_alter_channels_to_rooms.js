/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .renameTable('channels', 'rooms')
    .then(function () {
      return knex.schema.table('rooms', function(table) {
        table.renameColumn('channel_name', 'room_name');
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .renameTable('rooms', 'channels')
    .then(function () {
      return knex.schema.table('channels', function(table) {
        table.renameColumn('room_name', 'channel_name');
      });
    });
};
