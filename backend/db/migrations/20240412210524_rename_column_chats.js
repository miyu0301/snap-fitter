/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('chats', function(table) {
    table.renameColumn('to_channel_id', 'to_room_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('chats', function(table) {
    table.renameColumn('to_room_id', 'to_channel_id');
  });
};
