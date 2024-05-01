const ServerServices = require("../services/server.services");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/successResponse");
const Email = require("./email");
const AppontmentEmail = process.env.APOINTMENT_EMAIL;

const loggerModule = require("../logger/main");
const { errorLogger, accessLogger } = loggerModule;

// const url =`https://${process.env.DASHBOARD_SERVER}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/leads`
const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/leads`;
const apoinmentURL = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/schedulers`;

exports.userInterestController = catchAsync(async function (req, res, next) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `${process.env.BOT_TOKEN}`,
  };
 
  let bodyData = {
    fullname: req.body.fullName || req.body.fullname || '',
    mobile: req.body.mobileNumber || req.body.mobile || '',
    email: req.body.emailAddress || req.body.email ||'',
    companyName: req.body.companyName || '',
    designation: req.body.designation || '',
    interest: req.body.interest
      ? req.body.interest
      : req.body.droper
      ? req.body.droper
      : `${ req.body.fullName} wants to ${req.body.type|| ''}`,
    source: req.body.source || "web",
    visitorId: req.body.visitorId || "visitoruser",
    userId: process.env.USERID,
    location: req.body.address || "",
  };
  if (req.body.profile_pic){
    bodyData["profile_pic"] = req.body.profile_pic
  }
  let response = await ServerServices.httpService(
    url,
    headers,
    (method = "POST"),
    bodyData
  );

  let data = await response.json();
 
  // for testing purpose
  // let response = {
  //     status:200
  // }
  // let data = {}

  let type = "User Interest submitted successfully.";
  if (response.status === 200) {
    // accessLogger
    const messageJSON = {
      title: "User Interest submitted successfully",
      userId: req.body.visitorId,
      botName: "PaLM_Bot",
    };
    accessLogger.log({
      level: "info",
      timestamp: new Date(),
      message: messageJSON,
    });
    successResponse(res, data, type, "success", 200);
    let mailConfig = {
      fullName: bodyData.fullname,
      product: bodyData.interest,
      emailAddress: req.body.emailAddress,
      mobileNumber: req.body.mobileNumber,
      companyName: req.body.companyName,
      designation: req.body.designation,
    };
    console.log(mailConfig,"kkk")
    if (mailConfig.product.length > 0 || mailConfig.product) {
      await new Email(mailConfig).userInterest();
    }
  } else {
    // errorLogger
    const messageJSON = {
      title: "Problem in submitting User Interest",
      botName: "Palm-bot",
    };
    errorLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });
    if (responseHeader){
      res.status(responseHeader.statusCode).json({
        header: responseHeader,
        error: err,
      });
    }
    
    return next(new AppError("Something went wrong", 400));
  }
});

exports.userAppoinmentsController = catchAsync(async function (req, res, next) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `${process.env.ADMIN_TOKEN}`,
  };
  let url = `${apoinmentURL}?organizationEmail=${AppontmentEmail}&access_token=${process.env.ADMIN_TOKEN}`;
  // console.log("url:", url);
  let bodyData = {
    fullName: req.body.full_name || "",
    email: req.body.email_address || "",
    interest: req.body.interest
      ? req.body.interest
      : req.body.droper
      ? req.body.droper
      : req.body.localstorageintrest,
    phoneNumber: req.body.mobile_number || "",
    appointmentDate: req.body.apponiment_date || "",
    organizationId: process.env.ORGANIZATION_ID || "",
  };
  // console.log("bodyData:",bodyData);
  let response = await ServerServices.postToServer(url, bodyData, headers);
  // console.log("response::",response);
  let data = await response.json();
  let type = "Your appointment has been submitted successfully.";
  let messageJSON = {
    botName: "Palm-bot",
  };
  // console.log("data:::",data);
  if (response.status === 200) {
    // accessLogger
    messageJSON.title = "Appointment submitted successfully";
    accessLogger.log({
      level: "info",
      timestamp: new Date(),
      message: messageJSON,
    });
    return successResponse(res, data, type, "success", 200);
  } else {
    // errorLogger
    messageJSON.title = "Problme in submitting Appointment"
    errorLogger.log({
      level: "error",
      timestamp: new Date(),
      message: messageJSON,
    });
    return next(new AppError("Something went wrong", 400));
  }
});
