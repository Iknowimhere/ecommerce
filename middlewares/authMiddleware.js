const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

const auth = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;
  if (testToken || testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  //verify token
  const decodedToken = await jwt.verify(token, process.env.SECRET_STRING);
  const user = await User.findById(decodedToken.id);
  if (!user) {
    let err = new CustomError(401, "user is not logged in");
    next(err);
  }
  req.user = user;
  next();
});

module.exports = auth;
