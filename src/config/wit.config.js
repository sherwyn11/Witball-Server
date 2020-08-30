const { Wit, log } = require('node-wit');
require('dotenv').config();

const client = new Wit({
    accessToken: process.env.WIT_TOKEN,
    logger: new log.Logger(log.DEBUG)
});

module.exports = client;