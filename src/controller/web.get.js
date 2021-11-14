const { ModelWeb, ModelAction, ModelForum } = require("../db");

async function webGetOne(data, db) {
  const { id } = data.params;

  const modelWeb = new ModelWeb(db);
  const modelAction = new ModelAction(db);
  const modelForums = new ModelForum(db);

  const web = await modelWeb.findOne({ id });
  const actions = await modelAction.query().where({ web_id: id });

  const forums = await modelForums.query().where({ web_id: id, is_deleted: false });

  return { status: 200, data: { web, actions, forums } }
}

module.exports = webGetOne