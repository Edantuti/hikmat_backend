const { AuthCheckMiddleware } = require("../../middleware/authentication")
const { addCartItem, removeCartItem, modifyCartItem } = require("../Service/CartService")
const { getUserCart, tokenDeserialzer } = require("../Service/UserService")
const router = require("express").Router()

router.get("/", AuthCheckMiddleware, async (req, res) => {
  const value = await tokenDeserialzer(req.header("Authorization").substring(7))
  const result = await getUserCart(value.userid)
  res.json(result)
})

router.post("/", AuthCheckMiddleware, async (req, res) => {
  const { result } = await addCartItem(req.body)
  res.json(result)
})

router.delete("/", AuthCheckMiddleware, async (req, res) => {
  const data = await removeCartItem(req.query.id)
  res.send(data)
})
router.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});


module.exports.CartRouter = router
