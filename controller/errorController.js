const AppError = require("./../utils/appError");
const loggerModule = require("../logger/main");
const { errorLogger } = loggerModule;

const messageJSON = {
  botName: "Palm-bot",
};

const handleValidationErrorDB = (err) => {
  // console.log(err.message)
  const message = Object.values(err.errors).map((val) => val.message);
  message = message.join(". ");

  // errorLogger
  messageJSON.title = err.message;
  errorLogger.log({
    level: "error",
    timestamp: new Date(),
    message: messageJSON,
  });
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  // console.log('this is executing')
  const message = `Invalid ${err.path}: ${err.value}.`;
  // console.log(message)

  // errorLogger
  messageJSON.title = err.message;
  errorLogger.log({
    level: "error",
    timestamp: new Date(),
    message: messageJSON,
  });
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value)
  const message = `Duplicate field value: ${value}. Please use another value`;

  // errorLogger
  messageJSON.title = err.message;
  errorLogger.log({
    level: "error",
    timestamp: new Date(),
    message: messageJSON,
  });
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  // errorLogger
  messageJSON.title = err.message;
  errorLogger.log({
    level: "error",
    timestamp: new Date(),
    message: messageJSON,
  });

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational, trusted error: send message to client
  if (err.isOperational) {
    // errorLogger
    messageJSON.title = err.message;
    errorLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //programming or other unknown error: don't leak error details
  else {
    console.error("ERROR!", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.log("sending dev error", err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = {...err};
    // console.log(error.name)
    // console.log(err)
    console.log(err.name);
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    sendErrorProd(err, res);
  } else {
    console.log("sending ci error");
    sendErrorDev(err, res);
  }
};
