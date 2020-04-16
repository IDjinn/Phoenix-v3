import winston from 'winston';
import moment from 'moment';
import { join as pathJoin } from 'path';
const config = require('../../../../../config.json'); //Need it, because it was called after initializated
const logger = winston.createLogger({
    level: config.logLevel,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: pathJoin(__dirname, '../../../../logs') + '/errors.log', level: 'error' }),
        new winston.transports.File({ filename: pathJoin(__dirname, '../../../../logs') + '/debug.log', level: 'debug' }),
        new winston.transports.File({ filename: pathJoin(__dirname, '../../../../logs') + '/phoenix.log', level: 'info' }),
    ],
    format: winston.format.printf(log => `[${moment().format(`h:mm:ss${config.logLevel === 'debug' ? ':SSS' : ''}`)}] [${log.level.toUpperCase()}] - ${log.message}`),
});

export default logger;