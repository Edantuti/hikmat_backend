const { Transporter: transporter } = require("./connect");
const { email_stmp_user, frontend_url } = require("../config.json");

function MailObjectGenerator(from, to, subject, textBody, htmlBody) {
  this.from = from;
  this.to = to;
  this.subject = subject;
  this.textBody = textBody;
  this.htmlBody = htmlBody;
  this.object = {
    from: this.from,
    to: this.to,
    subject: this.subject,
    text: this.textBody,
    html: this.htmlBody,
  };
}

module.exports.verificationMailer = async function(user_email, token) {
  const MailObject = new MailObjectGenerator(
    email_stmp_user,
    user_email,
    "Verification Mail",
    `Click here to verify yourself. ${frontend_url}/verify/${token}`,
    `<html> <head> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"> <style> body { background-color: black; color: white; font-family: 'Roboto', sans-serif; } p { height:20rem; padding:2rem; font-size:20px; } a{ text-decoration:none; color: white; transition-duration: 150ms; } a:hover{ color:blue; font-style:italic; } </style> </head> <body> <h1>Hikmat</h1> <p>To verify, click this link, <a href="${frontend_url}auth/verify?token=${token}">Verify now</a></p> </body> </html>`,
  );
  console.log(MailObject.object);
  return transporter.sendMail(MailObject.object);
};

module.exports.resetPasswordMailer = async function(user_email, token) {
  const MailObject = new MailObjectGenerator(
    email_stmp_user,
    user_email,
    "Reset Your Password",
    `You can change your password now. Click here to change the password ${frontend_url}/resetpassword/${token}`,
    `<p>You can change your password now. Click here to change the password <a href="${frontend_url}/resetpassword/${token}">Reset Password here</a></p>`,
  );
  return transporter.sendMail(MailObject.object);
};
