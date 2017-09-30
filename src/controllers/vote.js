"use strict";

const Model = require("../models/votes");

class VoteController {
  static getVotesByBeer(id) {
    return Model.find({ beer: id });
  }
}

module.exports = VoteController;
