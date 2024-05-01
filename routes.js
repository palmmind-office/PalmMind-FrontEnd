var express = require("express");
var path = require("path");
let router = express.Router();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const getOrganization = require("./routes/getorganization");
var chatHistoryRouter = require("./routes/chatHistory");
var pushnotificationrouter = require("./routes/pushnotification.dashboard");
const userinterest = require('./routes/userInterest')
const feedback = require('./routes/feedback')
const complaint = require('./routes/complaint')
const getStores = require('./routes/location')
const uploadDocs=require("./routes/uploadDocs")
const googleSheet = require("./routes/googlesheet")
const calendar = require("./routes/googleCalendar")

router.use("/", indexRouter);
router.use("/rest/v1/users", usersRouter);
router.use("/rest/v1/chat", chatHistoryRouter);
router.use("/rest/v1/Organization", getOrganization);
router.use("/rest/v1/pushnotification", pushnotificationrouter);
router.use('/rest/v1/user', userinterest)
router.use('/rest/v1/google', googleSheet ) 
router.use('/rest/v1/feedback', feedback)
router.use('/rest/v1/complaint', complaint)
router.use('/rest/v1/location', getStores)
router.use('/rest/v1', uploadDocs);
router.use('/rest/v1/calendar', calendar)


router.use("/bot", express.static(path.join(__dirname)));
// router.use("/chat", express.static(path.join(__dirname, "public", "chatHistory", "loginTemplate")));
router.use("/pushNotification", express.static(path.join(__dirname, "public", "pushNotification", "push")));
router.use("/chat/converse", express.static(path.join(__dirname, "public", "chatHistory", "chatTemplate")));


module.exports = router;