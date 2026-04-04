const { uploadMedia, getPatientMedia, deleteMedia } = require('../services/mediaService');
const { User } = require('../models/User');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

const verifyPatientOwnership = async (patientId, doctorId, next) => {
  const patient = await User.getPatientById(patientId);
  if (!patient) { next(new AppError(ERROR_MESSAGES.PATIENT_NOT_FOUND, 404)); return null; }
  if (parseInt(patient.doctor_id) !== parseInt(doctorId)) { next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403)); return null; }
  return patient;
};

const uploadPatientMedia = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId);
    const patient = await verifyPatientOwnership(patientId, req.userId, next);
    if (!patient) return;

    if (!req.file) return next(new AppError('No file provided', 400));

    const { imageType, phase } = req.body;
    const media = await uploadMedia(patientId, req.file, imageType, phase);
    res.status(201).json({ media });
  } catch (err) {
    next(err);
  }
};

const getMedia = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId);
    const patient = await verifyPatientOwnership(patientId, req.userId, next);
    if (!patient) return;

    const { type, phase } = req.query;
    const media = await getPatientMedia(patientId, { mediaType: type, phase });
    res.json({ media });
  } catch (err) {
    next(err);
  }
};

const deletePatientMedia = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId);
    const mediaId = parseInt(req.params.mediaId);
    const patient = await verifyPatientOwnership(patientId, req.userId, next);
    if (!patient) return;

    await deleteMedia(mediaId, patientId);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadPatientMedia, getMedia, deletePatientMedia };
