const { ModelForum } = require("../db");

async function getWebForum(data, db) {
  const { wheres = [], page, limit, order = {} } = data.params;
  const modelForum = new ModelForum(db);
  const query = modelForum.query().join("webs", "webs.id", "forums.web_id").select(
    modelForum.DB.raw(`
      forums.*,
      webs.id AS web_id,
      webs.web_name,
      webs.web_url,
      webs.web_key
    `)
  )
  const forums = await modelForum.queryByCondition(query, wheres, page,limit, order);
  return { status: 200, data: { forums } };
}

module.exports = getWebForum;