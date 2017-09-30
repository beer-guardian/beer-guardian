"use strict";

require("dotenv").config();

const path = require("path");

// Database connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/beer-guardian", {
  useMongoClient: true,
  promiseLibrary: global.Promise,
});
mongoose.Promise = global.Promise;

const express = require("express");
const app = express();
const port = 3000;

const hbs = require("express-hbs");
app.engine('hbs', hbs.express4({ defaultLayout: path.join(__dirname, "views/main"), extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

// All files in public are served directly
app.get("/", (req, res) => res.render("index"));
app.use(express.static(path.join(__dirname, 'public')));

// JSON api in the api folder
app.use("/api/v1", require("./api"));

// Render views directly
app.use("/template", (req, res) => {
  res.render("template");
});

console.log(`server is listening on http://localhost:${port}`)
app.listen(port);

