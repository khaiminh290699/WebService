const { Kafka, Rabbitmq } = require("./src/ultilities");
const { DB, ModelWeb, ModelForum } = require("./src/db");
const { getWebForum, getWebList, getCommunity } = require("./src/controller");

const kafka = new Kafka();

kafka.consume("web.upsert", { groupId: "web.upsert" }, async (data) => {
  
})

kafka.consume("web.list", { groupId: "web.list" }, getWebList)

kafka.consume("web.getCommunity", { groupId: "web.getCommunity" }, getCommunity)

kafka.consume("web.forums", { groupId: "web.forums" }, getWebForum)
