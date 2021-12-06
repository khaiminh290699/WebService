const Model = require("./index");
const ModelAction = require("./action-model")
const ModelForum = require("./forum-model")

class ModelWeb extends Model {
  tableName = "webs";

  getOne = async (id) => {
    const modelAction = new ModelAction(this.DB);
    const modelForums = new ModelForum(this.DB);

    const web = await this.findOne({ id });
    const actions = await modelAction.listActionsByWeb(id);
    const forums = await modelForums.listForumsByWeb(id);

    return {
      web,
      actions,
      forums
    };
  }

  list = async (wheres, page, limit, order) => {
    return this.queryByCondition(this.query(), wheres, page, limit, order)
  }

  upsertWeb = async (id, web_name, web_key, web_url, forums, actions) => {
    const modelAction = new ModelAction(this.DB, this.trx);
    const modelForums = new ModelForum(this.DB, this.trx);

    let web = null;
    // if id is provided update web, otherwise insert web;
    if (!id) {
      web = await this.insertOne({ web_url, web_name, web_key })
    } else {
      // get wweb by id then update;
      web = await this.findOne({ id })
      web = await this.updateOne({ ...web, web_name, web_url, web_key });
    }
    const { id: web_id } = web;

    await modelForums.upsertForumOfWeb(web_id, forums);
    const listForums = await modelForums.listForumsByWeb(web_id);

    const listActions = await modelAction.upsertActionsOfWeb(web_id, actions);

    return { web, actions: listActions, forums: listForums };
  }
}

module.exports = ModelWeb;