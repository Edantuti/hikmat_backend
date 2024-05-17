import { RazorPayInstance } from "../util.js";
import { createPayment } from "../actions/PaymentAction.js";
import crypto from "crypto";
const postPayment = async (req, res) => {
  try {
    const orders = await RazorPayInstance.orders.create(req.body);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.json("error");
  }
};
const postVerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      await createPayment(req.body);
      res
        .status(200)
        .json({ url: `success?payment_id=${razorpay_payment_id}` });
    } else {
      res.status(403).json({ message: "Invalid payment" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { postPayment, postVerifyPayment };
