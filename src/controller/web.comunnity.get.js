const { Rabbitmq } = require("../ultilities");

async function getCommunity(data, db) {
  const rabbitmq = new Rabbitmq();
  rabbitmq.produce(data.params, { exchange: "background", queue: "get_community" });
}

module.exports = getCommunity;