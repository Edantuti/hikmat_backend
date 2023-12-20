import { createOrder, retrieveAllOrders, modifyOrder } from "../actions/OrderAction.js"
import { retrieveUserOrders } from "../actions/UserAction.js"
import { clearUserCart } from "../actions/CartAction.js"
const postOrder = async (req, res) => {
  const data = await createOrder(req.body)
  await clearUserCart(req.body.userId)
  if (data.status === "FAILED") return res.status(500).json({ "message": "Internal Server Error" })
  return res.json(data)
}

const patchOrder = async (req, res) => {
  try {
    if (req.query.id === undefined) return res.status(400).json({ status: "failed", message: "params were not declared" })
    const data = await modifyOrder(req.body, req.query.id)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json(data)
  }
}

const getOrders = async (req, res) => {
  console.log(req.query)
  const data = await retrieveUserOrders(req.query.userid)
  res.json(data)
}

const getAllOrders = async (_,res) => {
  const data = await retrieveAllOrders()
  res.json(data)
}
export {
  postOrder,
  patchOrder,
  getOrders,
  getAllOrders
}
