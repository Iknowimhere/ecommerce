const CustomError = require("../utils/CustomError");

const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const handleValidationError = (error) => {
  let errArray = Object.values(error.errors);
  let messages = errArray.map((err) => err.message);
  let message = messages.join(",");
  return new CustomError(400, message);
};

const handleDuplicateError = (error) => {
  let msg = `this email ${error.keyValue.email} exists already`;
  return new CustomError(400, msg);
};

const handleTokenExpiredError = () => {
  return new CustomError(
    401,
    "Your session has been expired try logging in once again"
  );
};

const handleJsonWebTokenError = () => {
  return new CustomError(401, "you're not authorized user");
};

const handleCastError = (error) => {
  return new CustomError(
    400,
    `${error.value} is not a proper id for a product`
  );
};
const prodError = (res, error) => {
  if (error.isOperational == true) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(error.statusCode).json({
      status: "error",
      message: "Something went wrong please try again later",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    console.log(error.statusCode);
    devError(res, error);
  }

  if (process.env.NODE_ENV === "production") {
    if (error.name === "ValidationError") {
      error = handleValidationError(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateError(error);
    }

    if (error.name === "TokenExpiredError") {
      error = handleTokenExpiredError(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError(error);
    }
    if (error.name === "CastError") {
      error = handleCastError(error);
    }
    prodError(res, error);
  }
};
