"use strict";

const BeerModel = require("../models/beers");

module.exports = require("express").Router();

module.exports.get("/", (req, res) => {
  res.json({
    admin: true,
  });
});

module.exports.post("/beers", (req, res) => {
  BDB.getOneById(req.body.brewerdbId)
    .then((beer) => {
      if (!beer) { return res.status(404).json({ message: "Beer not found" }); }

    });
});

module.exports.put("/beers/:beer", (req, res) => {
  BeerModel.findById(req.params.beer)
    ((beer) => {
      if (!beer) { return res.status(404).json({ message: "Beer not found" }); }

    });
});

module.exports.delete("/beers/:beer", (req, res) => {
  BeerModel.deleteOne({ _id: req.params.beer })
    .then((result) => {
      i
    });
});
