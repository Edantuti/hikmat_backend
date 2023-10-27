const { backend_url } = require("../../config");
const {
  AuthCheckAdminMiddleware,
  AuthCheckMiddleware,
} = require("../../middleware/authentication");
const {
  retrieveProduct,
  modifyProduct,
  createProduct,
  removeProduct,
  RetrieveReview,
  createReview,
} = require("../Service/ProductService");

const router = require("express").Router();

router.post("/", AuthCheckAdminMiddleware, async (req, res) => {
  console.log(req.body);
  let photos = [];
  for (let file of req.files) {
    photos.push(`${backend_url}/photos/${file.key}`);
  }
  req.body.photos = [...photos];
  req.body.benefits = JSON.parse(req.body.benefits);
  req.body.details = JSON.parse(req.body.details);
  const product = await createProduct(req.body);
  if (product.status === "FAILED") return res.status(400).json(product)
  res.json(product);
});

router.get("/", async (req, res) => {
  console.log(req.query);
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
});

router.patch("/", AuthCheckAdminMiddleware, async (req, res) => {
  let photos = req.body.photos ? [req.body.photos] : [];
  let id = req.query.id;
  for (let file of req.files) {
    photos.push(`${backend_url}/photos/${file.key}`);
  }
  req.body.photos = [...photos];
  req.body.benefits = JSON.parse(req.body.benefits);
  req.body.details = JSON.parse(req.body.details);
  await modifyProduct(req.body, id);
  res.json("done");
});

router.delete("/", AuthCheckAdminMiddleware, async (req, res) => {
  console.log(req.query);
  const data = await removeProduct(req.query);
  if (data.status === "FAILED") return res.status(400).json(data)
  res.json({ message: "Done" });
});

router.get("/reviews", async (req, res) => {
  console.log(req.query);
  const data = await RetrieveReview({
    productId: req.query.id,
    offset: req.query.offset,
  });
  if (data.status === "FAILED") return res.status(400).json(data);
  res.json(data);
});

router.post("/reviews", AuthCheckMiddleware, async (req, res) => {
  console.log(req.query);
  const data = await createReview({
    ...req.body,
    productId: req.query.id,
    userId: req.query.userId,
  });
  if (data.status === "FAILED") return res.status(400).json(data);
  res.json(data);
});
router.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});
module.exports.ProductsRouter = router;
