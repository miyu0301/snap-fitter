/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('m_exercise').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('m_exercise', function(t) {
            t.increments('id').primary();
            t.string('name', 100).notNullable();
            t.integer('goal_id').notNullable();
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
  return knex.schema.hasTable('m_exercise').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('m_exercise');
    }
});
};
