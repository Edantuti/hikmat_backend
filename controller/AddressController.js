import { modifyAddress, retrieveAddress } from "../actions/AddressAction.js"
const getAddress = async (req, res) => {
  try {
    const data = await retrieveAddress(req.query.userid)
    if (data.status === "FAILED") {
      return res.status(404).json({ "message": "User id not found" })
    }
    return res.json(data)
  } catch (error) {
    res.status(500).json({ "message": "Internal Server Error" })
    return console.error(error)
  }
}

const postAddress = async (req, res) => {
  try {
    const data = await modifyAddress(req.body, req.query.userid);
    if (data.status === "FAILED") {
      return res.status(400).json({ "message": "Invalid Details" })
    }
    return res.json(data)
  } catch (error) {
    res.status(500).json({ "message": "Internal Server Error" })
    return console.error(error)

  }
}

export {
  getAddress,
  postAddress
}
