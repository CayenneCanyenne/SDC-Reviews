const { Pool } = require('pg');

require('dotenv').config();

const {
  DB_HOST, DB_PORT, DB_USER, DB_NAME,
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  database: DB_NAME,
});

pool.connect()
  .then(() => console.log('Successfully Connected to PostgreSQL!'));

module.exports = pool;
