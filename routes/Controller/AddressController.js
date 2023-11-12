const { modifyAddress, retrieveAddress } = require("../Service/AddressService")
const { AuthCheckMiddleware } = require("../../middleware/authentication")
const router = require("express").Router();


router.get("/", AuthCheckMiddleware, async (req, res) => {
  try {
    const data = await retrieveAddress(req.query.userid)
    if (data.status === "FAILED") {
      return res.status(400).json({ "message": "Something went wrong", error: data.error })
    }
    return res.json(data)
  } catch (error) {
    res.status(500).json({ "message": "Internal Server Error" })
    return console.error(error)
  }
})

router.post("/", AuthCheckMiddleware, async (req, res) => {
  try {
    const data = await modifyAddress(req.body, req.query.userid);
    if (data.status === "FAILED") {
      return res.status(400).json({ "message": "Invalid Details", error: data.error });
    }
    return res.json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ "message": "Something went wrong." })
  }
})

module.exports.AddressRouter = router
