const mysql = require('mysql2');
require('dotenv').config();

// Maak een connection pool aan. Een pool is efficiënter dan een losse connectie
// omdat het verbindingen hergebruikt.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Welkom01!',
  database: process.env.DB_DATABASE || 'sakila',
  port: process.env.DB_PORT || 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exporteer de pool zodat andere bestanden (zoals je DAO's) ermee kunnen werken
module.exports = pool;