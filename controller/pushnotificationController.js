const ServerServices = require("../services/server.services");
const catchAsync = require("../utils/catchAsync");
// const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/visitors/registration?userId=${process.env.userId}`;

const loggerModule = require("../logger/main");
const { accessLogger } = loggerModule;

let messageJSON = {
  botName: "Palm-bot",
};

exports.poshNotification = catchAsync(async function (req, res) {
  const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/visitors/registration?userId=${req.body.visitor_id}`;
  let bodyData = {
    registration_id: req.body.token,
  };
  let headers = {
    "Content-Type": "application/json",
    Authorization: process.env.BOT_TOKEN,
  };
  let response = await ServerServices.postToServer(url, bodyData, headers);
  let json = await response.json();
  // accessLogger
  messageJSON.title = "Successful Push Notification";
  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: messageJSON,
  });
  res.status(200).send(json);
});

exports.unsuscribe = catchAsync(async function (req, res) {
  const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/visitors/unsubscribe?userId=${req.body.visitor_id}`;
  let bodyData = {};
  let headers = {
    "Content-Type": "application/json",
    Authorization: process.env.BOT_TOKEN,
  };
  let response = await ServerServices.httpService(
    url,
    headers,
    "POST",
    bodyData
  );
  let json = await response.json();
  // accessLogger
  messageJSON.title = "Successful Unsubscribe";
  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: messageJSON,
  });
  return res.status(200).send(json);
});

exports.getSuscribeUser = catchAsync(async function (req, res) {
  const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/visitors/userId?organizationId=${process.env.ORGANIZATION_ID}&userId=${req.body.visitor_id}`;
  let headers = {
    "Content-Type": "application/json",
    Authorization: process.env.BOT_TOKEN,
  };
  let response = await ServerServices.httpService(url, headers, "GET", {});
  let json = await response.json();
  // accessLogger
  messageJSON.title = "Successfully Subscriber User fetched";
  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: messageJSON,
  });
  return res.status(200).send(json);
});
