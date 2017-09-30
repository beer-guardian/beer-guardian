"use strict";

const mongoose = require("mongoose");

const beerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  inStock: { type: Boolean, required: true, default: false },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Beer", beerSchema);

