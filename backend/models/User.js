const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

class User {
  static async create(username, email, password, firstName, lastName, phone = '', specialization = '', clinicName = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          'INSERT INTO users (username, email, password, first_name, last_name, phone, specialization, clinic_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [username, email, hashedPassword, firstName, lastName, phone, specialization, clinicName],
          function(err) {
            if (err) reject(new Error('Error creating user: ' + err.message));
            else User.findById(this.lastID).then(resolve).catch(reject);
          }
        );
      } catch (err) {
        reject(new Error('Error creating user: ' + err.message));
      }
    });
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(new Error('Error finding user: ' + err.message));
        else resolve(row);
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(new Error('Error finding user: ' + err.message));
        else resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, phone, first_name, last_name, specialization, clinic_name, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(new Error('Error finding user: ' + err.message));
        else resolve(row);
      });
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

class Patient {
  static async create(doctorId, name, email, phone, age, gender, details, medicalHistory) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO patients (doctor_id, name, email, phone, age, gender, details, medical_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [doctorId, name, email, phone, age, gender, details, medicalHistory],
        function(err) {
          if (err) reject(new Error('Error creating patient: ' + err.message));
          else Patient.findById(this.lastID, doctorId).then(resolve).catch(reject);
        }
      );
    });
  }

  static async findByDoctorId(doctorId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM patients WHERE doctor_id = ? ORDER BY created_at DESC', [doctorId], (err, rows) => {
        if (err) reject(new Error('Error finding patients: ' + err.message));
        else resolve(rows || []);
      });
    });
  }

  static async findById(id, doctorId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM patients WHERE id = ? AND doctor_id = ?', [id, doctorId], (err, row) => {
        if (err) reject(new Error('Error finding patient: ' + err.message));
        else resolve(row);
      });
    });
  }

  static async update(id, doctorId, data) {
    return new Promise((resolve, reject) => {
      const { name, email, phone, age, gender, details, medicalHistory } = data;
      db.run(
        'UPDATE patients SET name = ?, email = ?, phone = ?, age = ?, gender = ?, details = ?, medical_history = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND doctor_id = ?',
        [name, email, phone, age, gender, details, medicalHistory, id, doctorId],
        function(err) {
          if (err) reject(new Error('Error updating patient: ' + err.message));
          else Patient.findById(id, doctorId).then(resolve).catch(reject);
        }
      );
    });
  }

  static async delete(id, doctorId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM patients WHERE id = ? AND doctor_id = ?', [id, doctorId], function(err) {
        if (err) reject(new Error('Error deleting patient: ' + err.message));
        else resolve(this.changes > 0 ? { id } : null);
      });
    });
  }
}

module.exports = { User, Patient };