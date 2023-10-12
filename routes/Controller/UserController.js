const {
  createUser,
  retrieveUser,
  tokenGenerator,
  tokenVerifier,
  tokenDeserialzer,
  changeVerifiedStatus,
  getUser,
  modifyUser,
  changeUserPassword,
} = require("../Service/UserService");
const { hash, check } = require("../../db/hash");
const { unlink } = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");
const { verificationMailer } = require("../../mail/functions");
const { AuthCheckMiddleware } = require("../../middleware/authentication");
const router = require("express").Router();
const { backend_url } = require("../../config")

router.post("/register", async (req, res) => {
  try {
    const profile = req.files[0];
    req.body = {
      ...req.body,
      password: await hash(req.body.password),
      profile_url: `${backend_url}/public/images/${profile.filename}`,
    };
    const userData = await getUser(req.body)
    if (userData === null) {
      const { result } = await createUser(req.body);
      console.log(result);
      const token = await tokenGenerator({
        email: result.dataValues.email,
        userid: result.dataValues.id,
      });
      await verificationMailer(result.dataValues.email, token);
      res.json({
        status: "SUCCESS",
      });
    } else {
      await unlink(
        path.join(process.cwd(), `/public/images/${profile.filename}`),
      );
      res.status(400).json({
        status: "FAILED",
        message: "User already exists",
      });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: "FAILED", message: "INTERNAL SERVER ERROR" })
  }
});

router.post("/update", AuthCheckMiddleware, async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const data = { ...req.body, profile_url: `${backend_url}/${req.files[0].path}` }
  const result = await modifyUser(data, req.body.userid);
  if (result.status === "FAILED")
    return res.status(500).json({ message: "Internal Server Error" });
  return res.json(result)

});

router.get("/verify", async (req, res) => {
  console.log(req.query.token);
  try {
    const { userid, email } = await tokenDeserialzer(req.query.token);
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
});

router.post("/change", async (req, res) => {
  const userData = await getUser(req.body);
  if (userData.status !== "FAILED") {
    const token = await tokenGenerator({ email: userData.getDataValue("email"), userid: userData.getDataValue("id") })
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
})

router.get("/password", async (req, res) => {
  if (!req.query.token) return res.status(400).json({ status: "FAILED", message: "Token not specified" })
  if (await tokenVerifier(req.query.token)) {
    return res.json({ status: "SUCCESS", value: true })
  } else {
    return res.status(400).json({ status: "FAILED", value: false })
  }
})

router.post("/password", AuthCheckMiddleware, async (req, res) => {
  const { userid, email } = await tokenDeserialzer(req.headers.authorization.slice(7))
  const password = await hash(req.body.password)
  const result = await changeUserPassword(password, email, userid);
  if (result.status === "FAILED") return res.status(500).json(result)
  res.json(result)
})

router.post("/login", async (req, res) => {
  const user = await retrieveUser({ email: req.body.email });
  console.log(user);
  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "Unauthorized:NOT_FOUND" });
  if (
    (await check(req.body.password, user.password)) &&
    user.getDataValue("isVerified")
  ) {
    res.json({
      status: "SUCCESS",
      token: await tokenGenerator({
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
  } else if (await check(req.body.password, user.password)) {
    res
      .status(401)
      .json({ status: "FAILED", message: "Unauthorized:NOT_VERIFIED" });
  } else {
    res
      .status(401)
      .json({ status: "FAILED", message: "Unauthorized:INVALID_CREDENTIALS" });
  }
});
router.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});
module.exports.UserRouter = router;
