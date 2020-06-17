const MongoDB = require('../database/db');
const chai = require('chai');
const http = require('chai-http');
const things = require('chai-things');
const app = require('../../index');
chai.should();
chai.use(http);
chai.use(things);

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

MongoDB.connect();

const USER_IDENTIFICATION = { identification: '31801778154', password: 'ZHealth2020' };
before(() => {
    MongoDB.connect();
});
describe('/doctors - POST GET PUT PATCH DELETE', () => {
    it('201 - user created generated token', () => {
        chai.request(app)
            .post('/doctors')
            .send(TEST_DOCTOR_RIGHT)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('info').eql('User created and generated token');
            });
    });
    it('406 - user already exists', async () => {
        await MongoDB.connect().then(() => {});
        chai.request(app)
            .post('/doctors')
            .send(TEST_DOCTOR_RIGHT)
            .end((err, res) => {
                res.should.have.status(406);
                res.body.should.have.property('info').eql('User already exists');
            });
    });
    it('403 - CPF not found in the database', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send({ identification: '03309273105', password: 'ZHealth2020' })
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('info').eql('CPF not found in the database');
            });
    });
    it('200 - genetared token', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send(USER_IDENTIFICATION)
            .then((res) => {
                chai.request(app)
                    .post('/doctors/authenticate')
                    .send(USER_IDENTIFICATION)
                    .then((resp) => {
                        resp.should.have.status(200);
                        resp.body.should.have.property('info').eql('genetared token');
                    });
            });
    });
    it('401 - not Authorization', () => {
        chai.request(app)
            .get('/doctors')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('info').eql('Access denied');
            });
    });

    it('200 - data found', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send(USER_IDENTIFICATION)
            .then((res) => {
                var token = res.body.token;
                var auth = `Bearer ${token}`;
                chai.request(app)
                    .get('/doctors')
                    .set('authorization', auth)
                    .then((resp) => {
                        const { doctors } = resp.body.result;
                        let doctor = doctors.find((e) => {
                            return e.cpf == TEST_DOCTOR_RIGHT.cpf;
                        });
                        resp.should.have.status(200);
                    });
            });
    });
    it('202 - updated user', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send(USER_IDENTIFICATION)
            .then((res) => {
                var token = res.body.token;
                var auth = `Bearer ${token}`;
                chai.request(app)
                    .get('/doctors')
                    .set('authorization', auth)
                    .then((AllDoctors) => {
                        const { doctors } = AllDoctors.body.result;
                        let doctor = doctors.find((e) => {
                            return e.cpf == TEST_DOCTOR_RIGHT.cpf;
                        });
                        chai.request(app)
                            .put(`/doctors/${doctor._id}`)
                            .set('authorization', auth)
                            .send(TEST_DOCTOR_RIGHT_UPDATE)
                            .then((resp) => {
                                const [{ name }] = resp.body.user.doctors;
                                name.should.equal(TEST_DOCTOR_RIGHT_UPDATE.name);
                                resp.should.have.status(202);
                            });
                    });
            });
    });

    it('202 - updated user', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send(USER_IDENTIFICATION)
            .then((res) => {
                var token = res.body.token;
                var auth = `Bearer ${token}`;
                chai.request(app)
                    .get('/doctors')
                    .set('authorization', auth)
                    .then((res) => {
                        const { doctors } = res.body.result;
                        let doctor = doctors.find((e) => {
                            return e.cpf == TEST_DOCTOR_RIGHT.cpf;
                        });
                        delete TEST_DOCTOR_RIGHT.crm;
                        delete TEST_DOCTOR_RIGHT.email;
                        delete TEST_DOCTOR_RIGHT.name;
                        delete TEST_DOCTOR_RIGHT.secondPassword;
                        delete TEST_DOCTOR_RIGHT.firstPassword;
                        chai.request(app)
                            .patch(`/doctors/${doctor._id}`)
                            .set('authorization', auth)
                            .send(TEST_DOCTOR_RIGHT)
                            .then((resp) => {
                                resp.should.have.status(202);
                            });
                    });
            });
    });

    it('202 - user deleted', () => {
        chai.request(app)
            .post('/doctors/authenticate')
            .send(USER_IDENTIFICATION)
            .then((res) => {
                var token = res.body.token;
                var auth = `Bearer ${token}`;
                chai.request(app)
                    .get('/doctors')
                    .set('authorization', auth)
                    .then((res) => {
                        const { doctors } = res.body.result;
                        let doctor = doctors.find((e) => {
                            return e.cpf == TEST_DOCTOR_RIGHT.cpf;
                        });
                        chai.request(app)
                            .delete(`/doctors/${doctor._id}`)
                            .set('authorization', auth)
                            .then((resp) => {
                                resp.should.have.status(200);
                            });
                    });
            });
    });
});
