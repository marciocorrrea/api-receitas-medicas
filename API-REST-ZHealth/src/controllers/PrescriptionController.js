'use strict';
const PrescriptionService = require('../services/PrescriptionService');
const DoctorService = require('../services/DoctorService');

class PrescriptionController {
    async createPrescription(req, res) {
        try {
            const validate = await PrescriptionService.validateFields(req.body);
            if (!validate) {
                res.status(401).json({
                    info: 'incorrect data',
                    statusCode: '401',
                    Error: error,
                });
            } else {
                const authToken = req.headers['authorization'];
                const bearer = authToken.split(' ');
                const token = bearer[1];
                const { data } = await DoctorService.checkJWT(token);
                const result = await PrescriptionService.savePrescription({ ...req.body, doctor: data.id });
                if (result._id == undefined) {
                    res.status(401).json({
                        info: 'fail to save',
                        statusCode: '401',
                        Error: error,
                    });
                } else {
                    res.status(201).json({
                        info: 'prescription created',
                        statusCode: '201',
                        prescription: result,
                    });
                }
            }
        } catch (error) {
            res.status(401).json({
                info: 'internal application failure',
                statusCode: '401',
                Error: error,
            });
        }
    }

    async showPrescriptions(req, res) {
        try {
            const authToken = req.headers['authorization'];
            const bearer = authToken.split(' ');
            const token = bearer[1];
            const { data } = await DoctorService.checkJWT(token);
            const prescriptionsDoctorLogged = await PrescriptionService.showPrescriptions({
                doctor: data.id,
            });
            res.status(200).json({
                info: 'prescriptions found',
                statusCode: '201',
                count: prescriptionsDoctorLogged.length,
                prescription: prescriptionsDoctorLogged,
            });
        } catch (error) {
            res.status(401).json({
                info: 'prescriptions not found',
                statusCode: '400',
                Error: error,
            });
        }
    }

    async deletePrescription(req, res) {
        const { id } = req.params;
        const tryDelete = await PrescriptionService.removePrescriptions(id);
        if (tryDelete.deletedCount == 1) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                info: 'prescription deleted',
            });
        } else {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'prescription not deleted',
            });
        }
    }

    async updatePrescription(req, res) {
        try {
            const { id } = req.params;
            const updateAt = await PrescriptionService.updatePrescriptions(id, req.body);
            if (updateAt.nModified != 1) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    info: 'no prescription updated',
                });
            } else {
                const prescription = await PrescriptionService.showPrescriptions({ _id: id });
                return res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    info: 'prescription updated',
                    prescription,
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'internal error',
            });
        }
    }
}

module.exports = new PrescriptionController();
