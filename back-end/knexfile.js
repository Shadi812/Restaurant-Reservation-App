/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://vtgzvhis:qvXs9SQqtawFzkrK9C9pDAiZzyf1cBJC@ruby.db.elephantsql.com/vtgzvhis",
  DATABASE_URL_DEVELOPMENT = "postgres://yqztrfic:jodSjaxMUGeFYOw0PZAXxdiLIVrh2TiA@ruby.db.elephantsql.com/yqztrfic",
  DATABASE_URL_TEST = "postgres://hubxfrux:Dw4n9LNnYCe7IXcanEjDoVuvR9ZqV1J-@queenie.db.elephantsql.com/hubxfrux",
  DATABASE_URL_PREVIEW = "postgres://mbmqlhuz:xhkWwLng6mLvuciArXWQPlQcvBw1fZ1z@queenie.db.elephantsql.com/mbmqlhuz",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
