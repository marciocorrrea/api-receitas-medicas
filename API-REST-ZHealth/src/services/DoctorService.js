'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
jwt.Promisse = global.Promisse;

require('../models/Doctors');
const Doctors = mongoose.model('Doctors');

class Authenticate {
    constructor() {
        this.JWTSecret = 'ZhealthTheBestCompanyInTheWorld';
    }

    generatePassword(password) {
        const salt = bcrypt.genSaltSync(1);
        return bcrypt.hashSync(password, salt);
    }

    checkPassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }

    generateJWT(id, email) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id, email }, this.JWTSecret, { expiresIn: '48h' }, (error, token) => {
                if (error != null) {
                    reject({ status: false, error: error });
                } else {
                    resolve({ status: true, token: token });
                }
            });
        });
    }

    checkJWT(token) {
        return new Promise((resolve, reject) => {
            return jwt.verify(token, this.JWTSecret, (error, data) => {
                if (error != null) {
                    reject({ status: false, error: error });
                } else {
                    resolve({ status: true, data: data });
                }
            });
        });
    }
}

class Consult extends Authenticate {
    async checkExistenceToInsert(email, cpf, crm) {
        const errorsExistence = {
            error: 'values exist in the database',
            count: 0,
            details: {},
        };
        email = email.toLowerCase();
        const checkExistenceEmail = await Doctors.exists({ email: email });
        const checkExistenceCpf = await Doctors.exists({ cpf: cpf });
        const checkExistenceCrm = await Doctors.exists({ crm: crm });

        if (checkExistenceEmail) {
            errorsExistence.details.email = 'EMAIL is already in the database.';
            errorsExistence.count++;
        }
        if (checkExistenceCpf) {
            errorsExistence.details.cpf = 'CPF is already in the database.';
            errorsExistence.count++;
        }
        if (checkExistenceCrm) {
            errorsExistence.details.crm = 'CRM is already in the database.';
            errorsExistence.count++;
        }

        if (errorsExistence.count == 0) {
            return true;
        } else {
            return errorsExistence;
        }
    }

    async checkExistenceToAuthenticate(identification) {
        function checkType(value) {
            const regexCPF = new RegExp(/^\d{11}$/);
            const regexEmail = new RegExp(/^[A-z0-9\-\.\$]{1,}\@\w+\.\w{1,4}(\.\D{1,3})?$/);
            const regexCRM = new RegExp(/^\d{4,10}$/);

            if (regexCPF.test(value)) return 'cpf';
            if (regexEmail.test(value)) return 'email';
            if (regexCRM.test(value)) return 'crm';
        }

        async function findCPF() {
            const doctor = await Doctors.find({ cpf: identification });
            if (doctor.length == 0) {
                return {
                    status: false,
                    doctor: 'CPF not found in the database',
                };
            } else {
                return {
                    status: true,
                    doctor,
                };
            }
        }
        async function findEmail() {
            const email = identification.toLowerCase();
            const doctor = await Doctors.find({ email: email });
            if (doctor.length == 0) {
                return {
                    status: false,
                    doctor: 'Email not found in the database',
                };
            } else {
                return {
                    status: true,
                    doctor,
                };
            }
        }
        async function findCRM() {
            const doctor = await Doctors.find({ crm: identification });
            if (doctor.length == 0) {
                return {
                    status: false,
                    doctor: 'CRM not found in the database',
                };
            } else {
                return {
                    status: true,
                    doctor,
                };
            }
        }

        switch (checkType(identification)) {
            case 'cpf':
                return findCPF();
            case 'email':
                return findEmail();
            case 'crm':
                return findCRM();
            default:
                return {
                    status: false,
                    doctor: 'unidentified data type',
                };
        }
    }
}

