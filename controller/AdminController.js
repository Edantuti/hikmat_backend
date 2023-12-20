import { backend_url } from "../config.js"
import { destoryDeals, retrieveDeals, createDeals } from "../actions/DealsAction.js"
import { createBrand, retrieveBrand, destoryBrand } from "../actions/BrandAction.js"
import { createCategory, retrieveCategory, destoryCategory } from "../actions/CategoryAction.js"

const postCategory = async (req, res) => {
  const data = await createCategory(req.body)
  if (data.status === "FAILED")
    return res.status(500).json({ "message": "Internal Server Error" })
  return res.json(data)
}
const deleteCategory = async (req, res) => {
  const data = await destoryCategory({ id: req.query.id })
  if (data.status === "FAILED")
    return res.status(500).json({ "message": "Internal Server Error" })
  return res.json(data)
}
const getCategory = async (_,res) => {
  const data = await retrieveCategory();
  if (data.status === "FAILED") return res.status(500).json({ "message": "internal server error" })
  return res.json(data)
}

const postBrand = async (req, res) => {
  const data = await createBrand(req.body)
  if (data.status === "FAILED")
    return res.status(500).json({ "message": "Internal Server Error" })
  return res.json(data)
}
const deleteBrand = async (req, res) => {
  const data = await destoryBrand({ id: req.query.id })
  if (data.status === "FAILED")
    return res.status(500).json({ "message": "Internal Server Error" })
  return res.json(data)
}
const getBrand = async (_,res) => {
  const data = await retrieveBrand();
  if (data.status === "FAILED") return res.status(500).json({ "message": "internal server error" })
  return res.json(data)
}
const getDeals = async (req, res) => {
  const data = await retrieveDeals(req.query)
  if (data.status === "FAILED") {
    return res.status(500).json({ "message": "Internal server error" })
  }
  return res.json(data)
}
const patchDeals = async (req, res) => {
  const data = await modifyDeals(req.body)
  if (data.status === "FAILED") {
    return res.status(500).json({ "message": "Internal server error" })
  }
  return res.json(data)
}
const postDeals = async (req, res) => {
  try {
    req.body.photo = `${backend_url}/photos/${req.files[0].key}`
    const data = await createDeals(req.body)
    if (data.status === "FAILED")
      return res.status(500).json({ "message": "Internal server error" })
    return res.json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ "message": "Internal server error" })
  }
}
const deleteDeals = async (req, res) => {
  res.json(await destoryDeals(req.body))
}
export {
  deleteBrand,
  deleteCategory,
  deleteDeals,
  patchDeals,
  postBrand,
  postCategory,
  postDeals,
  getBrand,
  getCategory,
  getDeals
}
