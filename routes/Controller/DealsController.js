const { AuthCheckAdminMiddleware } = require("../../middleware/authentication");
const { retrieveDeals, modifyDeals, deleteDeals, createDeals } = require("../Service/DealsService")
const router = require("express").Router();


router.post("/", AuthCheckAdminMiddleware, async (req, res) => {
  const data = await createDeals(req.body);
  if (data.status === "FAILED") {
    return res.status(400).json("INVALID INPUTS")
  } else {
    return res.json(data)
  }
})

router.get("/", async (req, res) => {
  const data = await retrieveDeals(req.query);
  if (data.status === "FAILED") {
    return res.status(400).json("ERROR");
  } else {
    return res.json(data)
  }
})

router.patch("/", AuthCheckAdminMiddleware, async (req, res) => {
  const data = await modifyDeals(req.body);
  if (data.status === "FAILED") {
    return res.status(400).json("ERROR");
  }
  else {
    return res.json(data)
  }
})

router.delete("/", AuthCheckAdminMiddleware, async (req, res) => {
  const data = await deleteDeals(req.query);
  if (data.status === "FAILED")
    return res.status(400).json("ERROR");
  else
    return res.json(data)
})

module.exports.DealsRouter = router
