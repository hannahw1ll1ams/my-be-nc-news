# NorthCoders News API

## Background

This API was built to be used in the Northcoders News Sprint during the Front End block of the course. Its database is PSQL and can be interacted with using [Knex](https://knexjs.org. It has a series of endpoints that each serve up JSON responses of topics, articles, users and comment datas to a React Front End.

Try out the app at : https://nc-discussions.netlify.com/
Front End repo at : https://github.com/hannahw1ll1ams/my-fe-nc-news2

These instructions will get you a copy of the project up, installing all dependencies and running on your local machine for development and testing purposes. 

## Prerequisites

- Git installed
- Node.js installed
- PostgresSQL installed

## Installling

Install dependencies

Clone this repo:

```bash
git clone https://github.com/hannahw1ll1ams/my-be-nc-news

cd my-be-nc-news

npm i
```

Create a knexfile.js in the root of your local respository that looks like this:

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "your_psql_username",
      password: "your_psql_password"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "your_psql_username",
      password: "your_psql_password"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```


Create your test and dev databases

```
npm run setup-dbs
```


Start the dev server

```
npm run dev
```

## Running the tests


```
npm run t
```