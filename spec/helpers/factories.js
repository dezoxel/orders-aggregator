var Promise = require('bluebird');

function DB() {}

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
  }
});
