/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('chats').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('chats', function(t) {
            t.increments('id').primary();
            t.integer('from_user_id').notNullable();
            t.integer('to_user_id');
            t.integer('to_channel_id');
            t.string('comment');
            t.datetime('created_datetime').notNullable();
            t.timestamps(true, true);
            
        });
    }else{
        return new Error("The table already exists");
    }
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.hasTable('chats').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('chats');
    }
});
};
