const { ModelWeb, ModelAction } = require("../db");

async function webGetOne(data, db) {
  const { id } = data.params;

  const modelWeb = new ModelWeb(db);
  const modelAction = new ModelAction(db);

  const web = await modelWeb.findOne({ id });
  const actions = await modelAction.query().where({ web_id: id });

  return { status: 200, data: { web, actions } }
}

module.exports = webGetOne