const nodemailer = require("nodemailer");
const {
  email_url,
  email_port,
  email_stmp_user,
  email_stmp_password,
} = require("../config.json");

const config = {
  host: email_url,
  port: email_port,
  secure: false,
  auth: {
    user: email_stmp_user,
    pass: email_stmp_password,
  },
};

module.exports.Transporter = nodemailer.createTransport(config);
