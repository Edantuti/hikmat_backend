import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import {
  tokenDecoder,
  tokenEncoder,
  verificationMailer,
  hashPassword,
  checkPassword,
} from "../util.js"
import { backend_url } from "../config.js";
import {
  createUser,
  retrieveUser,
  changeUserPassword,
  modifyUser,
  changeVerifiedStatus
} from "../actions/UserAction.js";

const postUserRegister = async (req, res) => {
  try {
    const profile = req.files[0];
    req.body = {
      ...req.body,
      password: hashPassword(req.body.password),
      profile_url: `${backend_url}/photos/${profile.key}`,
    };
    const userData = await retrieveUser({ email: req.body.email })
    if (userData === null) {
      const { result } = await createUser(req.body);
      const token = tokenEncoder({
        email: result.dataValues.email,
        userid: result.dataValues.id,
      });
      await verificationMailer(result.getDataValue("email"), token);
      res.json({
        status: "SUCCESS",
      });
    } else {
      deleteFile(profile)
      res.status(400).json({
        status: "FAILED",
        message: "User already exists",
      });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: "FAILED", message: "INTERNAL SERVER ERROR" })
  }
}


function deleteFile(file) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.STORAGE,
    Key: file.key
  }
  );
  try {
    const client = new S3Client({});
    client.send(command).then((response) => console.log(response)).catch((err) => console.error(err))
  } catch (err) {
    console.error(err)
  }

}
//TODO:Better name
const postUserForgotPassword = async (req, res) => {
  const userData = await getUser(req.body);
  if (userData.status !== "FAILED") {
    const token = tokenEncoder({ email: userData.getDataValue("email"), userid: userData.getDataValue("id") })
    console.log(verificationMailer(req.body.email, token))
    res.json({
      status: "SUCCESS",
      value: true
    })
  } else {
    res.status(404).json({
      status: "FAILED",
      value: "USER_NOT_FOUND"
    })
  }
}
const postUserUpdate = async (req, res) => {

  try {
    let data = {}
    if (req.files.length)
      data = { ...req.body, profile_url: `${backend_url}/photos/${req.files[0].key}` }
    else
      data = req.body
    const result = await modifyUser(data, req.body.userid);
    if (result.status === "FAILED")
      return res.status(500).json({ message: "Internal Server Error" });

    return res.json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
const getUserVerify = async (req, res) => {
  try {
    const { userid, email } = tokenDecoder(req.query.token);
    await changeVerifiedStatus(userid, true);
    const user = await retrieveUser({ email: email });
    res.json({
      status: "SUCCESS",
      token: req.query.token,
      userData: {
        userid: user.dataValues.id,
        email: user.dataValues.email,
        profile_url: user.dataValues.profile_url,
        first: user.dataValues.firstName,
        last: user.dataValues.lastName,
        phone: user.dataValues.phone,
        admin: user.dataValues.isAdmin,
      },
    });
  } catch (error) {
    console.error(error)
  }
}
const getUserPassword = async (req, res) => {
  if (!req.query.token) return res.status(400).json({ status: "FAILED", message: "Token not specified" })
  if (await tokenVerifier(req.query.token)) {
    return res.json({ status: "SUCCESS", value: true })
  } else {
    return res.status(400).json({ status: "FAILED", value: false })
  }
}
const postUserPassword = async (req, res) => {
  const { userid, email } = tokenDecoder(req.headers.authorization.slice(7))
  const password = hashPassword(req.body.password)
  const result = await changeUserPassword(password, email, userid);
  if (result.status === "FAILED") return res.status(500).json(result)
  res.json(result)
}

const postUserLogin = async (req, res) => {
  const user = await retrieveUser({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "Unauthorized:NOT_FOUND" });
  if (
    (checkPassword(req.body.password, user.password)) &&
    user.getDataValue("isVerified")
  ) {
    res.json({
      status: "SUCCESS",
      token: tokenEncoder({
        email: user.dataValues.email,
        userid: user.dataValues.id,
      }),
      userData: {
        userid: user.dataValues.id,
        email: user.dataValues.email,
        profile_url: user.dataValues.profile_url,
        first: user.dataValues.firstName,
        last: user.dataValues.lastName,
        phone: user.dataValues.phone,
        admin: user.dataValues.isAdmin,
      },
    });
  } else if (checkPassword(req.body.password, user.password)) {
    res
      .status(401)
      .json({ status: "FAILED", message: "Unauthorized:NOT_VERIFIED" });
  } else {
    res
      .status(401)
      .json({ status: "FAILED", message: "Unauthorized:INVALID_CREDENTIALS" });
  }
}

export {
  postUserLogin,
  postUserUpdate,
  postUserPassword,
  postUserRegister,
  getUserVerify,
  postUserForgotPassword,
  getUserPassword
}
