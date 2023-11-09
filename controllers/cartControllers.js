const Cart = require("../models/Cart");
const Product = require("../models/Product");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getCart = asyncErrorHandler(async (req, res) => {
  let owner = req.user._id;
  const cart = await Cart.findOne({ owner: owner });
  if (cart && cart.products.length > 0) {
    return res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "there is no products found in cart",
    });
  }
});

const createCart = asyncErrorHandler(async (req, res,next) => {
  const { productID, quantity } = req.body;
  const owner = req.user._id;
    const cart = await Cart.findOne({ owner: owner });
    const product = await Product.findById(productID);
    if (!product) {
      let err = new CustomError(404, "there is no product with this id");
      next(err)
    }
    let title = product.title;
    let price = product.price;
    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productID === productID
      );
      if (productIndex > -1) {
        let product = cart.products[productIndex];
        product.quantity += quantity;
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.price * curr.quantity;
        }, 0);
        cart.products[productIndex] = product;
        await cart.save();
        return res.status(200).json({
          status: "success",
          data: {
            cart,
          },
        });
      } else {
        cart.products.push({ productID, title, price, quantity });
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.price * curr.quantity;
        }, 0);
        await cart.save();
        console.log(cart);
        return res.status(200).json({
          status: "success",
          data: {
            cart,
          },
        });
      }
    } else {
      const newCart = await Cart.create({
        owner: owner,
        products: [
          {
            productID,
            title,
            quantity,
            price,
          },
        ],
        bill: quantity * price,
      });
      res.status(200).json({
        status: "success",
        data: {
          newCart,
        },
      });
    }
});

const deleteCart = asyncErrorHandler(async (req, res) => {
    const productID = req.query.productID;
    const owner = req.user._id;

    const cart = await Cart.findOne({ owner });
    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productID == productID
      );
      if (productIndex > -1) {
        let product = cart.products[productIndex];
        cart.bill -= product.price * product.quantity;
        if (cart.bill < 0) {
          cart.bill = 0;
        }
        cart.products.splice(productIndex, 1);
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.price * curr.quantity;
        }, 0);
        await cart.save();
        return res.status(200).json({
          status: "success",
          data: {
            cart,
          },
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "there is no product with this id",
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        message: "there is no cart for this user",
      });
    }
});

module.exports = {
  getCart,
  createCart,
  deleteCart,
};
