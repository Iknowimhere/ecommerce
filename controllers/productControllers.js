const Product = require("../models/Product");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");



const getProducts = asyncErrorHandler(async (req, res, next) => {
    const search = req.query.search || "";
    const page = req.query.page * 1 || 1  ;
    const limit = req.query.limit * 1 || 5;
    let category = req.query.category || "All";
    let sort = req.query.sort || "rating";
    const categoryArr = [
      "smartphones",
      "laptops",
      "fragrances",
      "skincare",
      "groceries",
      "home-decoration",
      "furniture",
      "tops",
      "womens-dresses",
      "womens-shoes",
      "mens-shirts",
      "mens-shoes",
      "mens-watches",
      "womens-watches",
      "womens-bags",
      "womens-jewellery",
      "sunglasses",
      "automotive",
      "motorcycle",
      "lighting",
    ];
    //pagination
    const skip = (page - 1) * limit;

    //based on category
    category === "All"
      ? (category = [...categoryArr])
      : (category = req.query.category.split(","));

    //sorting ["price","rating"]  price rating
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = "";
    if (sort.length > 0) {
      sortBy = sort.join(" ");
      console.log(sortBy);
    } else {
      sortBy = sort;
    }

    const products = await Product.find({
      title: { $regex: search, $options: "i" },
    })
      .where("category")
      .in([...category])
      .skip(skip)
      .limit(limit)
      .sort(sortBy);
    const total = await Product.countDocuments();
    res.status(201).json({
      status: "success",
      count: products.length,
      category,
      total,
      page,
      limit,
      data: {
        products: products,
      },
    });
});

module.exports = getProducts;
