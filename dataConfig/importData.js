const Product = require("../models/Products/Product");
const mongoose = require("mongoose");
const fs = require("fs");

mongoose
  .connect("mongodb://127.0.0.1:27017/nodeKart")
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function importData() {
  try {
    const data = fs.readFileSync("./data.json", "utf-8");
    const products = JSON.parse(data);
    await Product.insertMany(products);
    console.log("products inserted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

async function deleteData() {
  try {
    await Product.deleteMany({});
    console.log("delete products");
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}
