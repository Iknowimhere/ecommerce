const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field can't be empty"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email field can't be empty"],
      lowercase: true,
      validate: [validator.isEmail, "email is not proper"],
    },
    role: {
      type: String,
      enum: ["user", "merchant", "admin", "random person"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "please enter the password"],
      minlength: [8, "password should be min 8 characters"],
    },
    confirmPassword: {
      type: String,
      select: false,
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "password doesn't match",
      },
    },
    passWordChangedAt: Date,
    resetHashedToken: String,
    passwordRestTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//to compare password
userSchema.methods.comparePassword = async function (pwd, pwdDb) {
  return await bcrypt.compare(pwd, pwdDb);
};

//generate token to reset password
userSchema.methods.resetToken = async function () {
  const token = await crypto.randomBytes(32).toString("hex");
  this.resetHashedToken = crypto
    .createHash("sha256", process.env.SECRET_STRING)
    .update(token)
    .digest("hex");
  this.passwordRestTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return token;
};
module.exports = model("user", userSchema);
