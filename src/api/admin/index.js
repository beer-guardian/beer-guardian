"use strict";

const BeerModel = require("../../models/beers");
const RequestModel = require("../../models/requests");
const UserModel = require("../../models/users");
const BDB = require("../../lib/brewdb");

const _ = require("lodash");

module.exports = require("express").Router();

module.exports.get("/", (req, res) => {
  res.json({
    admin: true,
  });
});

module.exports.get("/requests", (req, res) => {
  RequestModel.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(500).json({ message: "Unknown error" }));
});

module.exports.get("/users", (req, res) => {
  UserModel.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(500).json({ message: "Unknown error" }));
});

module.exports.post("/beers", (req, res) => {
  BDB.getOneById(req.body.brewerydbId)
    .then((beer) => {
      if (!beer) { return res.status(404).json({ message: "Beer not found" }); }
      return BeerModel.create({
        brewerydbId: req.body.brewerydbId,
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
      res.json(beer);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).json({ message: "Beer not found" });
      }
      res.status(500).json({ message: "Unknown error" });
    });
});

module.exports.put("/beers/:beer", (req, res) => {
  BeerModel.findById(req.params.beer)
    .then((beer) => {
      if (!beer) { return res.status(404).json({ message: "Beer not found" }); }

    });
});

module.exports.delete("/beers/:beer", (req, res) => {
  BeerModel.deleteOne({ _id: req.params.beer })
    .then((result) => {
      if (result.deletedCount !== 1) {
        return res.status(404).json({ message: "Beer not found" });
      }

      res.json({ message: "Beer deleted" });
    });
});
