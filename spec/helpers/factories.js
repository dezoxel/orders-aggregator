var Promise = require('bluebird');

function DB() {}
function Connection() {}

factory.define('connection', Connection, {

  connect: function() {
    return function(callback) {
      callback();
    };
  },

  end: function() {
    return function() {};
  }
});

factory.define('db', DB, {

  state: 'connected',

  connect: function() {
    // we return function since factory-girl computes the object property in order
    // to get value, but we need method instead of value
    return function() {

      return new Promise(function(resolve, reject) {
        if (this.state === 'connected') {
          resolve();
        } else {
          reject(new Error('Unable to connect'));
        }
      }.bind(this));

    }.bind(this);
  },

  getConnection: function() {
    return function() {
      return factory.buildSync('connection');
    };
  },
});

