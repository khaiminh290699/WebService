const DB = require("./connect/db")
const Model = require("./model")
const ModelWeb = require("./model/web-model")
const ModelForum = require("./model/forum-model")
const ModelAction = require("./model/action-model")

module.exports = {
  DB,
  Model,
  ModelWeb,
  ModelForum,
  ModelAction
}