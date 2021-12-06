const Model = require("./index");

class ModelForum extends Model {
  tableName = "forums";

  list = async (wheres, page, limit, order) => {
    const query = this.query().join("webs", "webs.id", "forums.web_id").select(
      this.DB.raw(`
        forums.*,
        webs.id AS web_id,
        webs.web_name,
        webs.web_url,
        webs.web_key
      `)
    )
    .whereRaw(`
      forums.is_deleted = false
    `)
    return this.queryByCondition(query, wheres, page,limit, order);
  }

  listForumsByWeb = async (web_id) => {
    return this.query().where({ is_deleted: false, web_id });
  }

  upsertForumOfWeb = async (web_id, forums) => {
    // turn on iss_deleted flat of forum that id not in argument forums but web_id is same argument web_id;
    const deletes = await this.query().update({
      is_deleted: true
    })
    .whereNotIn("id", forums.filter((forum) => forum.id).map((forum) => forum.id))
    .where({ web_id });

    let inserts = forums.filter((forum) => !forum.id);
    let updates = forums.filter((forum) => forum.id);

    // insert forum in forums which not have id;
    if (inserts.length) {
      inserts = await this.query().insert(
        inserts.map((forum) => {
          return {
            web_id,
            forum_name: forum.forum_name,
            // append "/" to the and of forum_url if its end not "/";
            forum_url: forum.forum_url.charAt(forum.forum_url.length - 1) === "/" ? forum.forum_url : forum.forum_url + "/",
            is_deleted: false
          }
        })
      ).onConflict(["web_id", "forum_name"]).merge();
    }

    // update forum in forums by id;
    if (updates.length) {
      try {
        updates = await this.query().insert(
          updates.map((forum) => {
            return {
              id: forum.id,
              web_id,
              forum_name: forum.forum_name,
              // append "/" to the and of forum_url if its end not "/";
              forum_url: forum.forum_url.charAt(forum.forum_url.length - 1) === "/" ? forum.forum_url : forum.forum_url + "/",
              is_deleted: false
            }
          })
        )
        // if conflict which id => update;
        .onConflict(["id"]).merge();
      } catch (err) {
        if (err.message.includes("forums_web_id_forum_name_unique"))
        throw new Error("One of your update forum name already exist but it was deleted, to recover it please create new");
      }
    }

    return {
      inserts,
      updates,
      deletes
    }
  }
}

module.exports = ModelForum;