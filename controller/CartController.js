import { addCartItem, removeCartItem } from "../actions/CartAction.js"
import { tokenDecoder } from "../util.js"
import { retrieveUserCart } from "../actions/UserAction.js"
const getCartItem = async (req, res) => {
  const UserData = await tokenDecoder(req.header("Authorization").substring(7))
  res.json(await retrieveUserCart(UserData.userid))
}

const postCartItem = async (req, res) => {
  const data = await addCartItem(req.body)
  if (data.status === "FAILED") {
    return res.status(500).json({ "message": "Internal Server Error" })
  }
  return res.json(data)
}
const deleteCartItem = async (req, res) => {
  const data = await removeCartItem(req.query.id)
  if (data.status === "FAILED") {
    return res.status(500).json({ "message": "Internal Server Error" })
  }
  return res.json(data)
}

export {
  deleteCartItem,
  postCartItem,
  getCartItem
}
