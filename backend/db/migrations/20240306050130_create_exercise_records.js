/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('exercise_records').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('exercise_records', function(t) {
            t.increments('id').primary();
            t.integer('user_id').notNullable();
            t.integer('exercise_id').notNullable();
            t.datetime('start_datetime');
            t.datetime('end_datetime');
            t.integer('duration');
            t.integer('burned_calories');
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
  return knex.schema.hasTable('exercise_records').then(function(exists) {
    if (exists) {
        return knex.schema.dropTable('exercise_records');
    }
});
};
