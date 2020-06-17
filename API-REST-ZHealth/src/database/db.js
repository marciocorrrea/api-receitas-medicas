'use strict';
const Mongoose = require('mongoose');
const requireDir = require('require-dir');
Mongoose.Promise = global.Promise;

class MongoDB {
    isConnected() {
        return Mongoose.connection.readyState;
    }

    async connect() {
        try {
            await Mongoose.connect('mongodb://localhost:27017/hospitalDB', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            requireDir('../models');
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = new MongoDB();
