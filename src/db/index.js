const DB = require("./connect/db")
const Model = require("./model")
const ModelWeb = require("./model/web-model")
const ModelForum = require("./model/forum-model")

module.exports = {
  DB,
  Model,
  ModelWeb,
  ModelForum
}