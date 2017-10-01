"use strict";

const Model = require("../models/beers");
const Votes = require("./vote");

class BeerController {
  static getAllInStock(user) {
    return Model.find({ inStock: true })
      .then((beers) =>
        Promise.all(beers.map((beer) =>
          Votes.getVotesByBeer(beer._id)
            .then((votes) => {
              const up = votes.filter(v => v.up).length;
              beer.up = up;
              beer.down = votes.length - up;
              beer.score = beer.up - beer.down;
              if (user) {
                const myVote = votes.filter(v => v.user.equals(user._id))[0];
                if (myVote) {
                  beer.userVote = myVote.up ? "UP" : "DOWN";
                }
              }
              return beer;
            }))));
  }
}

module.exports = BeerController;

