var Promise = require('bluebird');

function DB() {}
function Connection() {}

factory.define('connection', Connection, {

  state: 'connected',

  connect: function() {
    return function(callback) {
      callback();
    };
  },

  end: function() {
    return function() {};
  },

  getConnectionError: function() {
    return function() {
      return new Error('Unable to connect');
    };
  },

  isConnected: function() {
    return function() {
      return this.state === 'connected';
    }.bind(this);
  }

});

factory.define('db', DB, {

  state: 'connected',

  connect: function() {
    var self = this;
    // we return function since factory-girl computes the object property in order
    // to get value, but we need method instead of value
    return function() {

      return new Promise(function(resolve, reject) {
        var connection = factory.buildSync('connection', {state: self.state});

        if (connection.isConnected()) {
          resolve();
        } else {
          reject(connection.getConnectionError());
        }
      });

    };
  },

  getConnection: function() {
    return function() {
      return factory.buildSync('connection');
    };
  },
});

