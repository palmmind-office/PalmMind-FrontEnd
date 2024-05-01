require("winston-daily-rotate-file");
const { transports } = require("winston");
const messageFormat = require('./format');
const Transport = require('./transport');
const Logger = require('./logger');

// this log or its higher levels are considered.
const baseLog = "info";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const accessTransport = new Transport("./log/accessLog/%DATE%.log", "YYYY-MM-DD", baseLog);
const consoleTransport = new transports.Console({ level: baseLog });
const accessLogger = new Logger(messageFormat, [consoleTransport, accessTransport]);

const systemTransport = new Transport("./log/systemLog/%DATE%.log", "YYYY-MM-DD", baseLog);
const systemLogger = new Logger(messageFormat, [consoleTransport, systemTransport]);

const errorTransport = new Transport("./log/errorLog/%DATE%.log", "YYYY-MM-DD", baseLog);
const errorLogger = new Logger(messageFormat, [consoleTransport, errorTransport]);

const reactErrorTransport = new Transport("./log/reactLog/%DATE%.log", "YYYY-MM-DD", baseLog);
const reactLogger = new Logger(messageFormat, [reactErrorTransport]);

module.exports = {accessLogger, systemLogger, errorLogger, reactLogger};