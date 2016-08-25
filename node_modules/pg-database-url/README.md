# pg-database-url

Build a database url from a config object

[![NPM](https://nodei.co/npm/pg-database-url.png?downloads=true&stars=true)](https://nodei.co/npm/pg-database-url/)

[![Media Suite](http://mediasuite.co.nz/ms-badge.png)](http://mediasuite.co.nz)

## Installation

```
npm install pg-database-url --save
```

## Usage

```js
var pgUrl = require('pg-database-url')

// Example config
// This may already be available from your database configuration or environment variables
var dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'dbname',
  username: 'user',
  password: 'pass'
}

var connString = pgUrl(dbConfig)
// -> 'postgres://user:pass@localhost:5432/dbname'
```

You can then use the resulting connection string with a library like `node-postgres` to establish a database connection.

The minimum config object could look look like this:
```js
{
  database: 'dbname',
  username: 'user'
}
```
which assumes that the connection is on `localhost:5432` and the database is configured to not require a password.

This would return a connection string like: `'postgres://user@localhost:5432/dbname'`
