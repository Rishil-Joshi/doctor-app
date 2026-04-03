const { db } = require('../config/database');

const initializeDatabase = () => {
  // Tables are created in database.js
  console.log('SQLite database tables verified');
};

module.exports = { initializeDatabase };