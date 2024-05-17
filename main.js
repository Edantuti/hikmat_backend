import express from "express";
import morgan from "morgan";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import cron from "node-cron";

import { MulterMiddleware } from "./middleware/multer.js";
import { port, debug } from "./config.js";

import { cronJob } from "./utils/cron.js";
import { FileRetrievalByID, sequelize, connectDB } from "./util.js";
import { UserRouter } from "./routes/UserRouter.js";
import { CategoryRouter } from "./routes/CategoryRouter.js";
import { PaymentRouter } from "./routes/PaymentRouter.js";
import { ProductRouter } from "./routes/ProductRouter.js";
import { OrderRouter } from "./routes/OrdersRouter.js";
import { BrandRouter } from "./routes/BrandRouter.js";
import { CartRouter } from "./routes/CartRouter.js";
import { AddressRouter } from "./routes/AddressRouter.js";
import { DealsRouter } from "./routes/DealsRouter.js";
cron.schedule("0 0 * * *", cronJob, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

app.use(cors());
app.use("/public", express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(MulterMiddleware);
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  ),
);
if (debug)
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]"),
  );
app.get("/photos/:file", FileRetrievalByID);

app.use("/api", UserRouter);
app.use("/api", OrderRouter);
app.use("/api", CategoryRouter);
app.use("/api", BrandRouter);
app.use("/api", CartRouter);
app.use("/api", DealsRouter);
app.use("/api", AddressRouter);
app.use("/api", PaymentRouter);
app.use("/api", ProductRouter);
app.use("/api", UserRouter);

app.listen(port, async () => {
  console.log("Server has started.");
  connectDB(sequelize);
  await sequelize.sync({ force: false, alter: debug });
  console.log("Sequelize synced!");
  console.log("Nodemailer Started.");
});
