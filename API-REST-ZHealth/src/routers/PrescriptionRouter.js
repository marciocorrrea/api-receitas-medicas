'use strict';
const express = require('express');
const router = express.Router();

const PrescriptionController = require('../controllers/PrescriptionController');
const AuthMiddleare = require('../middlewares/AuthMiddleare');

router.get('/', AuthMiddleare.authenticate, PrescriptionController.showPrescriptions);
router.put('/:id', AuthMiddleare.authenticate, PrescriptionController.updatePrescription);
router.patch('/:id', AuthMiddleare.authenticate, PrescriptionController.updatePrescription);
router.delete('/:id', AuthMiddleare.authenticate, PrescriptionController.deletePrescription);
router.post('/', AuthMiddleare.authenticate, PrescriptionController.createPrescription);

module.exports = router;
