"use strict";

const rp = require("request-promise");
const API = "http://api.brewerydb.com/v2/";

const BeerModel = require("../models/beers");

class BeerDB {
  static _get(path, params) {
    const qs = params || {};
    qs.key = process.env.BREWERYDB_API_KEY;
    const options = {
      uri: `${API}/${path}`,
      qs,
      json: true,
    };
    return rp(options).then(response => response.data);
  }

  static getOneById(id) {
    return this._get(`beer/${id}`, { withBreweries: "Y" });
  }

  static search(q, t) {
    const type = t || "beer";
    return this._get("search", { q, withBreweries: "Y" });
  }

  static getAllInStock() {
    return BeerModel.find({ inStock: true })
      .then((beers) =>
        Promise.all(beers.map((beer) =>
            this.getOneById(beer.brewerydbId))));
  }
}

module.exports = BeerDB;

