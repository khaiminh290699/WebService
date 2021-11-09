const { Kafka, Rabbitmq } = require("./src/ultilities");
const { DB, ModelWeb, ModelForum } = require("./src/db");
const { getWebForum, getWebList, getCommunity, webUpsert, webGetOne } = require("./src/controller");

const kafka = new Kafka();

kafka.consume("web.upsert", { groupId: "web.upsert" }, webUpsert);

kafka.consume("web.list", { groupId: "web.list" }, getWebList)

kafka.consume("web.getCommunity", { groupId: "web.getCommunity" }, getCommunity)

kafka.consume("web.forums", { groupId: "web.forums" }, getWebForum)

kafka.consume("web.getOne", { groupId: "web.getOne" }, webGetOne)

