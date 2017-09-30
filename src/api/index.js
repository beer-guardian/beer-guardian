"use strict";

const BDB = require("../lib/brewdb");
const Beers = require("../controllers/beer");

module.exports = require("express").Router();

module.exports.get("/search", (req, res) => {
  BDB.search(req.query.q)
    .then((response) => {
      res.json(response);
    });
});

module.exports.get("/beers", (req, res) =>
  Beers.getAllInStock().then(beers => res.json(beers)));

