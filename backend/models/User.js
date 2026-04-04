const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

class User {
  static async create(username, email, password, firstName, lastName, phone = '', specialization = '', clinicName = '', role = '') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name, phone, specialization, clinic_name, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [username, email || null, hashedPassword, firstName || null, lastName || null, phone || null, specialization || null, clinicName || null, role || null]
    );
    return User.findById(result.rows[0].id);
  }

  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, phone, first_name, last_name, specialization, clinic_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Proxy methods used by patientService
  static async createPatient(doctorId, name, email, phone, age, gender, details, medicalHistory) {
    return Patient.create(doctorId, name, email, phone, age, gender, details, medicalHistory);
  }

  static async getPatientsByDoctorId(doctorId) {
    return Patient.findByDoctorId(doctorId);
  }

  static async getPatientById(id) {
    return Patient.findByIdOnly(id);
  }

  static async updatePatient(id, doctorId, data) {
    return Patient.update(id, doctorId, data);
  }

  static async deletePatient(id, doctorId) {
    return Patient.delete(id, doctorId);
  }
}

class Patient {
  static async create(doctorId, name, email, phone, age, gender, details, medicalHistory) {
    const result = await pool.query(
      `INSERT INTO patients (doctor_id, name, email, phone, age, gender, details, medical_history)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [doctorId, name, email, phone, age, gender, details, medicalHistory]
    );
    return Patient.findByIdOnly(result.rows[0].id);
  }

  static async findByDoctorId(doctorId) {
    const result = await pool.query(
      'SELECT * FROM patients WHERE doctor_id = $1 ORDER BY created_at DESC',
      [doctorId]
    );
    return result.rows;
  }

  static async findByIdOnly(id) {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async update(id, doctorId, data) {
    const { name, email, phone, age, gender, details, medicalHistory } = data;
    await pool.query(
      `UPDATE patients SET name=$1, email=$2, phone=$3, age=$4, gender=$5, details=$6,
       medical_history=$7, updated_at=CURRENT_TIMESTAMP WHERE id=$8 AND doctor_id=$9`,
      [name, email, phone, age, gender, details, medicalHistory, id, doctorId]
    );
    return Patient.findByIdOnly(id);
  }

  static async delete(id, doctorId) {
    const result = await pool.query(
      'DELETE FROM patients WHERE id = $1 AND doctor_id = $2',
      [id, doctorId]
    );
    return result.rowCount > 0 ? { id } : null;
  }
}

module.exports = { User, Patient };
