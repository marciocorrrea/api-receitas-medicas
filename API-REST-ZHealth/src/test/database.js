const MongoDB = require('../database/db');
const assert = require('assert');
const { expect } = require('chai');

describe('MongoDB', async () => {
    before(async () => {
        await MongoDB.connect();
    });

    it('Connect to the database', () => {
        assert.deepEqual(true, MongoDB.isConnected());
    });
    it('Connect to the database', () => {
        expect(MongoDB.isConnected()).to.equal(1);
    });
});
