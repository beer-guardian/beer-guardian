"use strict";

module.exports = require("express").Router();

module.exports.get("/", (req, res) => {
  res.json({ ok: "you found me" });
});



