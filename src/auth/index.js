"use strict";

const passport = require("passport");

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = {
  local: require("./local"),
};

