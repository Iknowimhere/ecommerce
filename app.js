const express = require("express");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const CustomError = require("./utils/CustomError");
const globalErrorController = require("./controllers/globalErrorController");
let app = express();

app.use(express.json());

app.use("/app/v1/products", productRouter);
app.use("/app/v1/users", userRouter);
app.use("/app/v1/cart", cartRouter);
app.use("/app/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `this route ${req.url} is not found`,
  //   });
  //   let err = new Error(`this route ${req.url} is not found`);
  //   err.statusCode = 404;
  //   err.status = "fail";
  //   next(err);
  let err = new CustomError(404, `this route ${req.url} is not found`);
  next(err);
});

app.use(globalErrorController);
module.exports = app;
