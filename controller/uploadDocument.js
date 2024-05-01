const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require('nodemailer');
const ServerServices = require("../services/server.services");
const fs = require("fs");
const path = require("path");

const renderBodyElement = (data) => {
  const excludedKeys = ["visitorId", "source"];
  let template = Object.keys(data).length > 0 ? `<ul style="list-style:none">` : ``;
  Object.entries(data).forEach((entry) => {
    const [key, value] = entry;
    if (excludedKeys.includes(key) || !value) return;
    const label = key[0].toUpperCase() + key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2"); // convert camel case to title case
    template += `<li><span style="font-weight:600">${label}:</span> ${value}</li>`;
  });
  return template.length > 0 ? template + "</ul>" : template;
};

const uploadDocs = catchAsync(async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      if (Object.keys(req.body.date || {}).length !== 0) {
        let headers = {
          "Content-Type": "application/json",
          Authorization: `${process.env.ADMIN_TOKEN}`,
        };
        const AppointmentEmail = process.env.APPOINTMENT_EMAIL;
        // const appointmentURL = `https://${process.env.DASHBOARD_SERVER}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/leads`
        const appointmentURL = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/leads`;
        console.log(appointmentURL, ">>>>>>")
        let url = `${appointmentURL}?organizationEmail=${AppointmentEmail}&access_token=${process.env.ADMIN_TOKEN}`;
        let bodyData = {
          fullName: req.body.fullName || "",
          email: req.body.emailAddress || "",
          interest: req.body.interest || "",
          mobile: req.body.mobileNumber || "",
          organizationId: process.env.ORGANIZATION_ID || "",
          visitorId: req.body.visitorId || 'visitoruser',
        };

        await ServerServices.postToServer(url, bodyData, headers);
      }
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.EMAIL_DEV,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      let mailTo = process.env.EMAIL_TO;
      let attachments = req.files.map(em => {
        return {
          filename: em.filename,
          path: `${process.env.FILE_BASE_URL}${em.filename}`,
          cid: 'unique@kreata.ee'
        };
      });
      let subject = req.body.interest ? req.body.interest : "Job Application";
      let HelperOptions = {
        from: `Chatbot<${process.env.EMAIL_DEV}>`,
        to: mailTo,
        subject: subject,
        html: `<div>
                <h2>Dear Team,</h2>
                <p>Following user is interested in this position:</p>
                ${renderBodyElement(req.body)}
          </div>`,
        attachments: attachments
      };
      transporter.sendMail(HelperOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent successfully: ' + info.response);

          // Delete files after sending mail:
          req.files.forEach((file) => {
            fs.unlink(path.join(__dirname, `../upload/${file.filename}`), (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('File deleted: ' + file.filename);
              }
            });
          });
        }
      });


      return res.status(200).json({
        status: true,
        data: req.body
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded"
      });
    }
  } catch (error) {
    console.log(error);
    return next(new AppError('Something went wrong', 400));
  }
});

module.exports = { uploadDocs };
