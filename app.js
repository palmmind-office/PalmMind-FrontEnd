var dotenv = require("dotenv");
dotenv.config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const loggerModule = require("./logger/main");
const { systemLogger } = loggerModule;
const routeManager = require("./routes");

const cors = require('cors');
const allowedOrigins = process.env.SOCKET_ALLOWED_ORIGINS.split(",");


var morgan = require("morgan");
const expressSanitizer = require("express-sanitizer");

//error
const globalErrorHandler = require("./controller/errorController");

var app = express();
var server = require("http").Server(app);

//socket
var io = require("socket.io")(server, {cookie:false})

//helmet js initialization

const helmet = require('helmet');
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: [
//           "'self'",
//         ],
//         scriptSrc: [
//           "'self'",
//           "'unsafe-eval'",
//           "'unsafe-inline'",
//           'https://maps.googleapis.com',
//           'https://www.google.com',
//           'https://www.gstatic.com',
//           'https://accounts.google.com',
//           'https://www.googletagmanager.com',
//           'https://code.jquery.com',
//           'https://cdnjs.cloudflare.com',
//           'https://connect.facebook.net',
//           'https://www.google-analytics.com',
//           'https://cdn.jsdelivr.net'
//         ],
//         connectSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://www.google-analytics.com',
//           'https://firebaseinstallations.googleapis.com',
//           'https://fcmregistrations.googleapis.com',
//           'https://www.facebook.com'
//         ],
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           'https://fonts.googleapis.com',
//           'https://cdnjs.cloudflare.com',
//           'https://code.jquery.com',
//           'https://use.fontawesome.com',
//           'https://accounts.google.com',
//           'https://cdn.jsdelivr.net'
//         ],
//         fontSrc: [
//           "'self'",
//           'https://fonts.gstatic.com',
//           'https://cdnjs.cloudflare.com',
//           'https://use.fontawesome.com'
//         ],
//         imgSrc: [
//           "'self'",
//           'https://maps.gstatic.com',
//           'https://maps.googleapis.com',
//           'https://www.google-analytics.com'
//         ],
//         frameSrc: [
//           "'self'",
//           'https://www.google.com',
          
//         ],
//       },
//     },
//   })
// );

app.use(function (req, res, next) {
  if (req.method === "POST" && req.path.endsWith("file")) {
    return express.raw({ type: '*/*', limit: 4000000 })(req, res, next)
  }
  return express.json()(req, res, next)
});

app.use(cors({
  origin:allowedOrigins
}))

//messenger bot
const { messengerBot, instagramBot } = require("./bot/facebook.bot");
const whatsappBot = require("./bot/whatsapp.bot");
const viberBot = require("./bot/viber.bot")
const telegramBot = require("./bot/telegram.bot")

messengerBot.start(app);
instagramBot.start(app);
whatsappBot.start(app);
viberBot.start(app);
telegramBot.start(app);

const { init } = require("./socket");
init(io);

app.use(function (req, res, next) {
  res.io = io;
  next();
});

console.log("Environment: ", process.env.NODE_ENV);

app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== 'production') res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin");
  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end();
  }
  next();
});



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSanitizer());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "upload")));

// systemLogger
const systemLog = {
  write: function (message, encoding) {
    systemLogger.log({
      level: "info",
      timestamp: new Date(),
      message: {
        title: message,
      },
    });
  },
};

app.use(morgan("combined", { stream: systemLog }));
//routes
app.use("/", routeManager);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

//error handler
app.use(globalErrorHandler);

module.exports = {
  app: app,
  server: server,
};
