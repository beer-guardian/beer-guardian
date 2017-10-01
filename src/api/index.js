"use strict";

const BDB = require("../lib/brewdb");
const Beers = require("../controllers/beer");

module.exports = require("express").Router();

module.exports.get("/search", (req, res) => {
  BDB.search(req.query.q)
    .then((response) => {
      res.json(response);
    });
});

module.exports.get("/beers", (req, res) =>
  Beers.getAllInStock(req.user).then(beers => res.json(beers)));

module.exports.post("/vote", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401)
  }

  if (req.body.vote === "UP") {
    return Votes.upVote(req.user, req.body.bee)
      .then(() => res.status(200).send())
      .catch(() => res.status(500).send());
  }

  if (req.body.vote === "DOWN") {
    return Votes.downVote(req.user, req.body.beer)
      .then(() => res.status(200).send())
      .catch(() => res.status(500).send());
  }
});

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  if (!req.user.admin) {
    return res.status(403).send("Must be an admin");
  }

  next();
}

module.exports.use("/admin", ensureAdmin, require("./admin"));
