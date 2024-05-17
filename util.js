import { Sequelize } from "sequelize";
import Razorpay from "razorpay";
import bcrypt from "bcrypt";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import {
  passwordHashValue,
  tokenHashValue,
  database_name,
  database_password,
  database_ssl,
  database_url,
  email_port,
  email_stmp_password,
  email_stmp_user,
  email_url,
  database_user,
  sender_email,
  frontend_url,
} from "./config.js";

const tokenChecker = (token) => {
  try {
    jwt.verify(token, tokenHashValue);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const tokenDecoder = (token) => {
  try {
    return jwt.verify(token, tokenHashValue);
  } catch (error) {
    console.error(error);
    return "";
  }
};

const tokenEncoder = (data) => {
  try {
    return jwt.sign(
      {
        email: data.email,
        userid: data.userid,
      },
      tokenHashValue,
      {
        expiresIn: "3d",
        algorithm: "HS256",
      },
    );
  } catch (error) {
    console.error(error);
    return "";
  }
};

const DatabaseConfig = {
  host: database_url,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: database_ssl,
    },
    dataString: true,
  },
};
const MailConfig = {
  host: email_url,
  port: email_port,
  secure: false,
  auth: {
    user: email_stmp_user,
    pass: email_stmp_password,
  },
};

const verificationMailer = async function (user_email, token) {
  const MailObject = {
    from: sender_email,
    to: user_email,
    subject: "Verification Mail",
    text: `Click here to verify yourself. ${frontend_url}auth/verify?token=${token}`,
    html: `<html> <head> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"> <style> body { background-color: black; color: white; font-family: 'Roboto', sans-serif; } p { height:20rem; padding:2rem; font-size:20px; } a{ text-decoration:none; transition-duration: 150ms; } a:hover{ color:blue; font-style:italic; } </style> </head> <body> <h1>Hikmat</h1> <p>To verify, click this link, <a href="${frontend_url}auth/verify?token=${token}">Verify now</a></p> </body> </html>`,
  };
  return nodemailer.createTransport(MailConfig).sendMail(MailObject);
};
const resetPasswordMailer = async function (user_email, token) {
  const MailObject = {
    from: sender_email,
    to: user_email,
    subject: "Reset Your Password",
    text: `You can change your password now. Click here to change the password ${frontend_url}/resetpassword/${token}`,
    html: `<p>You can change your password now. Click here to change the password <a href="${frontend_url}/resetpassword/${token}">Reset Password here</a></p>`,
  };
  return nodemailer.createTransport(MailConfig).sendMail(MailObject);
};

const connectDB = async (sequelize) => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
};

const sequelize = new Sequelize(
  database_name,
  database_user,
  database_password,
  DatabaseConfig,
);

const RazorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const hashPassword = (value) => {
  try {
    return bcrypt.hashSync(value, parseInt(passwordHashValue));
  } catch (error) {
    console.error(error);
  }
};

const checkPassword = (value, encryptedValue) => {
  try {
    return bcrypt.compareSync(value, encryptedValue);
  } catch (error) {
    console.error(error);
  }
};
const FileRetrievalByID = async (req, res) => {
  const filename = req.params.file;
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.STORAGE,
    Key: filename,
  });
  try {
    const response = await s3.send(command);
    const data = await response.Body.transformToByteArray();
    const img = sharp(data.buffer);
    let quality = 20;
    if (req.query.type && req.query.type === "low") {
      img.resize(300, 300);
    } else {
      img.resize(960, 540, { fit: "inside" });
    }
    const result = await img
      .webp({ lossless: true, quality: quality, force: true })
      .toBuffer();
    res.writeHead(200, {
      "Content-Type": "image/webp",
    });
    res.end(result);
  } catch (error) {
    console.error(error);
  }
};
export {
  tokenChecker,
  tokenDecoder,
  connectDB,
  RazorPayInstance,
  verificationMailer,
  resetPasswordMailer,
  tokenEncoder,
  checkPassword,
  hashPassword,
  FileRetrievalByID,
  sequelize,
};
