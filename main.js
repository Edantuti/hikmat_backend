const express = require("express");
const morgan = require("morgan");
const { port, debug } = require("./config");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron")
const multerS3 = require("multer-s3")
const sharp = require('sharp')
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")

const { AdminRouter } = require("./routes/Controller/AdminController");
const { UserRouter } = require("./routes/Controller/UserController");
const { OrdersRouter } = require("./routes/Controller/OrderController");
const { ProductsRouter } = require("./routes/Controller/ProductController");
const { CartRouter } = require("./routes/Controller/CartController");
const { connection, sequelize } = require("./db/connect");
const { DealsModel } = require('./db/models/DealsModel')
const { DealsRouter } = require("./routes/Controller/DealsController");
const { AddressRouter } = require("./routes/Controller/AddressController");
const {
  retrieveBrand,
  retrieveCategory,
} = require("./routes/Service/AdminService");
const { Transporter } = require("./mail/connect");
const { PaymentController } = require("./routes/Controller/PaymentController");

cron.schedule('0 0 * * *', async () => {
  console.log("Executing cron job for deleting any outdated deals.")
  try {
    const deals = await sequelize.transaction(async (t) => {
      const data = await DealsModel.findAll({ transaction: t })
      return data
    })
    deals.forEach((deal) => {
      if (new Date(deal.getDataValue("expiry_date")) < new Date()) {
        deal.destroy()
      }

    })
  } catch (error) {
    console.error(error)
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
})

app.use(cors());
app.use("/public", express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({
    storage: multerS3({
      s3: new S3Client(),
      bucket: process.env.STORAGE,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now().toString()}`)
      }
    })
  }).any()
)
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  ),
);
if (debug)
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]"),
  );
app.get("/photos/:file", async (req, res) => {
  const filename = req.params.file
  const s3 = new S3Client();
  const command = new GetObjectCommand({
    Bucket: process.env.STORAGE,
    Key: filename
  })
  try {
    const response = await s3.send(command);
    const data = await response.Body.transformToByteArray()
    const img = sharp(data.buffer)
    let quality = 20
    if (req.query.type && req.query.type === "low") {
      img.resize(300, 300)
    } else {
      img.resize(1280, 720, { fit: 'inside' })
    }
    const result = await img.webp({ lossless: true, quality: quality, force: true }).toBuffer()
    res.writeHead(200, {
      'Content-Type': 'image/webp',
    });
    res.end(result);
  } catch (error) {
    console.error(error)
  }
})
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
app.use("/api/checkout", PaymentController);
app.use("/api/address", AddressRouter);
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
