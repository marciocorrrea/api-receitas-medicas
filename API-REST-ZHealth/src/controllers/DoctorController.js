'use strict';
const DoctorService = require('../services/DoctorService');

class Authenticate {
    async authenticate(req, res) {
        const { identification, password } = req.body;
        try {
            const verify = await DoctorService.checkExistenceToAuthenticate(identification);
            if (!verify.status) {
                return res.status(403).json({
                    status: 'error',
                    statusCode: 403,
                    info: verify.doctor,
                });
            } else {
                const [doctor] = verify.doctor;
                const checkPassword = DoctorService.checkPassword(password, doctor.password);
                if (!checkPassword) {
                    return res.status(405).json({
                        status: 'error',
                        statusCode: 405,
                        info: 'Invalid password',
                    });
                } else {
                    const token = await DoctorService.generateJWT(doctor.id, doctor.email);
                    if (!token.status) {
                        return res.status(500).json({
                            status: 'error',
                            statusCode: 500,
                            info: 'Invalid password',
                        });
                    } else {
                        return res.status(200).json({
                            status: 'sucess',
                            statusCode: 200,
                            info: 'genetared token',
                            token: token.token,
                        });
                    }
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'Invalid intern',
            });
        }
    }
}

class DoctorController extends Authenticate {
    async createDoctor(req, res) {
        let doctor = { ...req.body };

        try {
            const existes = await DoctorService.checkExistenceToInsert(doctor.email, doctor.cpf, doctor.crm);
            if (existes != true) {
                return res.status(406).json({
                    status: 'error',
                    statusCode: 406,
                    info: 'User already exists',
                    errors: existes,
                    doctor,
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'error when querying data in the database',
                error,
            });
        }

        try {
            const validate = await DoctorService.validateFields(doctor);
            if (validate != true) {
                res.statusCode = 406;
                return res.status(406).json({
                    status: 'error',
                    statusCode: 406,
                    info: 'Failed to validate data',
                    errors: validate,
                    doctor,
                });
            } else {
                const tryToSave = await DoctorService.saveDoctor(doctor);
                if (tryToSave._id == undefined) {
                    return res.status(409).json({
                        status: 'error',
                        errors: tryToSave,
                        statusCode: 409,
                        info: 'Failed to save data',
                        doctor: doctor,
                    });
                } else {
                    const token = await DoctorService.generateJWT(tryToSave._id, tryToSave.email);
                    if (!token.status) {
                        return res.status(202).json({
                            status: 'success',
                            statusCode: 202,
                            info: 'Released registration, token not generated',
                        });
                    } else {
                        tryToSave.password = undefined;
                        return res.status(201).json({
                            status: 'sucess',
                            statusCode: 201,
                            info: 'User created and generated token',
                            tryToSave,
                            token: token.token,
                        });
                    }
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'error saving to database',
                error,
            });
        }
    }

    async showAllDoctors(req, res) {
        const { page, limit } = req.query;
        if (page != undefined && limit != undefined) {
            try {
                const result = await DoctorService.showDoctorsPaginate({}, page, limit);
                return res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    info: 'Data found',
                    page,
                    limit,
                    result,
                });
            } catch (error) {
                return res.status(500).json({
                    status: 'error',
                    statusCode: 500,
                    info: 'error in showing all doctors',
                    error,
                });
            }
        } else {
            try {
                const result = await DoctorService.showDoctors({});
                result.doctors.forEach((doctor) => {
                    doctor.password = undefined;
                });
                return res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    info: 'Data found',
                    result,
                });
            } catch (error) {
                return res.status(500).json({
                    status: 'error',
                    statusCode: 500,
                    info: 'error in showing all doctors',
                    error,
                });
            }
        }
    }

    async deleteDoctor(req, res) {
        const { id } = req.params;
        const tryDelete = await DoctorService.removeDoctor(id);
        if (tryDelete.deletedCount == 1) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                info: 'user deleted',
            });
        } else {
            return res.status(500).json({
                status: 'error',
                statusCode: 500,
                info: 'user not deleted',
            });
        }
    }

    updateDoctor(req, res) {
        const { id } = req.params;
        DoctorService.updateDoctor(id, req.body)
            .then(() => {
                DoctorService.showDoctors({ _id: id }).then((user) => {
                    if (user.count != 0) {
                        DoctorService.updateDoctor(id, { updateAt: Date.now() })
                            .then(() => {
                                user.password = undefined;
                                return res.status(202).json({
                                    status: 'success',
                                    statusCode: 202,
                                    info: 'updated user',
                                    user: user,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        return res.status(404).json({
                            status: 'error',
                            statusCode: 404,
                            info: 'user not found',
                        });
                    }
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    info: 'error saving to database',
                    error,
                });
            });
    }
}

module.exports = new DoctorController();
