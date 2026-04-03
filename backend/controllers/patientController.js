const patientService = require('../services/patientService');
const { formatError } = require('../utils/errors');

/**
 * Create new patient
 * POST /patients
 */
const createPatient = async (req, res) => {
  try {
    const doctorId = req.userId;
    const patient = await patientService.createPatient(doctorId, req.body);
    res.status(201).json({ patient });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Get all patients for a doctor
 * GET /patients
 */
const getPatients = async (req, res) => {
  try {
    const doctorId = req.userId;
    const patients = await patientService.getPatients(doctorId);
    res.json({ patients });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Get patient by ID
 * GET /patients/:patientId
 */
const getPatient = async (req, res) => {
  try {
    const doctorId = req.userId;
    const { patientId } = req.params;
    const patient = await patientService.getPatientById(patientId, doctorId);
    res.json({ patient });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Update patient
 * PUT /patients/:patientId
 */
const updatePatient = async (req, res) => {
  try {
    const doctorId = req.userId;
    const { patientId } = req.params;
    const patient = await patientService.updatePatient(patientId, doctorId, req.body);
    res.json({ patient });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Delete patient
 * DELETE /patients/:patientId
 */
const deletePatient = async (req, res) => {
  try {
    const doctorId = req.userId;
    const { patientId } = req.params;
    await patientService.deletePatient(patientId, doctorId);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

module.exports = { createPatient, getPatients, getPatient, updatePatient, deletePatient };