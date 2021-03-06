"use strict";

const Model = require("../models/beers");
const Votes = require("./vote");
const _ = require("lodash");

class BeerController {
  static getAllInStock(user) {
    return Model.find({ inStock: true })
      .then((beers) =>
        Promise.all(beers.map((beer) =>
          Votes.getVotesByBeer(beer._id)
            .then((votes) => {
              const out = beer.toJSON();
              const up = votes.filter(v => v.up).length;
              out.up = up;
              out.down = votes.length - up;
              out.score = out.up - out.down;
              if (user) {
                const myVote = votes.filter(v => v.user.equals(user._id))[0];
                if (myVote) {
                  out.userVote = myVote.up ? "UP" : "DOWN";
                }
              }

              out.ibu = out.ibu || "--";
              out.abv = out.abv || "--";
              out.description = out.description || "No description available for this beer.";

              return out;
            }))))
      .then((beers) => _.sortBy(beers, b => -b.score));
  }
}

module.exports = BeerController;

