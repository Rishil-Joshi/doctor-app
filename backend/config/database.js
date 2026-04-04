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
        address TEXT,
        date_of_admission DATE,
        hospital_name TEXT,
        referred_by TEXT,
        payment_type TEXT,
        cash_amount NUMERIC,
        on_examination TEXT,
        brief_history TEXT,
        diagnosis TEXT,
        surgery TEXT,
        operation_notes TEXT,
        ao_classification TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS patient_media (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        public_id TEXT NOT NULL,
        media_type TEXT NOT NULL DEFAULT 'image',
        image_type TEXT,
        phase TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrations for existing DBs
    await client.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;`).catch(() => {});
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT;`).catch(() => {});
    // Patient column migrations
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS address TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS date_of_admission DATE;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS hospital_name TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS referred_by TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS payment_type TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS cash_amount NUMERIC;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS on_examination TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS brief_history TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS diagnosis TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS surgery TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS operation_notes TEXT;`).catch(() => {});
    await client.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS ao_classification TEXT;`).catch(() => {});

    console.log('PostgreSQL database initialized');
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