class Validate extends Consult {
    async validateFields(user, type) {
        const errorsValidate = {
            error: 'Invalid filds',
            count: 0,
            errors: {},
        };

        const regexName = new RegExp(/^(\s+)?([A-ú]+\s?)+(\s+)?$/);
        const regexPassword = new RegExp(/^(?=.*[A-ú])(?=.*\d)[A-ú\d]{8,}$/);
        const regexState = new RegExp(/^[A-z]{2,20}$/);
        const regexCPF = new RegExp(/^\d{11}$/);
        const regexCRM = new RegExp(/^\d{4,10}$/);
        const regexSex = new RegExp(/^M?F?$/);
        const regexBirth = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
        const regexEmail = new RegExp(/^[A-z0-9\-\.\$]{1,}\@\w+\.\w{1,4}(\.\D{1,3})?$/);

        if (!regexEmail.test(user.email)) {
            errorsValidate.errors.email = 'Differs from email format. Exemple: johndoe@zhealth.com.br';
            errorsValidate.count++;
        }

        if (!regexCPF.test(user.cpf)) {
            errorsValidate.errors.cpf =
                'It is not a valid CPF, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912';
            errorsValidate.count++;
        }

        if (!regexCRM.test(user.crm)) {
            errorsValidate.errors.crm =
                'It is not a valid CRM, it must contain between 4 and 10 digits, letters or special characters are not accepted. Example: 123456';
            errorsValidate.count++;
        }

        if (!regexBirth.test(user.birth)) {
            errorsValidate.errors.birth = 'invalid date format, the correct one should be: 00/00/000';
            errorsValidate.count++;
        }

        if (!regexName.test(user.name)) {
            errorsValidate.errors.name =
                'Invalid name, minimum 2 characters, numbers or special characters are not accepted';
            errorsValidate.count++;
        }
        if (!regexState.test(user.statecrm)) {
            errorsValidate.errors.stateCRM =
                'Type of status is invalid, numbers or special characters are not accepted. Example: PR or Distrito Federal';
            errorsValidate.count++;
        }
        if (!regexSex.test(user.sex)) {
            errorsValidate.errors.sex = 'Invalid Sex';
            errorsValidate.count++;
        }

        if (!regexPassword.test(user.firstPassword)) {
            errorsValidate.errors.password = 'Minimum of eight characters, at least one letter and one number';
            errorsValidate.count++;
        } else if (user.firstPassword != user.secondPassword) {
            errorsValidate.errors.password = 'Diverging passwords';
            errorsValidate.count++;
        }

        if (errorsValidate.count == 0) {
            return true;
        } else {
            return errorsValidate;
        }
    }
}

class DoctorService extends Validate {
    async saveDoctor(user) {
        user.password = this.generatePassword(user.firstPassword);
        user.firstPassword = undefined;
        user.secondPassword = undefined;
        user.email = user.email.toLowerCase();
        return await Doctors.create(user);
    }

    async showDoctors(query = {}) {
        try {
            const doctors = await Doctors.find(query);
            return {
                count: doctors.length,
                doctors,
            };
        } catch (error) {
            return error;
        }
    }

    async showDoctorsPaginate(query = {}, skip, limit) {
        skip = parseInt(skip);
        limit = parseInt(limit);
        try {
            const count = await Doctors.find(query);
            if (skip == 0) {
                skip == 1;
            }
            const doctors = await Doctors.find(query)
                .skip(skip * limit - limit)
                .limit(limit);

            return {
                count: count.length,
                doctors,
            };
        } catch (error) {
            return error;
        }
    }

    async updateDoctor(id, where) {
        return new Promise((resolve, reject) => {
            return Doctors.updateOne(
                { _id: id },
                { $set: where },
                {
                    runValidators: true,
                },
                (error, state) => {
                    if (error != undefined) {
                        reject(error);
                    } else {
                        resolve(state);
                    }
                }
            );
        });
    }

    async removeDoctor(id) {
        return await Doctors.deleteOne({ _id: id });
    }
}

module.exports = new DoctorService();
