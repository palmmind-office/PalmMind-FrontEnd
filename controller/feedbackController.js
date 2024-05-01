const catchAsync = require("../utils/catchAsync");
const { postToServer } = require("../services/server.services");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/successResponse");
const Email = require("./email");
const loggerModule = require("../logger/main");
const { errorLogger, accessLogger } = loggerModule;

const baseUrl = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}`;
exports.feedback = catchAsync(async (req, res, next) => {
  let url = `${baseUrl}/rest/v1/visitors/${req.body.visitorId}/feedbacks/create`;
  const bodyData = {
    full_name: req.body.full_name,
    email_address: req.body.email_address,
    mobile_number: req.body.mobile_number,
    suggestion: req.body.suggestion,
    organizationId: process.env.ORGANIZATION_ID,
  };
  let headers = {
    "Content-Type": "application/json",
    Authorization: process.env.ADMIN_TOKEN,
  };
  let response = await postToServer(url, bodyData, headers);
  let data = await response.json();
  let message = `Successfully submitted your ${req.body.type}.`;
  let types = req.body.type;

  let messageJSON = {
    botName: "Palm-bot",
  };
  
  if (response.status === 200) {
    // accessLogger
    messageJSON.title = "Successfully feedback created";
    accessLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });
    successResponse(res, data, message, "success", 200);
    let mailConfig = data;
    mailConfig.emailTo = process.env.FEEDBACK;
    mailConfig.type = types;

    await new Email(mailConfig).feedbackComplain();
  } else {
    // errorLogger
    messageJSON.title = "Problem in feedback creation"
    errorLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });

    return next(new AppError("Something went wrong", 400));
  }
});
