/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .renameTable('channel_user_mappings', 'room_user_mappings')
    .then(function () {
      return knex.schema.table('room_user_mappings', function(table) {
        table.renameColumn('channel_id', 'room_id');
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .renameTable('room_user_mappings', 'channel_user_mappings')
    .then(function () {
      return knex.schema.table('channel_user_mappings', function(table) {
        table.renameColumn('room_id', 'channel_id');
      });
    });
};
