const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Replace with your postgres username
    host: 'localhost',
    database: 'fitnessapp', // Replace with your database name
    password: 'password', // Replace with your database password
    port: 5432,
});

module.exports = pool;