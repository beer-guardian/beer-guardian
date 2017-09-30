"use strict";

const mongoose = require("mongoose");

const beerSchema = new mongoose.Schema({
  brewerydbId: { type: String, required: true },
  inStock: { type: Boolean, required: true, default: false },
  name: String,
  description: String,
  brewery: String,
  labelUrl: String,
  abv: Number,
  ibu: Number,
});

module.exports = mongoose.model("Beer", beerSchema);

