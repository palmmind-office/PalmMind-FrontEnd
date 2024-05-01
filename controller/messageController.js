const catchAsync = require("../utils/catchAsync");
const serverServices = require("../services/server.services");

const keys = process.env;
const baseUrl = `${keys.SOCKET_PROTOCOL}://${keys.DASHBOARD_SERVER}:${keys.DASHBOARD_PORT}`;

const { accessLogger } = require("../logger/main");
const {encryptData,decryptData} = require("../services/crypto.services");

exports.getMessages = catchAsync(async function (req, res) {
  let url = `${baseUrl}/${keys.BASEPATH}/visitors/${req.query.user_id}/messages?filter={"page":${req.query.start}}&access_token=${req.headers.authorization}`;

  // url = Object.keys(req.query).includes('from_chatbot') ? `${url}&access_token=${process.env.ADMIN_TOKEN}` : `${url}&access_token=${req.headers.authorization}`

  const response = await serverServices.getFromServer(url, { "Content-Type": "application/json" });

  const data = await response.json();

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: {
      title: "Successfully fetched messages",
    },
  });

  res.status(response.status).json({ data });
});


exports.getMessagesWithVisitors = catchAsync(async function (req, res) {
  let user_id=fetchChatHistory = decryptData(req.query.user_id);
  let url = `${baseUrl}/${keys.BASEPATH}/visitors/source?user_id=${user_id}&filter={"limit":20}&access_token=${process.env.ADMIN_TOKEN}&organizationId=${process.env.ORGANIZATION_ID}&source=web`;



  const response = await serverServices.getFromServer(url, { "Content-Type": "application/json" });

  const data = await response.json();

  let encryptedData = encryptData(data);

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: {
      title: "Successfully fetched visitors messages",
    },
  });

  return res.status(200).send(encryptedData);
});


exports.getMessageByMid = catchAsync(async function (req, res) {
  const filter = '{"where":{"metadata":"{\\"mid\\":\\"' + req.query.mid + '\\"}"}}';
  const url = `${baseUrl}/${keys.BASEPATH}/messages?filter=${filter}&access_token=${req.headers.authorization}`;
  const response = await serverServices.getFromServer(url, { "Content-Type": "application/json" });

  const data = await response.json();

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: {
      title: "Successfully fetched message by mid",
    },
  });

  res.status(response.status).json({ data });
});
