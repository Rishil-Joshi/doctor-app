const express = require('express');
const { createPatient, getPatients, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { uploadPatientMedia, getMedia, deletePatientMedia } = require('../controllers/mediaController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/', authenticateToken, createPatient);
router.get('/', authenticateToken, getPatients);
router.get('/:patientId', authenticateToken, getPatient);
router.put('/:patientId', authenticateToken, updatePatient);
router.delete('/:patientId', authenticateToken, deletePatient);

// Media routes
router.post('/:patientId/media', authenticateToken, upload.single('file'), uploadPatientMedia);
router.get('/:patientId/media', authenticateToken, getMedia);
router.delete('/:patientId/media/:mediaId', authenticateToken, deletePatientMedia);

module.exports = router;