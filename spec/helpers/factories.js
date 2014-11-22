var Promise = require('bluebird');

function DB() {}
function Connection() {}

factory.define('connection', Connection, {

  state: 'connected',

  connect: function() {
    return function(callback) {
      if (this.state === 'connected') {
        callback();
      } else {
        callback(this.getConnectionError());
      }
    };
  },

  end: function() {
    return function() {
      this.state = 'disconnected';
    };
  },

  getConnectionError: function() {
    return function() {
      return new Error('Unable to connect');
    };
  }

});

factory.define('db', DB, {

  state: 'connected',
  _connection: null,

  connect: function() {
    // we return function since factory-girl computes the object property in order
    // to get value, but we need method instead of value
    return function() {
      var self = this;

      return new Promise(function(resolve, reject) {
        self._connection = factory.buildSync('connection', {state: self.state});

        self._connection.connect(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });

      });

    };
  },

  getConnection: function() {
    return function() {
      return this._connection;
    };
  },

  isConnected: function() {
    return function() {
      return this._connection.state === 'connected';
    };
  },

  closeConnection: function() {
    return function() {
      this._connection.end();
    };
  }
});

