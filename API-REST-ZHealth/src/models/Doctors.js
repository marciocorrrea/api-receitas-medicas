const mongoose = require('mongoose');

const DoctorsSchema = new mongoose.Schema({
    cpf: {
        type: String,
        required: [true, 'CPF is required'],
        unique: true,
        validate: {
            validator: (v) => {
                return /^\d{11}$/.test(v);
            },
            message: (props) =>
                `${props.value}: It is not a valid CPF, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912`,
        },
    },
    email: {
        type: String,
        required: [true, 'EMAIL is required'],
        unique: true,
        validate: {
            validator: (v) => {
                return /^[A-z0-9\-\.\$]{1,}\@\w+\.\w{1,4}(\.\D{1,3})?$/.test(v);
            },
            message: (props) => `${props.value}: Differs from email format. Exemple: johndoe@zhealth.com.br`,
        },
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: {
            validator: (v) => {
                return /^((\s+)?([A-ú]+\s?)+(\s+)?)$/.test(v);
            },
            message: (props) =>
                `${props.value}: is not a valid name, minimum 2 characters, numbers or special characters are not accepted. Exemple: john Doe.`,
        },
    },
    birth: {
        type: String,
        required: [true, 'birth is required'],
        validate: {
            validator: (v) => {
                return /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v);
            },
            message: (props) => `${props.value}: invalid date format, the correct one should be: 00/00/000`,
        },
    },
    crm: {
        type: String,
        unique: true,
        required: [true, 'crm is required'],
        validate: {
            validator: (v) => {
                return /^\d{4,10}$/.test(v);
            },
            message: (props) =>
                `${props.value}: It is not a valid CRM, it must contain between 4 and 10 digits, letters or special characters are not accepted. Example: 123456`,
        },
    },
    statecrm: {
        type: String,
        required: [true, 'state crm is required'],
        validate: {
            validator: (v) => {
                return /^[A-z]{2,20}$/.test(v);
            },
            message: (props) =>
                `${props.value}: Type of status is invalid, numbers or special characters are not accepted. Example: PR or Distrito Federal.`,
        },
    },
    sex: {
        type: String,
        required: [true, 'sex is required'],
        validate: {
            validator: (v) => {
                return /^((\s+)?([A-ú]+\s?)+(\s+)?)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid sex, You must select between M or F`,
        },
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
    },
});

mongoose.model('Doctors', DoctorsSchema);
