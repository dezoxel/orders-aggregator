(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', Client);

    function Client(Class) {

      return Class.create({

        _id: null,
        _firstName: '',
        _lastName: '',

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
          this._firstName = params.firstName || '';
          this._lastName = params.lastName || '';

          if (params.fullName && this._isNameEmpty()) {
            this._splitFullNameAndSave(params.fullName);
          }
        },

        _isNameEmpty: function() {
          return this.firstName() === '' && this.lastName() === '';
        },

        _splitFullNameAndSave: function(fullName) {
          var names = fullName.split(' ');

          this._firstName = names[0] || '';
          this._lastName = names[1] || '';
        },

        isValidConstructorParams: function(params) {
          return (
            (params.firstName && params.lastName) ||
            (params.fullName && params.fullName.indexOf(' ') !== -1)
          );
        },

        fullName: function() {
          return this._firstName + ' ' + this._lastName;
        },

        firstName: function() {
          return this._firstName;
        },

        lastName: function() {
          return this._lastName;
        },

        id: function() {
          return this._id;
        }
      });
    }
})(angular);