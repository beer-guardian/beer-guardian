"use strict";

const passport = require("passport");
const UserModel = require("../models/users");
const _ = require("lodash");

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = {
  local: require("./local"),
  routes: (app) => {
    app.get("/login", (req, res) => res.render("login", { messages: req.flash() })),
    app.post('/login', passport.authenticate("local", {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login',
      failureFlash: "Incorrect username or password",
    }));

    app.get("/admin", (req, res) => {
      if (!req.isAuthenticated()) {
        return res.redirect("/login");
      }

      if (!req.user.admin) {
        return res.redirect("/");
      }

      // res.render("admin");
      res.render("admin", { admin:true });
    });

    app.get("/register", (req, res) => res.render("register"));
    app.post("/register", (req, res) => {
      const admins = process.env.ADMIN_EMAILS.split(",") || [];
      req.body.admin = !!_.find(admins, a => a === req.body.email);
      UserModel.create(req.body)
        .then((user) => {
          req.session.passport = { user: user._id.toString() };
          res.redirect("/");
        });
    });

    app.get("/logout", (req, res) => {
      req.session.destroy();
      res.redirect("/");
    });
  },
};

