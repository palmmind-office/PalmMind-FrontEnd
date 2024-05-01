const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
require("winston-daily-rotate-file");

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

const myFormat = printf(({ level, message, label, timestamp }) => {
  level = level || null;
  timestamp = timestamp || null;
  message.botName = message.botName || null;
  message.userID = message.userID || null;
  message.ipAddress = message.ipAddress || null;
  message.title = message.title || null;
  message.isConnected = message.isConnected || null;
  message.socketID = message.socketID || null;

  return `${timestamp},${level},${message.botName},${message.isConnected},${message.socketID},${message.userID},${message.ipAddress},${message.title}`;
});

var transport = new transports.DailyRotateFile({
  filename: "./accessLog/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  level: baseLog
});

var consoleTransport = new transports.Console({ level: baseLog });

var logger = createLogger({
  format: combine(label({ label: "log" }), timestamp(), myFormat),
  transports: [consoleTransport, transport]
});

module.exports = logger;

var systransport = new transports.DailyRotateFile({
  filename: "./syslog/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  level: baseLog
});

var systemLogger = createLogger({
  format: combine(label({ label: "log" }), timestamp(), myFormat),
  transports: [consoleTransport, systransport]
});

module.exports.syslog = {
  write: function(message, encoding) {
    systemLogger.log({
      level: "info",
      message: {
        title: message
      }
    });
  }
};
