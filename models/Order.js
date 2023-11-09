const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "user is not found"],
      ref: "users",
    },
    products: [
      {
        productID: {
          type: Schema.Types.ObjectId,
          required: [true, "productID is not found"],
          ref: "products",
        },
        quantity: {
          type: Number,
          required: [true, "please provide quantity"],
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: [true, "please provide price"],
        },
        title: {
          type: String,
          required: [true, "please provide title"],
        },
      },
    ],
    bill: {
      type: Number,
      required: [true,"please provide bill"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("order", orderSchema);
