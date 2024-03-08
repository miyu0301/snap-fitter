/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('channels').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('channels', function(t) {
            t.increments('id').primary();
            t.string('channel_name', 100).notNullable();
            t.integer('create_user_id').notNullable();
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
  return knex.schema.hasTable('channels').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('channels');
    }
});
};
