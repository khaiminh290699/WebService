const { ModelWeb } = require("../db");

async function list(data, db) {
  const { wheres = [], page, limit, order = {} } = data.params;
  const modelWeb = new ModelWeb(db);
  const webs = await modelWeb.queryByCondition(modelWeb.query(), wheres, page,limit, order);
  return { status: 200, data: { webs } };
}

module.exports = list;