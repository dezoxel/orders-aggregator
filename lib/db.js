var Promise = require('bluebird');
var mysql = require('mysql');

function DB(params) {
  this._connection = mysql.createConnection(params);
}

DB.prototype.connect = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    self._connection.connect(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(self._connection);
      }
    });
  });
};

DB.prototype.getConnection = function() {
  return this._connection;
};

DB.prototype.setConnection = function(connection) {
  this._connection = connection;

  return this;
};

DB.prototype.isConnected = function() {
  return this._connection.state === 'connected';
};

DB.prototype.closeConnection = function() {
  this._connection.end();

  return this;
};

module.exports = DB;


