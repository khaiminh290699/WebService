const { ModelWeb } = require("../db");
const { Rabbitmq } = require("../ultilities");

async function getCommunity(data, db) {

  const { urls = [] } = data.params;
  if (!urls.length) {
    return { status: 400, message: "Missing params" };
  }

  const modeWeb = new ModelWeb(db);

  const webUrls = Object.keys(urls.reduce((webUrls, url) => {
    const strs = url.split("/");
    const web_url = `${strs[0]}//${strs[2]}/`;
    webUrls[web_url] = true;
    return webUrls;
  }, {}))

  const webs = await modeWeb.query().whereIn("web_url", webUrls);

  const notSupporting = webUrls.filter((webUrl) => !webs.some((web) => web.web_url === webUrl));

  const rabbitmq = new Rabbitmq();
  rabbitmq.produce({
    ...data.params,
    urls: urls.filter((url) => !notSupporting.some((ns) => url.includes(ns)))
  }, { exchange: "background", queue: "get_community" });

  return { status: 200, data: { notSupporting } }
}

module.exports = getCommunity;