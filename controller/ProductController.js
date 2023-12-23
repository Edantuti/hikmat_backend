import {
  retrieveProduct,
  modifyProduct,
  removeProduct,
  
} from "../actions/ProductAction.js"
import {

  retrieveReview,
  createReview
} from "../actions/ReviewAction.js"
import { backend_url } from "../config.js";
const postProduct = async (req, res) => {

  let photos = [];
  for (let file of req.files) {
    photos.push(`${backend_url}/photos/${file.key}`);
  }
  req.body.photos = photos;
  req.body.benefits = JSON.parse(req.body.benefits);
  req.body.details = JSON.parse(req.body.details);
  const product = await createProduct(req.body);
  if (product.status === "FAILED") return res.status(400).json(product)
  res.json(product);
}
const getProducts = async (req, res) => {
  const data = {};
  if (req.query.brand) {
    data.brand = req.query.brand;
  }
  if (req.query.category) {
    data.category = req.query.category;
  }
  if (req.query.id) {
    data.id = req.query.id;
  }
  const product = await retrieveProduct(
    data,
    req.query.offset,
    req.query.limit,
  );
  if (product.status === "SUCCESS")
    res.json(product);
  else
    res.status(400).json(product)
}
const patchProducts = async (req, res) => {

  let photos = []
  if (typeof req.body.photos === "string")
    photos.push(req.body.photos)
  else
    photos = req.body.photos
  console.log(photos)
  let id = req.query.id;
  for (let file of req.files) {
    photos.push(`${backend_url}/photos/${file.key}`);
  }
  req.body.photos = photos;
  req.body.benefits = JSON.parse(req.body.benefits);
  req.body.details = JSON.parse(req.body.details);
  await modifyProduct(req.body, id);
  res.json("done");
}
const deleteProducts = async (req, res) => {
  const data = await removeProduct(req.query);
  if (data.status === "FAILED") return res.status(400).json(data)
  res.json({ message: "Done" });
}
const getProductReview = async (req, res) => {
  const data = await retrieveReview({
    productId: req.query.id,
    offset: req.query.offset,
  });
  if (data.status === "FAILED") return res.status(400).json(data);
  res.json(data);
}
const postProductReview = async (req, res) => {

  const data = await createReview({
    ...req.body,
    productId: req.query.id,
    userId: req.query.userId,
  });
  if (data.status === "FAILED") return res.status(400).json(data);
  res.json(data);
}

export {
  getProducts,
  getProductReview,
  postProduct,
  postProductReview,
  patchProducts,
  deleteProducts
}
