const { postToServer } = require("../services/server.services");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/successResponse");
const Email = require("./email");
const loggerModule = require("../logger/main");
const { errorLogger, accessLogger } = loggerModule;

// const baseUrl = `https://${process.env.DASHBOARD_SERVER}`;
const baseUrl = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}`;

exports.complaint = catchAsync(async (req, res, next) => {
  let messageJSON = {
    botName: "Palm-bot",
  };
 
  let url = `${baseUrl}/rest/v1/visitors/${req.body.visitorId}/complaints/create`;
  const bodyData = {
    full_name: req.body.first_name + ' ' + req.body.last_name || '' ,
    email_address: req.body.email? req.body.email: null,
    mobile_number: req.body.mobile || '',
    title: "Complaint Registration",
    problem: req.body.complain,
    organizationId: process.env.ORGANIZATION_ID,

    
  };
 
  let headers = {
    "Content-Type": "application/json",
    Authorization: process.env.ADMIN_TOKEN,
  };
  let response = await postToServer(url, bodyData, headers);
  let data = await response.json();
 

  let message = `Successfully submitted your compliant.`;
  let type = "complain";
  if (response.status === 200) {
    // accessLogger
    messageJSON.title = "Complains created successfully";
    messageJSON.userId = req.body.visitorId;
    accessLogger.log({
      level: "info",
      timestamp: new Date(),
      message: messageJSON,
    });
    successResponse(res, data, message, "success", 200);
    let mailConfig = data;
    mailConfig.emailTo = process.env.COMPLAINT;
    mailConfig.type = type;
   
    await new Email(mailConfig).feedbackComplain();
  } else {
    // errorLogger
    messageJSON.title = "Problem in submitting you complain";
    errorLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });
    return next(new AppError("Something went wrong", 400));
  }
});
