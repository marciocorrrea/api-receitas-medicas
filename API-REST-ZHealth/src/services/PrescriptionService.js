'use strict';
const mongoose = require('mongoose');
require('../models/Prescription');
const Prescription = mongoose.model('Prescription');

class Consult {}

class Validate extends Consult {
    async validateFields(user) {
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

        if (!regexCPF.test(user.cpf)) {
            errorsValidate.errors.cpf =
                'It is not a valid CPF client, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912';
            errorsValidate.count++;
        }
        if (!regexCPF.test(user.doctor_details.cpf)) {
            errorsValidate.errors.cpf =
                'It is not a valid CPF doctors, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912';
            errorsValidate.count++;
        }

        if (!regexCRM.test(user.doctor_details.crm)) {
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
                'Invalid name client, minimum 2 characters, numbers or special characters are not accepted';
            errorsValidate.count++;
        }
        if (!regexName.test(user.doctor_details.name)) {
            errorsValidate.errors.name =
                'Invalid name doctor, minimum 2 characters, numbers or special characters are not accepted';
            errorsValidate.count++;
        }
        if (!regexState.test(user.doctor_details.statecrm)) {
            errorsValidate.errors.stateCRM =
                'Type of status is invalid, numbers or special characters are not accepted. Example: PR or Distrito Federal';
            errorsValidate.count++;
        }
        if (!regexSex.test(user.sex)) {
            errorsValidate.errors.sex = 'Invalid Sex';
            errorsValidate.count++;
        }
        if (user.medicines.length == 0) {
            errorsValidate.errors.medicines = 'Invalid medicines';
            errorsValidate.count++;
        }

        if (errorsValidate.count == 0) {
            return true;
        } else {
            return errorsValidate;
        }
    }
}

class PrescriptionService extends Validate {
    async savePrescription(prescription) {
        return await Prescription.create(prescription);
    }

    async showPrescriptions(query) {
        return await Prescription.find(query); /*populate('doctor')*/
    }

    async updatePrescriptions(id, where) {
        return await Prescription.updateOne({ _id: id }, { $set: where });
    }

    async removePrescriptions(id) {
        return await Prescription.deleteOne({ _id: id });
    }
}
module.exports = new PrescriptionService();
