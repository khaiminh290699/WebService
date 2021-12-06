const { Model, ModelWeb } = require("../db");

async function webUpsert(data, db) {
  let { id, web_url, web_name, web_key, actions = [], forums = [] } = data.params;
  if (!web_url || !web_key || !web_name || !actions.length) {
    return { status: 400, message: "Missing params" };
  }
  if (!actions.some((action) => action.type === "login") || !actions.some((action) => action.type === "logout") || !actions.some((action) => action.type === "posting") || !actions.some((action) => action.type === "get_forum")) {
    return { status: 400, message: "Actions miss some type" };
  }
  if (web_url.charAt(web_url.length - 1) != "/") {
    web_url += "/"
  }
  const model = new Model(db);
  try {
    return await model.openTransaction(async (trx) => {
      const modelWeb = new ModelWeb(db, trx);

      const data = await modelWeb.upsertWeb(id, web_name, web_key, web_url, forums, actions);
  
      return { status: 200, data }
    })
  } catch (err) {
    if (err.message.includes(`web_key`)) {
      return { status: 400, message: "Web key is exist" }
    }
    if (err.message.includes(`web_name`)) {
      return { status: 400, message: "Web name is exist" }
    }
    throw err
  }

}

module.exports = webUpsert;