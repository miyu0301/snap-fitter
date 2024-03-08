/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('channel_user_mappings').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('channel_user_mappings', function(t) {
            t.increments('id').primary();
            t.integer('channel_id').notNullable();
            t.integer('user_id').notNullable();
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
  return knex.schema.hasTable('channel_user_mappings').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('channel_user_mappings');
    }
});
};
