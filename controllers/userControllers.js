const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const genToken = async (id) => {
  return await jwt.sign({ id: id }, process.env.SECRET_STRING, {
    expiresIn: "1d",
  });
};
const signup = asyncErrorHandler(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = await genToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //existing user
  const existingUser = await User.findOne({ email: email });
  const passwordMatch = await existingUser.comparePassword(
    password,
    existingUser.password
  );
  if (!existingUser && !passwordMatch) {
    let err = new CustomError(
      400,
      "user with this credentials is missing or password is wrong"
    );
    next(err);
  }
  let token = await genToken(existingUser._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      existingUser,
    },
  });
});

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    const err = new CustomError(401, "User doesn't exist");
    next(err);
  }

  let token = await user.resetToken();
  await user.save();
  let message = `this is the link for reset password and it is going to be valid for 10 min only http://127.0.0.1:5000/app/v1/users/resetPassword/${token}`;
  let options = {
    userEmail: user.email,
    subject: "reset password",
    message: message,
  };
  await sendEmail(options);
  res.status(200).json({
    status: "success",
    message: "mail sent successfully",
  });
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  let token = crypto
    .createHash("sha256", process.env.SECRET_STRING)
    .update(req.params.token)
    .digest("hex");
  let user = await User.findOne({
    resetHashedToken: token,
    passwordRestTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    let err = new CustomError(401, "reset password token has been expired");
    next(err);
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordRestTokenExpiresAt = undefined;
  user.resetHashedToken = undefined;
  user.passWordChangedAt = Date.now();
  await user.save();
  res.status(200).json({
    status: "success",
    message: "password has been reset successfully",
  });
});

// const verifyRole=(role)=>{
//   return (req,res,next)=>{
//     if(req.user.role!=role){
//       let err=new CustomError(403,'Youre not authorised to access this route')
//       next(err)
//     }
//     next()
//   }
// }

const verifyRole = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      let err = new CustomError(
        403,
        "Youre not authorised to access this route"
      );
      next(err);
    }
    next();
  };
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyRole,
};
