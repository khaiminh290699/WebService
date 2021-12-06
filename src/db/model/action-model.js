const Model = require("./index");

class ModelAction extends Model {
  tableName = "actions";

  listActionsByWeb = async (web_id, type) => {
    const query = this.query().where({ web_id }).orderByRaw("type, order_number");
    if (type) {
      query.where({ type });
    }
    return query;
  }

  upsertActionsOfWeb = async (web_id, actions) => {
    // delete all action have wweb_id = web_id;
    await this.query().delete().where({ web_id });

    // counter type action map object for order_number of action;
    let key = {
      login: 1,
      logout: 1,
      posting: 1,
      get_forum: 1
    }

    // insert new actions to web;
    const list = await this.query().insert(
      actions.map((action) => {
        const { type } = action;
        // get counter;
        action.order_number = key[type];
        action.web_id = web_id;
        // json array;
        action.ancestors = JSON.stringify(action.ancestors);
        // update counter;
        key[type] += 1;
        return action
      })
    ).returning(["*"]);

    return list;
  }
}

module.exports = ModelAction;