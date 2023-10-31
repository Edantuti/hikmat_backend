//TODO: Create Deals CRU operation


const { AuthCheckAdminMiddleware } = require("../../middleware/authentication")
const { createCategory, deleteCategory, createBrand, deleteBrand } = require("../Service/AdminService")

const router = require("express").Router()

router.use(AuthCheckAdminMiddleware)


router.post("/categories", async (req, res) => {
  const data = await createCategory(req.body)
  if (data.status === "FAILED")
    return res.status(400).json(data)
  res.json(data)
})

router.post("/brands", async (req, res) => {

  const data = await createBrand(req.body)
  if (data.status === "FAILED")
    return res.status(400).json(data)
  res.json(data)
})

router.delete("/deals", async (req, res) => {
  res.json(await deleteDeals(req.body))
})

router.delete("/categories", async (req, res) => {
  const data = await deleteCategory({ id: req.query.id })
  if (data.status === "FAILED")
    return res.status(400).json(data)
  res.json(data)
})

router.delete("/brands", async (req, res) => {
  const data = await deleteBrand({ id: req.query.id })
  if (data.status === "FAILED")
    return res.status(400).json(data)
  res.json(data)
})
router.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});

module.exports.AdminRouter = router
