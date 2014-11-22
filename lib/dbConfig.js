var DB = require('./db');

var db = new DB({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sfba'
});

module.exports = db;