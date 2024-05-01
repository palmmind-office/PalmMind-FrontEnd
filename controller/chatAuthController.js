const catchAsync = require("../utils/catchAsync");
const serverServices = require("../services/server.services");

const baseUrl = `${process.env.SOCKET_PROTOCOL}://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}`;
const loggerModule = require("../logger/main");
const { accessLogger } = loggerModule;

exports.login = catchAsync(async function (req, res) {
  const url = `${baseUrl}/rest/v1/Users/login`;

  const bodyData = {
    ref: "livechat",
    username: req.sanitize(req.body.identifier),
    password: req.sanitize(req.body.password),
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await serverServices.postToServer(url, bodyData, headers);

  const data = await response.json();

  if (data?.organizationId !== process.env.ORGANIZATION_ID) {
    // no need to use errorLogger as the error is catched in errorController
    throw new Error("User not found with the given credentials");
  }

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: {
      botName: "Palm-Bot",
      title: "User Login",
    },
  });

  res.status(response.status).json({ msg: data });
});
