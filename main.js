const express = require("express");
const morgan = require("morgan");
const { port, debug } = require("./config");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("node:path");
const cors = require("cors");

const { AdminRouter } = require("./routes/Controller/AdminController");
const { UserRouter } = require("./routes/Controller/UserController");
const { OrdersRouter } = require("./routes/Controller/OrderController");
const { ProductsRouter } = require("./routes/Controller/ProductController");
const { CartRouter } = require("./routes/Controller/CartController");
const { connection, sequelize } = require("./db/connect");
const {
  retrieveBrand,
  retrieveCategory,
} = require("./routes/Service/AdminService");
const { Transporter } = require("./mail/connect");
const { DealsRouter } = require("./routes/Controller/DealsController");



app.use(cors());
app.use("/public", express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({
    storage: multer.diskStorage({
      destination: (req, file, callBack) => {
        callBack(null, "./public/images");
      },
      filename: (req, file, callBack) => {
        callBack(
          null,
          path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          file.fieldname +
          "-" +
          Date.now() +
          path.extname(file.originalname),
        );
      },
    }),
  }).any(),
);
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  ),
);
if (debug)
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]"),
  );

app.get("/api", (req, res) => {
  res.json("Still active.");
});

app.get("/api/brands", async (req, res) => {
  const data = await retrieveBrand();
  if (data.status === "FAILED") return res.status(400).json(data);
  return res.json(data);
});

app.get("/api/categories", async (req, res) => {
  const data = await retrieveCategory();
  if (data.status === "FAILED") return res.status(400).json(data);
  return res.json(data);
});

app.use("/api/auth", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/orders", OrdersRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/cart", CartRouter);
app.use("/api/deals", DealsRouter);
app.use((err, req, res, next) => {
  res.status(400).json(err.message);
  next();
});
app.listen(port, async () => {
  console.log("Server has started.");
  connection(sequelize);
  await sequelize.sync({ force: false, alter: debug });
  console.log("Sequelize synced!");
  Transporter;
  console.log("Nodemailer Started.");
});
