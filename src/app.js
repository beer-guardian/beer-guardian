"use strict";

require("dotenv").config();

const express = require("express");
const _ = require("lodash");

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
const BeerModel = require("./models/beers");
const RequestModel = require("./models/requests");
const Beers = require("./controllers/beer");

const BDB = require("./lib/brewdb");

const port = 3000;

// Database connection
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
  promiseLibrary: global.Promise,
});
mongoose.Promise = global.Promise;

// decode requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
// and authentication routes
const localStrategy = auth.local;
passport.use(localStrategy);
app.use(passport.initialize());
app.use(passport.session());
auth.routes(app);

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, "views/main"),
  extname: '.hbs',
  partialsDir: path.join(__dirname, "views/partials"),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

// All files in public are served directly
app.get("/", (req, res) => {
  Beers.getAllInStock(req.user)
    .then((beers) => {
      res.render("index", {
        user: req.user,
        beers,
      });
    });
});

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  if (!req.user.admin) {
    return res.redirect("/");
  }

  next();
}

app.get("/admin/forms/beer/:id", ensureAdmin, (req, res) => {
  BeerModel.findOne({ _id: req.params.id })
    .then((beer) => {
      res.render("form", beer);
    });
});

app.post("/admin/forms/beer/:id", ensureAdmin, (req, res) => {
  BeerModel.findOne({ _id: req.params.id })
    .then((beer) => {
      Object.assign(beer, req.body);
      return beer.save();
    })
    .then(() => res.redirect("/admin"));
});

app.get("/admin/forms/deny/:id", ensureAdmin, (req, res) => {
  RequestModel.findOneAndRemove({ _id: req.params.id })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin");
    });
});

app.get("/admin/forms/request/:id", ensureAdmin, (req, res) => {
  RequestModel.findOne({ _id: req.params.id })
    .then((request) => {
      BDB.getOneById(request.brewerydbId)
        .then((beer) => {
          request.remove();
          return BeerModel.create({
            brewerydbId: request.brewerydbId,
            inStock: true,
            name: beer.name,
            description: beer.description,
            brewery: _.get(beer, "breweries.0.name"),
            labelUrl: _.get(beer, "labels.large"),
            abv: beer.abv,
            ibu: beer.ibu,
          })
        })
        .then((beer) => {
          res.redirect("/admin");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/admin");
        });
      });
});

app.use(express.static(path.join(__dirname, 'public')));

// JSON api in the api folder
app.use("/api/v1", require("./api"));

console.log(`server is listening on http://localhost:${port}`)
app.listen(port);

