const { User } = require('../models/User');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

/**
 * Get all patients for a doctor
 * @param {number} doctorId
 * @returns {array} patients
 */
const getPatients = async (doctorId) => {
  const patients = await User.getPatientsByDoctorId(doctorId);
  return patients;
};

/**
 * Create a new patient
 * @param {number} doctorId
 * @param {object} patientData
 * @returns {object} patient
 */
const createPatient = async (doctorId, patientData) => {
  const {
    name, email, phone, age, gender, details, medicalHistory,
    address, dateOfAdmission, hospitalName, referredBy,
    paymentType, cashAmount, onExamination, briefHistory,
    diagnosis, surgery, operationNotes, aoClassification,
  } = patientData;

  if (!name) {
    throw new AppError('Patient name is required', 400);
  }

  const { pool } = require('../config/database');
  const hashedPassword = null;
  const result = await pool.query(
    `INSERT INTO patients (
      doctor_id, name, email, phone, age, gender, details, medical_history,
      address, date_of_admission, hospital_name, referred_by,
      payment_type, cash_amount, on_examination, brief_history,
      diagnosis, surgery, operation_notes, ao_classification
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
    RETURNING id`,
    [
      doctorId, name, email || null, phone || null, age || null, gender || null,
      details || null, medicalHistory || null,
      address || null, dateOfAdmission || null, hospitalName || null, referredBy || null,
      paymentType || null, cashAmount || null, onExamination || null, briefHistory || null,
      diagnosis || null, surgery || null, operationNotes || null, aoClassification || null,
    ]
  );

  const patient = await User.getPatientById(result.rows[0].id);
  return patient;
};

/**
 * Get patient by ID
 * @param {number} patientId
 * @param {number} doctorId
 * @returns {object} patient
 */
const getPatientById = async (patientId, doctorId) => {
  const patient = await User.getPatientById(patientId);

  if (!patient) {
    throw new AppError(ERROR_MESSAGES.PATIENT_NOT_FOUND, 404);
  }

  // Verify ownership
  if (patient.doctor_id !== doctorId) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
  }

  return patient;
};

/**
 * Update patient
 * @param {number} patientId
 * @param {number} doctorId
 * @param {object} patientData
 * @returns {object} patient
 */
const updatePatient = async (patientId, doctorId, patientData) => {
  const patient = await User.getPatientById(patientId);

  if (!patient) {
    throw new AppError(ERROR_MESSAGES.PATIENT_NOT_FOUND, 404);
  }

  // Verify ownership
  if (patient.doctor_id !== doctorId) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
  }

  const updatedPatient = await User.updatePatient(patientId, doctorId, patientData);
  return updatedPatient;
};

/**
 * Delete patient
 * @param {number} patientId
 * @param {number} doctorId
 * @returns {boolean}
 */
const deletePatient = async (patientId, doctorId) => {
  const patient = await User.getPatientById(patientId);

  if (!patient) {
    throw new AppError(ERROR_MESSAGES.PATIENT_NOT_FOUND, 404);
  }

  // Verify ownership
  if (patient.doctor_id !== doctorId) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
  }

  await User.deletePatient(patientId, doctorId);
  return true;
};

module.exports = {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
