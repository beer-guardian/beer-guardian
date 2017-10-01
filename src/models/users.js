"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 14;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

// If user.password is set, hash the password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

class User {
  checkPass(pass) {
    return bcrypt.compare(pass, this.password);
  }
}

userSchema.loadClass(User);

module.exports = mongoose.model("User", userSchema);

