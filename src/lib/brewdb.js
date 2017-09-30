"use strict";

const rp = require("request-promise");
const API = "http://api.brewerydb.com/v2/";


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
}

module.exports = BeerDB;

