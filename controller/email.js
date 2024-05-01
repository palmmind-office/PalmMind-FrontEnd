const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

const loggerModule = require("../logger/main");
const { accessLogger, errorLogger } = loggerModule;

module.exports = class Email {
  constructor(data) {
    this.data = data;
  }

  newTransport() {
    if (process.env.NODE_ENV === "development") {
      //transporter for dev
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.EMAIL_DEV,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // for production
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.EMAIL_DEV,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async sendAgentEmail(template, subject) {
    console.log("template:", template);
    console.log("subject:", subject);

    let mailId = process.env.TOBECAMEAGENT;

    if (this.data.emailTo) {
      mailId = this.data.emailTo;
    }

    this.data.subject = subject;
    console.log("MailId:", mailId);
    let html;
    if (subject.length > 2) {
      html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        this.data
      );

      const mailOptions = {
        to: mailId,
        subject,
        html,
        text: htmlToText(html),
      };

      if (process.env.NODE_ENV === "production") {
        mailOptions.from = `Chatbot <${process.env.EMAIL}>`;
      } else {
        mailOptions.from = process.env.EMAIL_DEV;
      }
      console.log("mailOptions:", mailOptions);
      await this.newTransport().sendMail(mailOptions);
    } else {
      // errorLogger
      const messageJSON = {
        title: "Subject not defined",
        botName: "Palm-bot",
      };
      errorLogger.log({
        level: "error",
        timestamp: new Date(),
        message: messageJSON,
      });
      console.log("subject not defined");
    }
  }

  //send function for email
  async send(template, subject) {
    console.log("Template:", template);
    let mailId = process.env.EMAIL_TO;

    if (this.data.emailTo) {
      mailId = this.data.emailTo;
    }

    this.data.subject = subject;
    let html;
    if (subject.length > 2) {
      html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        this.data
      );

      const mailOptions = {
        // from: process.env.EMAIL,
        to: mailId,
        subject,
        html,
        text: htmlToText(html),
      };
      if (process.env.NODE_ENV === "production") {
        mailOptions.from = `Chatbot <${process.env.EMAIL}>`;
      } else {
        mailOptions.from = process.env.EMAIL_DEV;
      }
      console.log("mailOptions:", mailOptions);
      await this.newTransport().sendMail(mailOptions);
      // return res;
    } else {
      // errorLogger
      const messageJSON = {
        title: "Subject not defined",
        botName: "Palm-bot",
      };
      errorLogger.log({
        level: "error",
        timestamp: new Date(),
        message: messageJSON,
      });
      console.log("subject not defined");
    }
  }

  //send test email
  async sendTest() {
    try {
      const res = await this.send("testEmail", "Test Email");
      return res;
    } catch (err) {
      // errorLogger
      const messageJSON = {
        title: err.message,
        botName: "Palm-bot",
      };
      errorLogger.log({
        level: "error",
        timestamp: new Date(),
        message: messageJSON,
      });
      console.log(err);
    }
  }

  async requestEmails() {
    try {
      let subject = "";
      switch (this.data.type) {
        case "PolicyReviveRequest": {
          this.data.user = "policy";
          subject = "Policy Revive Request";
          break;
        }
        case "PaymodeChangeRequest": {
          this.data.user = "policy";
          subject = "Pay Mode Change Request ";
          break;
        }
        case "MobileNumberChange": {
          this.data.user = "policy";
          subject = "Mobile Number Change ";
          break;
        }
        case "OccupationChangeRequest": {
          this.data.user = "policy";
          subject = "Occupation Change";
          break;
        }
        case "NomineeChangeRequest": {
          this.data.user = "policy";
          subject = "Nominee Name Change";
          break;
        }
        case "PanNumberUpdateRequest": {
          this.data.user = "agent";
          subject = "PAN Number Update Request";
          break;
        }
        case "BankAccountChangeRequest": {
          this.data.user = "agent";
          subject = "Bank Account Change Request ";
          break;
        }
      }
      await this.send("requestEmails", subject);
    } catch (err) {
      // errorLogger
      const messageJSON = {
        title: err.message,
        botName: "Palm-bot",
      };
      errorLogger.log({
        level: "error",
        timestamp: new Date(),
        message: messageJSON,
      });
      console.log(err);
    }
  }
  // mail for user interest
  async userInterest() {
    await this.send("userInterest", "User Interest Submitted Successfully.");
  }
  async agentInterest() {
    await this.sendAgentEmail(
      "agent",
      "Customer with following info want to be Agent"
    );
  }

  // for feedback and complain mail
  async feedbackComplain() {
    try {
      let subject = "";
      switch (this.data.type) {
        case "feedback":
          subject = "New Feedback Registered";
          break;
        case "complain":
          subject = "New Complain Registered";
          break;
      }
      await this.send("feedbackComplain", subject);
    } catch (err) {
      // errorLogger
      const messageJSON = {
        title: err.message,
        botName: "Palm-bot",
      };
      errorLogger.log({
        level: "error",
        timestamp: new Date(),
        message: messageJSON,
      });
      console.log(err);
    }
  }
};
