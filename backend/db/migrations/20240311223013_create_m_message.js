/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('m_message').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('m_message', function(t) {
            t.increments('id').primary();
            t.string('title', 100).notNullable();
            t.string('message', 500).notNullable();
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
  return knex.schema.hasTable('m_message').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('m_message');
    }
});
};
