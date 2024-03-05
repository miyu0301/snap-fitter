/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('users').then(function(exists) {
      if (!exists) {
          return knex.schema.createTable('users', function(t) {
              t.increments('id').primary();
              t.string('username', 100).notNullable();
              t.string('email', 300).notNullable();
              t.string('password').notNullable();
              t.integer('goal_id');
              t.integer('level_id');
              t.integer('gender');
              t.date('birthday');
              t.decimal('height', 10, 2);
              t.decimal('weight', 10, 2);
              t.datetime('registration_datetime').notNullable();
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
  return knex.schema.hasTable('users').then(function(exists) {
      if (exists) {
          return knex.schema.dropTable('users');
      }
  });
};
