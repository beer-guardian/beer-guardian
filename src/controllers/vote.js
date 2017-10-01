"use strict";

const Model = require("../models/votes");

class VoteController {
  static getVotesByBeer(id) {
    return Model.find({ beer: id });
  }

  static upVote(user, beerId) {
    Model.findOne({ user, beer })
      .then((res) => {
        const vote = res || new Model({
          user: user._id,
          beer,
          up: true,
        });
        vote.up = true;
        return vote.save();
      });
  }

  static downVote(user, beerId) {
    Model.findOne({ user, beer })
      .then((res) => {
        const vote = res || new Model({
          user: user._id,
          beer,
          up: false,
        });
        vote.up = false;
        return vote.save();
      });
  }
}

module.exports = VoteController;
