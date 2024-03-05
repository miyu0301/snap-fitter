/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  var testUseres = [
    {
      username: "user1",
      email: "user1@ca",
      password: "pass1",
      goal_id: 1,
      level_id: 1,
      gender: 1,
      birthday: "1990-01-01",
      height: 175.5,
      weight: 70.0,
      registration_datetime: "2023-01-01 12:00:00",
    },
    {
      username: "user2",
      email: "user2@ca",
      password: "pass2",
      goal_id: 2,
      level_id: 2,
      gender: 2,
      birthday: "1995-02-02",
      height: 165.5,
      weight: 65.5,
      registration_datetime: "2023-02-01 13:00:00",
    },
    {
      username: "user3",
      email: "user3@ca",
      password: "pass3",
      registration_datetime: "2023-02-01 13:00:00",
    },
  ]
  await knex('users').insert(testUseres);
};
