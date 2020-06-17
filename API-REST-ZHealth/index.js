'use strict';
const MongoDB = require('./src/database/db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/doctors', require('./src/routers/DoctorRouter'));
app.use('/prescription', require('./src/routers/PrescriptionRouter'));

MongoDB.connect()
    .then(() => {
        console.log(chalk.greenBright.underline(`=======> MongoDB connected <======`));
    })
    .catch(() => {
        console.error(chalk.red(`Error starting app in port:`, error));
    });
app.listen(port, (error) => {
    if (error) {
        console.error(chalk.red(`Failed to start app on port: ${port}`, error));
    } else {
        console.log(chalk.blue.underline(`=> App started at the port:${port} <=`));
    }
});

module.exports = app;
