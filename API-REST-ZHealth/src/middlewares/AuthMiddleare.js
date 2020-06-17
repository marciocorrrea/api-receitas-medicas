'use strict';

const DoctorService = require('../services/DoctorService');

class AuthMiddleare {
    async authenticate(req, res, next) {
        const authToken = req.headers['authorization'];
        if (authToken != undefined) {
            const bearer = authToken.split(' ');
            const token = bearer[1];
            DoctorService.checkJWT(token)
                .then((infoToken) => {
                    next();
                })
                .catch((info) => {
                    res.statusCode = 401;
                    return res.json({
                        status: 'error',
                        statusCode: 401,
                        info: 'Access denied',
                    });
                });
        } else {
            res.statusCode = 401;
            return res.json({
                status: 'error',
                statusCode: 401,
                info: 'Access denied',
            });
        }
    }
}

module.exports = new AuthMiddleare();
