const { assert } = require('chai');
const MongoDB = require('../database/db');
const DoctorService = require('../services/DoctorService');
const PrescriptionService = require('../services/PrescriptionService');

MongoDB.connect();

let TEST_DOCTOR = {
    name: 'ZHealth',
    cpf: '31801774482',
    email: 'marciocorrea@ZHealth.com.br',
    birth: '16/03/1992',
    crm: '433029802',
    statecrm: 'PR',
    sex: 'M',
    firstPassword: 'ZHealth2020',
    secondPassword: 'ZHealth2020',
};

let TEST_PRESCRIPRION = {
    cpf: '31801778152',
    name: 'ZHealth',
    birth: '16/03/1992',
    sex: 'M',
    medicines: [
        {
            description: 'Remedy one',
            quantity: '30ml',
            dosage: '3',
            frequency: '6h',
        },
        {
            description: 'Remedy one',
            quantity: '1',
            dosage: '4',
            frequency: '12h',
        },
    ],
    doctor_details: {
        name: 'Marcio',
        cpf: '03309273104',
        crm: '12345678',
        statecrm: 'DF',
    },
};

describe('Prescrition schema Services ', async () => {
    it('validate prescrition', async () => {
        const result = await PrescriptionService.validateFields(TEST_PRESCRIPRION);
        assert.equal(result, true);
    });

    it('create prescrition', async () => {
        const { _id } = await DoctorService.saveDoctor(TEST_DOCTOR);
        const result = await PrescriptionService.savePrescription({ ...TEST_PRESCRIPRION, doctor: _id });
        assert.equal(result.cpf, TEST_PRESCRIPRION.cpf);
    });
    it('read prescrition', async () => {
        const [{ name }] = await PrescriptionService.showPrescriptions({ cpf: TEST_PRESCRIPRION.cpf });
        assert.equal(name, TEST_PRESCRIPRION.name);
    });
    it('update prescrition', async () => {
        TEST_PRESCRIPRION.cpf = '00000000000';
        const [{ _id }] = await PrescriptionService.showPrescriptions();
        const result = await PrescriptionService.updatePrescriptions(_id, TEST_PRESCRIPRION);
        assert.equal(result.nModified, 1);
    });
    it('delete prescrition', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR.cpf });
        let [{ _id }] = doctors;
        await DoctorService.removeDoctor(_id);
        _id = undefined;
        const [prescriptions] = await PrescriptionService.showPrescriptions({ cpf: TEST_PRESCRIPRION.cpf });
        const id = prescriptions._id;
        const result = await PrescriptionService.removePrescriptions(id);
        assert.equal(result.deletedCount, 1);
    });
});
