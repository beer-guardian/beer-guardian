"use strict";

const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  user: { type: "ObjectId", ref: "User", required: true },
  beer: { type: "ObjectId", ref: "Beer", required: true },
  up: { type: Boolean, required: true },
});

module.exports = mongoose.model("Vote", voteSchema);

