"use strict";

const Model = require("../models/beers");
const Votes = require("./vote");

class BeerController {
  static getAllInStock() {
    return Model.find({ inStock: true })
      .then((beers) =>
        Promise.all(beers.map((beer) =>
          Votes.getVotesByBeer(beer._id)
            .then((votes) => {
              const down = votes.filter(v => !v.up).length;
              beer.votes = votes;
              beer.score = votes.length - down;
              return beer;
            }))));
  }
}

module.exports = BeerController;

