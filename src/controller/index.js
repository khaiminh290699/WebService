const getWebList = require("./web.list");
const getCommunity = require("./web.comunnity.get");
const getWebForum = require("./web.forums");
const webUpsert = require("./web.upsert");
const webGetOne = require("./web.get");

module.exports = {
  getWebList,
  getWebForum,
  getCommunity,
  webUpsert,
  webGetOne
}