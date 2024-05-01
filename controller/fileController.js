const catchAsync = require("../utils/catchAsync");
const serverServices = require("../services/server.services");
const fetch = require("node-fetch");
// const FormData = require("form-data");

const keys = process.env;
const baseUrl = `${keys.SOCKET_PROTOCOL}://${keys.DASHBOARD_SERVER}:${keys.DASHBOARD_PORT}`;

const { accessLogger } = require("../logger/main");
const whatsappBot = require("../bot/whatsapp.bot");
const telegramBot = require("../bot/telegram.bot");

exports.getFile = catchAsync(async function (req, res) {
  const path = req.query.path;
  const response = await serverServices.getFromServer(`${baseUrl}/${process.env.BASEPATH}/uploads/${path}?access_token=${process.env.BOT_TOKEN}`);
  // console.log("URL=>", `${baseUrl}/uploads/${path}`);
  const responseContentType = response.headers.get('content-type')
  // console.log(responseContentType, "RESPONSE CONTENT TYPE")
  const contentType = responseContentType
  res.set({ 'Content-Type': contentType })
  response.body.pipe(res);
})

exports.getWhatsappFile = catchAsync(async function (req, res) {
  const mediaId = req.params.mediaId?.split(".")[0];
  const response = await whatsappBot.downloadMedia(mediaId);

  res.set({
    'Content-Type': response.headers.get('Content-Type'),
    'Content-Length': response.headers.get('Content-Length'),
    'Content-Disposition': response.headers.get('Content-Disposition'),
  });
  response.body.pipe(res);
})
exports.getTelegramFile = catchAsync(async function (req, res) {
  const mediaId = req.params.mediaId?.split(".")[0];
  const response = await telegramBot.downloadMedia(mediaId);

  res.set({
    'Content-Type': response.headers.get('Content-Type'),
    'Content-Length': response.headers.get('Content-Length'),
    'Content-Disposition': response.headers.get('Content-Disposition'),
  });
  response.body.pipe(res);
})

exports.uploadFile = catchAsync(async function (req, res) {
  let url = `${baseUrl}/${keys.BASEPATH}/uploads/buffer?visitorId=${req.query.visitor}&fileName=${req.query.filename}`;

  url = Object.keys(req.query).includes('from_chatbot') ? `${url}&access_token=${process.env.ADMIN_TOKEN}` : `${url}&access_token=${req.headers.authorization}`

  if (!req.query.filename) {
    throw new Error("Filename is required")
  }

  const response = await fetch(url, {
    method: 'POST',
    body: req.body,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': req.headers['content-length'],
    }
  })

  const data = await response.json();

  accessLogger.log({
    level: "info",
    timestamp: new Date(),
    message: {
      title: "Successfully fetched messages",
    },
  });

  const fileBaseUrl = process.env.FILE_BASE_URL;
  res.status(response.status).json({ path: data.path ? `${fileBaseUrl}rest/v1/chat/file?path=${data.path}` : '' });
});

exports.deleteFile = catchAsync(async function (req, res) {
  let url = `${baseUrl}/${keys.BASEPATH}/uploads/upload`;

  url = Object.keys(req.query).includes('from_chatbot') ? `${url}&access_token=${process.env.ADMIN_TOKEN}` : `${url}&access_token=${req.headers.authorization}`

  const response = await serverServices.postToServer(url, req.body);

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