const { AuthCheckMiddleware, AuthCheckAdminMiddleware } = require("../../middleware/authentication")
const { clearUserCart } = require("../Service/CartService")
const { createOrder, getAllOrders, modifyOrder } = require("../Service/OrderService")
const { getUserOrders } = require("../Service/UserService")

const router = require("express").Router()

router.post("/", AuthCheckMiddleware, async (req, res) => {
  const data = await createOrder(req.body)
  await clearUserCart(req.body.userId)
  if (data.status === "FAILED") return res.status(500).json(data)
  res.json(data)
})

router.patch("/", AuthCheckAdminMiddleware, modifier)

async function modifier(req, res) {
  try {
    if (req.query.id === undefined) return res.json({ status: "FAILED", message: "params were not declared" })
    const data = await modifyOrder(req.body, req.query.id)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json(data)
  }
}

router.patch("/delivered", AuthCheckMiddleware, modifier)
router.patch("/cancelled", AuthCheckMiddleware, modifier)

router.get("/", AuthCheckMiddleware, async (req, res) => {
  console.log(req.query.userId)
  console.log(await getUserOrders(req.query.userId))
  res.json(await getUserOrders(req.query.userId))
})

router.get("/all", AuthCheckAdminMiddleware, async (req, res) => {
  const data = await getAllOrders()
  console.log(data)
  res.json(data)
})
router.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});

module.exports.OrdersRouter = router
