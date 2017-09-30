"use strict";

require("dotenv").config();

const express = require("express");

const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const hbs = require("express-hbs");

const auth = require("./auth");
const UserModel = require("./models/users");

const port = 3000;

// Database connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/beer-guardian", {
  useMongoClient: true,
  promiseLibrary: global.Promise,
});
mongoose.Promise = global.Promise;

// decode requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Session middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 24 * 3600,
  }),
}));

// set up passport middlewares
const localStrategy = auth.local;
passport.use(localStrategy);
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, "views/main"),
  extname: '.hbs',
  partialsDir: path.join(__dirname, "views/partials"),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

// All files in public are served directly
app.get("/", (req, res) => res.render("index"));
app.use(express.static(path.join(__dirname, 'public')));

// JSON api in the api folder
app.use("/api/v1", require("./api"));

app.get("/login", (req, res) => res.render("login"));
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/");
});

app.get("/register", (req, res) => res.render("register"));
app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then(() => res.redirect("/"));
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

console.log(`server is listening on http://localhost:${port}`)
app.listen(port);

