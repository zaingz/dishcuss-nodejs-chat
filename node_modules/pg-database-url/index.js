'use strict'

// Example config object input
// {
//   host: 'localhost',
//   port: 5432,
//   database: 'dbname',
//   username: 'user',
//   password: 'pass'
// }

// Expected output
// postgres://user:pass@localhost:5432/dbname

module.exports = function (config) {
  // TODO: validate inputs
  var connString = [
    'postgres://',
    config.username,
    config.password ? (':' + config.password) : '',
    '@',
    config.host || 'localhost',
    ':',
    config.port || 5432,
    '/',
    config.database
  ].join('')

  return connString
}
