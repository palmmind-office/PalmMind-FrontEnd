const { google } = require("googleapis");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/successResponse");
const {getSheetId}= require("../services/sheet_id")

exports.googleSheetController = catchAsync(async (req, res, next) => {
  console.log("entry>>>>>");
  console.log("body_data====>>>", req.body);

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    // const idSelection = {
    //   "Schedule Chatbot Demo": process.env.CHATBOT_DEMO_SHEET_ID,
    //   "job": process.env.JOB_SHEET_ID,
    // };
    console.log(req.body.type, "rbt>>>>>")
    const spreadsheetId = getSheetId[req.body.type];
    const range = "Sheet1";

    let data = [];
    if (req.body.type === "Schedule Chatbot Demo") {
      data = [
        req.body.fullName || req.body.fullname || "",
        req.body.mobileNumber || req.body.mobile || "",
        req.body.emailAddress || req.body.email || "",
        req.body.companyName || "",
        req.body.designation || "",
        req.body.interest || req.body.droper || `${req.body.fullName} wants to ${req.body.type || ""}`,
        req.body.source || "web",
        req.body.visitorId || "visitoruser",
      ];
    } else if (req.body.type === "job") {
      data = [
        req.body.fullName || "",
        req.body.emailAddress || "",
        req.body.interest || "",
        req.body.mobileNumber || "",
        req.body.visitorId || "visitoruser",
      ];
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [data],
      },
    });

    console.log("API response==>", response.data);
    let type = "google sheet submitted";
    if (response.status === 200) {
      successResponse(res, data, type, "success", 200);
      console.log("updated>>>>>");
    } else {
      return next(new AppError("Something went wrong", 400));
    }
  } catch (error) {
    console.log("Error=====>>>>", error);
    return next(new AppError("Something went wrong", 400));
  }
});
