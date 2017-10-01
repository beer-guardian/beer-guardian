"use strict";

const BDB = require("../lib/brewdb");
const Beers = require("../controllers/beer");
const Votes = require("../controllers/vote");
const RequestModel = require("../models/requests");

module.exports = require("express").Router();

module.exports.get("/search", (req, res) => {
  if (req.query.q === "") {
    return res.json([]);
  }
  BDB.search(req.query.q)
    .then((response) => {
      if (!response) {
        return res.json([]);
      }
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Unknown error",
      });
    });
});

module.exports.get("/beers", (req, res) =>
  Beers.getAllInStock(req.user).then(beers => res.json(beers)));

module.exports.post("/request", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.body.name && !req.body.beer) {
    return RequestModel.create({
      user: req.user._id,
      name: req.body.name,
    });
  }

  return BDB.getOneById(req.body.beer)
    .then((beer) => {
      return RequestModel.create({
        user: req.user._id,
        brewerydbId: req.body.beer,
        name: beer.name,
      });
    })
    .then((request) => {
      res.json(request);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Unknown error",
      });
    });
});

module.exports.post("/vote", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.body.vote === "UP") {
    return Votes.upVote(req.user, req.body.beer)
      .then(() => res.status(200).json({
        message: "Thanks for the vote!",
      }))
      .catch(() => res.status(500).json({
        message: "Unknown error",
      }));
  }

  if (req.body.vote === "DOWN") {
    return Votes.downVote(req.user, req.body.beer)
      .then(() => res.status(200).json({
        message: "Thanks for the vote!",
      }))
      .catch(() => res.status(500).json({
        message: "Unknown error",
      }));
  }
});

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!req.user.admin) {
    return res.status(403).json({
      message: "Must be an admin",
    });
  }

  next();
}

module.exports.use("/admin", ensureAdmin, require("./admin"));
