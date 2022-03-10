const nodemailer = require("nodemailer");
var config = require("../config/config");
const { emailEvent } = require("../utils/event-util");

exports.init = () => {
  console.log("Mail Service init");
};

emailEvent.on("send", (data) => {
  console.log("Event emitter subscribed");
  let transport = this.transPortSetup;
  const message = {
    from: config.mail_from,
    to: data.to,
    subject: data.subject,
    text: data.text,
  };
  transport.sendMail(message, (_err_mail, _mail_info) => {
    if (_err_mail) {
      let obj = {
        to: message.to,
        subject: message.subject,
        text: message.text,
        reason: _err_mail,
      };
      emailEvent.emit("fail", obj);
    }
    if (_mail_info) {
      console.log("Mail Sent");
    }
  });
});

exports.transPortSetup = nodemailer.createTransport({
  host: config.mail_smtp_server,
  port: config.mail_port,
  auth: {
    user: config.mail_from,
    pass: config.mail_password,
  },
});
