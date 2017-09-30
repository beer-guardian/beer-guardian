"use strict";

const BDB = require("../lib/brewdb");

module.exports = require("express").Router();

module.exports.get("/", (req, res) => {
  res.json({ ok: "you found me" });
});

module.exports.get("/search", (req, res) => {
  BDB.search(req.query.q)
    .then((response) => {
      res.json(response);
    });
});

module.exports.get("/beers/:beerid", (req, res) => {
  BDB.getById(req.params.beerid).then((response) => {
    res.json(response);
  });
});

