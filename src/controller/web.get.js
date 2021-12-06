const { ModelWeb, ModelAction, ModelForum } = require("../db");

async function webGetOne(data, db) {
  const { id } = data.params;

  const modelWeb = new ModelWeb(db);
  const { web, actions, forums  } = await modelWeb.getOne(id);
  return { status: 200, data: { web, actions, forums } }
}

module.exports = webGetOne