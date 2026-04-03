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
  const { name, email, phone, age, gender, details, medicalHistory } = patientData;

  if (!name || !email || !phone) {
    throw new AppError('Patient name, email, and phone are required', 400);
  }

  const patient = await User.createPatient(doctorId, name, email, phone, age, gender, details, medicalHistory);
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

  const updatedPatient = await User.updatePatient(patientId, patientData);
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

  await User.deletePatient(patientId);
  return true;
};

module.exports = {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
