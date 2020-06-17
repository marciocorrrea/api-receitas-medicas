const MongoDB = require('../database/db');
MongoDB.connect();
const { expect, assert } = require('chai');
const DoctorService = require('../services/DoctorService');

let TEST_DOCTOR_RIGHT = {
    name: 'ZHealth',
    cpf: '31801778154',
    email: 'marcio@ZHealth.com.br',
    birth: '16/03/1992',
    crm: '4330296902',
    statecrm: 'PR',
    sex: 'M',
    firstPassword: 'ZHealth2020',
    secondPassword: 'ZHealth2020',
};
let TEST_DOCTOR_RIGHT_UPDATE = {
    name: 'ZHealth The best',
    email: 'marciocorrea@ZHealth.com.br',
    birth: '16/03/1990',
    crm: '43302902',
    statecrm: 'DF',
    sex: 'M',
};
let TEST_DOCTOR_WRONG = {
    name: 'ZHealth@',
    cpf: '31801778154@',
    email: 'marcio@ZHealth.com.br@0',
    birth: '16/03/1992@',
    crm: '4330296902@',
    statecrm: 'PR@',
    sex: 'M@',
    firstPassword: 'ZHealth2020@',
    secondPassword: 'ZHealth2020@',
};

describe('Doctor schema Services ', async () => {
    it('Validate right doctor', async () => {
        expect(await DoctorService.validateFields(TEST_DOCTOR_RIGHT)).to.equal(true);
    });
    it('Validate wrong doctor', async () => {
        const wrong = await DoctorService.validateFields(TEST_DOCTOR_WRONG);
        expect(wrong.error).to.equal('Invalid filds');
    });

    it('Create doctor', async () => {
        const result = await DoctorService.saveDoctor(TEST_DOCTOR_RIGHT);
        assert.equal(result.cpf, TEST_DOCTOR_RIGHT.cpf);
    });

    it('Read One', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR_RIGHT.cpf });
        const [{ cpf }] = doctors;
        assert.equal(cpf, TEST_DOCTOR_RIGHT.cpf);
    });
    it('Read All and Paginate', async () => {
        const { doctors } = await DoctorService.showDoctorsPaginate({}, 1, 1);
        assert.equal(doctors.length, 1);
    });

    it('checks if any value exists true', async () => {
        expect(
            await DoctorService.checkExistenceToInsert(
                TEST_DOCTOR_WRONG.email,
                TEST_DOCTOR_WRONG.cpf,
                TEST_DOCTOR_WRONG.crm
            )
        ).to.equal(true);
    });
    it('checks if any value exists false', async () => {
        const result = await DoctorService.checkExistenceToInsert(
            TEST_DOCTOR_WRONG.email,
            TEST_DOCTOR_RIGHT.cpf,
            TEST_DOCTOR_WRONG.crm
        );
        assert.equal(result.error, 'values exist in the database');
    });

    it('check if the value exists True', async () => {
        const result = await DoctorService.checkExistenceToAuthenticate(TEST_DOCTOR_RIGHT.cpf);
        assert.equal(result.status, true);
    });
    it('check if the value exists True', async () => {
        const result = await DoctorService.checkExistenceToAuthenticate(TEST_DOCTOR_WRONG.cpf);
        assert.equal(result.doctor, 'unidentified data type');
    });

    const { firstPassword } = TEST_DOCTOR_RIGHT;
    it('generate and test', () => {
        const password = DoctorService.generatePassword(firstPassword);
        expect(DoctorService.checkPassword(firstPassword, password)).to.equal(true);
    });

    it('generate and test', async () => {
        const { doctors } = await DoctorService.showDoctors({ name: TEST_DOCTOR_RIGHT.name });
        const [{ _id, email }] = doctors;
        const JWT = await DoctorService.generateJWT(_id, email);
        const check = await DoctorService.checkJWT(JWT.token);
        assert.equal(true, check.status);
    });

    it('Update one thing', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR_RIGHT.cpf });
        const [{ _id }] = doctors;
        const result = await DoctorService.updateDoctor(_id, { name: 'ZHealth the best' });
        assert.equal(true, result.ok);
    });
    it('Update any things', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR_RIGHT.cpf });
        const [{ _id }] = doctors;
        const result = await DoctorService.updateDoctor(_id, TEST_DOCTOR_RIGHT_UPDATE);
        assert.equal(true, result.ok);
    });

    it('Delete one doctor', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR_RIGHT.cpf });
        const [{ _id }] = doctors;
        const result = await DoctorService.removeDoctor(_id);
        assert.equal(true, result.deletedCount);
    });
});
