(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', Client);

    function Client(Class) {

      return Class.create({

        _id: null,
        _firstName: null,
        _lastName: null,

        constructor: function(params) {
          if (!this.isValidConstructorParams(params)) {
            throw new Error('Client: constructor params is not valid');
          }

          this._firstName = params.firstName;
          this._lastName = params.lastName;
        },

        isValidConstructorParams: function(params) {
          return params.firstName && params.lastName;
        },

        fullName: function() {
          return this._firstName + ' ' + this._lastName;
        },

        setFirstName: function(firstName) {
          this._firstName = firstName;
        },

        firstName: function() {
          return this._firstName;
        },

        setLastName: function(lastName) {
          this._lastName = lastName;
        },

        lastName: function() {
          return this._lastName;
        },

        id: function() {
          return this._id;
        },

      });
    }
})(angular);