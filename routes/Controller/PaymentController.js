const { RazorPayInstance } = require("../../db/connect")
const { AuthCheckMiddleware } = require("../../middleware/authentication")
const { createPayment } = require("../Service/PaymentService")
const crypto = require("crypto")
const router = require("express").Router()

router.post("/", AuthCheckMiddleware, async (req, res) => {
  try {
    const orders = await RazorPayInstance.orders.create(req.body);
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.json("error")
  }
})
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ url: `success?payment_id=${razorpay_payment_id}` })
    } else {
      res.status(400).json("not valid")
    }

  } catch (error) {
    console.error(error)
    res.status(400).json("error")
  }
})

module.exports.PaymentController = router
