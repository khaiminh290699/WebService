const knex = require("knex");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

class DB {
  constructor(){
    this.DB = knex.knex({
      client: "pg",
      connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT, 
        pool: 5
      }
    })
  };
}

module.exports = DB;