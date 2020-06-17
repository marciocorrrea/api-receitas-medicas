const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true,
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
    cpf: {
        type: String,
        required: [true, 'CPF is required'],
        validate: {
            validator: (v) => {
                return /^\d{11}$/.test(v);
            },
            message: (props) =>
                `${props.value}: It is not a valid CPF, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912`,
        },
    },
    medicines: [
        {
            quantity: {
                type: String,
                required: [true, 'medicines quantity is required'],
            },
            description: {
                type: String,
                required: [true, 'medicines description is required'],
            },
            dosage: {
                type: String,
                required: [true, 'medicines dosage is required'],
            },
            frequency: {
                type: String,
                required: [true, 'medicines frequency is required'],
            },
        },
    ],

    doctor_details: {
        cpf: {
            type: String,
            required: [true, 'CPF is required'],
            validate: {
                validator: (v) => {
                    return /^\d{11}$/.test(v);
                },
                message: (props) =>
                    `${props.value}: It is not a valid CPF, it must contain exactly 11 digits and cannot contain letter or special characters. example: 12345678912`,
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
        crm: {
            type: String,
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
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
    },
});

mongoose.model('Prescription', PrescriptionSchema);
