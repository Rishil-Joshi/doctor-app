const express = require('express');
const { createPatient, getPatients, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createPatient);
router.get('/', authenticateToken, getPatients);
router.get('/:patientId', authenticateToken, getPatient);
router.put('/:patientId', authenticateToken, updatePatient);
router.delete('/:patientId', authenticateToken, deletePatient);

module.exports = router;