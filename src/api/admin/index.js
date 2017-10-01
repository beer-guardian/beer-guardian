"use strict";

const BeerModel = require("../../models/beers");

module.exports = require("express").Router();

module.exports.get("/", (req, res) => {
  res.json({
    admin: true,
  });
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
        brewery: beer.breweries[0].name,
        labelUrl: beer.labels.large,
        abv: beer.abv,
        ibu: beer.ibu,
      })
    })
    .then((beer) => {
      res.json(beer);
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
