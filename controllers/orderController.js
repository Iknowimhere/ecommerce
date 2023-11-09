const Cart = require("../models/Cart");
const Order = require("../models/Order");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getOrders = asyncErrorHandler(async (req, res) => {
    let owner = req.user._id;
    let orders = await Order.find({ owner });
    res.status(200).json({
      status: "success",
      data: {
        orders,
      },
    });
});

const createOrder = asyncErrorHandler(async (req, res) => {
    let owner = req.user._id;
    let cart = await Cart.findOne({ owner });
    if (cart) {
      const newOrder = await Order.create({
        owner: owner,
        products: cart.products,
        bill: cart.bill,
      });
      await Cart.findByIdAndDelete(cart._id);
      res
        .status(200)
        .json({ message: "Order placed successfully", data: { newOrder } });
    }
});

module.exports = {
  getOrders,
  createOrder
};
