const chai = require('chai');
const http = require('chai-http');
const things = require('chai-things');
const app = require('../../index');
const { assert } = chai;
chai.should();
chai.use(http);
chai.use(things);

const MongoDB = require('../database/db');
const DoctorService = require('../services/DoctorService');

MongoDB.connect();

let TEST_DOCTOR = {
    name: 'ZHealth',
    cpf: '31801778181',
    email: 'marcio@ZHealth.com.br',
    birth: '16/03/1992',
    crm: '43302962',
    statecrm: 'PR',
    sex: 'M',
    firstPassword: 'ZHealth2020',
    secondPassword: 'ZHealth2020',
};

let TEST_PRESCRIPRION = {
    cpf: '31801778151',
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

describe('/prescription - POST GET PUT PATCH DELETE', () => {
    it('401 - Access denied', () => {
        chai.request(app)
            .post('/prescription')
            .send(TEST_PRESCRIPRION)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('info').eql('Access denied');
            });
    });
    it('201 - created prescription', async () => {
        const { _id, email } = await DoctorService.saveDoctor(TEST_DOCTOR);
        const { token } = await DoctorService.generateJWT({ _id, email });
        chai.request(app)
            .post('/prescription')
            .send({ ...TEST_PRESCRIPRION, doctor: _id })
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('info').eql('prescription created');
            });
    });

    it('200 - found prescription', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR.cpf });
        const [{ _id, email }] = doctors;
        const { token } = await DoctorService.generateJWT({ _id, email });
        chai.request(app)
            .get('/prescription')
            .set('authorization', `Bearer ${token}`)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.have.property('info').eql('prescriptions found');
            });
    });

    it('200 - updated prescription', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR.cpf });
        let [{ _id, email }] = doctors;
        const { token } = await DoctorService.generateJWT({ _id, email });
        _id = undefined;
        TEST_PRESCRIPRION.name = 'jons';
        chai.request(app)
            .get('/prescription')
            .set('authorization', `Bearer ${token}`)
            .then((res) => {
                const [{ _id }] = res.body.prescription;
                chai.request(app)
                    .put(`/prescription/${_id}`)
                    .set('authorization', `Bearer ${token}`)
                    .send(TEST_PRESCRIPRION)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('info').eql('prescription updated');
                    });
            });
    });

    it('200 - deleted prescription', async () => {
        const { doctors } = await DoctorService.showDoctors({ cpf: TEST_DOCTOR.cpf });
        let [{ _id, email }] = doctors;
        await DoctorService.removeDoctor(_id);
        const { token } = await DoctorService.generateJWT({ _id, email });
        await DoctorService.removeDoctor(_id);
        _id = undefined;
        chai.request(app)
            .get('/prescription')
            .set('authorization', `Bearer ${token}`)
            .then((res) => {
                const [{ _id }] = res.body.prescription;
                chai.request(app)
                    .delete(`/prescription/${_id}`)
                    .set('authorization', `Bearer ${token}`)
                    .send(TEST_PRESCRIPRION)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('info').eql('prescription deleted');
                    });
            });
    });
});
