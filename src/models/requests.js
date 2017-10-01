"use strict";

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  user: { type: "ObjectId", ref: "User", required: true },
  brewerydbId: { type: String, required: true },
  name: String,
});

module.exports = mongoose.model("Request", requestSchema);

