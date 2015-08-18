(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', function (Class) {
      var Client = Class.create({

        _id: null,
        _fullName: '',

        constructor: function(params) {
          if (typeof params === 'string') {
            params = {fullName: params};
          } else {
            params = params || {};
          }

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Client: constructor params is not valid');
          }

          this._id = params.id;
          this._fullName = params.fullName;
        },

        isValidConstructorParams: function(params) {
          return Boolean(params.fullName);
        },

        fullName: function() {
          return this._fullName;
        },

        id: function() {
          return this._id;
        }
      });

      return Client;
    });
})(angular);