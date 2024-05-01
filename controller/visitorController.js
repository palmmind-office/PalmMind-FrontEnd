const baseUrl = `${process.env.SOCKET_PROTOCOL}://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}`;

const catchAsync = require("../utils/catchAsync");
const serverServices = require("../services/server.services");

const loggerModule = require("../logger/main");
const { accessLogger } = loggerModule;

exports.getVisitors = catchAsync(async function (req, res) {
  const url = `${baseUrl}/${process.env.BASEPATH}/visitors/source?organizationId=${process.env.ORGANIZATION_ID}&source=${req.query.source}&duration=${req.query.duration}&filter={"page":${req.query.start}, "limit":500}&access_token=${req.headers.authorization || req.query.accessToken}`;

  const response = await serverServices.getFromServer(url, { "Content-Type": "application/json" });

  const data = await response.json();

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: { title: "Visitors fetched successfully" },
  });

  res.status(response.status).json({ data });
});

exports.getVisitorCount = catchAsync(async function (req, res) {
  const url = `${baseUrl}/visitors/count?`;
  if (req.query.hasOwnProperty("start-date")) {
    url += `&lastactivity_gte=${req.query["start-date"]}`;
  }
  if (req.query.hasOwnProperty("end-date")) {
    url += `&lastactivity_lte=${req.query["end-date"]}`;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${req.headers.bearer}`,
  };

  const response = await serverServices.getFromServer(url, headers);

  const data = await response.json();
  accessLogger.log({ level: "info", timestamp: new Date(), message: { title: "Visitors count fetched successfully" } });

  res.status(response.status).json({ data });
});