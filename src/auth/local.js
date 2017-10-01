"use strict";

const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/users");

module.exports = new LocalStrategy({ usernameField: "email" }, function (email, password, done) {
  Users.findOne({ email })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      user.checkPass(password)
        .then((valid) => {
          if (!valid) {
            return done(null, false, { message: "Incorrect email or password" });
          }
          return done(null, user);
        });
    })
    .catch((err) => {
      done(err);
    });
});

