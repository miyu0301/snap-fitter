const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    password : 'password',
    database : 'fitnessapp'
  }
});

module.exports = knex;
