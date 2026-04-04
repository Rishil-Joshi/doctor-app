const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role TEXT,
        specialization TEXT,
        clinic_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        details TEXT,
        medical_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrations for existing DBs
    await client.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT;`).catch(() => {});

    console.log('PostgreSQL database initialized');
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
