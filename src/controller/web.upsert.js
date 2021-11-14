const { Model, ModelWeb, ModelAction, ModelForum } = require("../db");

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
      const modelAction = new ModelAction(db, trx);
      const modelForums = new ModelForum(db, trx);

      let web = null;
      if (!id) {
        web = await modelWeb.insertOne({ web_url, web_name, web_key })
      } else {
        web = await modelWeb.findOne({ id })
        web = await modelWeb.updateOne({ ...web, web_name, web_url, web_key });
      }

      await modelForums.query().update({
        is_deleted: true
      })
      .whereNotIn("id", forums.filter((forum) => forum.id).map((forum) => forum.id))
      .where({ web_id: web.id });

      if (forums.length) {
        await modelForums.query().insert(
          forums.map((forum) => {
            return {
              id: forum.id,
              web_id: web.id,
              forum_name: forum.forum_name,
              forum_url: forum.forum_url.charAt(forum.forum_url.length - 1) === "/" ? forum.forum_url : forum.forum_url + "/"
            }
          })
        ).onConflict(["id"]).merge();
      }

      await modelAction.query().delete().where({ web_id: web.id });

      let key = {
        login: 1,
        logout: 1,
        posting: 1,
        get_forum: 1
      }
      const list = await modelAction.query().insert(
        actions.map((action) => {
          const { type } = action;
          action.order_number = key[type];
          action.web_id = web.id;
          action.ancestors = JSON.stringify(action.ancestors);
          key[type] += 1;
          return action
        })
      ).returning(["*"]);
  
      return { status: 200, data: { web, actions: list } }
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