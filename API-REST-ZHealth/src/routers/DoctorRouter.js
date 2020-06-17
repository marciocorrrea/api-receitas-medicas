'use strict';
const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/DoctorController');
const AuthMiddleare = require('../middlewares/AuthMiddleare');

router.get('/', AuthMiddleare.authenticate, DoctorController.showAllDoctors);
router.put('/:id', AuthMiddleare.authenticate, DoctorController.updateDoctor);
router.patch('/:id', AuthMiddleare.authenticate, DoctorController.updateDoctor);
router.delete('/:id', AuthMiddleare.authenticate, DoctorController.deleteDoctor);
router.post('/', DoctorController.createDoctor);
router.post('/authenticate', DoctorController.authenticate);

module.exports = router;
