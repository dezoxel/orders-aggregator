(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Company', function ($log, Class, backend) {

      var Company = Class.create({

        statics: {
          find: function(rawId) {
            var id = Number(rawId);

            if (id === 0 || isNaN(id) || id === Infinity) {
              throw new Error('Company: non-number specified as an argument');
            }

            return backend.get('/company/' + id)
              .then(function(company) {
                return new Company(company);
              })
              .catch(function() {
                $log.error('Company: Unable to find company');
              });
          }
        },

        _id: null,
        _title: null,

        constructor: function Company(params) {
          if (typeof params === 'string') {
            params = {title: params};
          } else {
            params = params || {};
          }

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Company: constructor params is not valid');
          }

          this._id = params.id;
          this._title = params.title;
        },

        isValidConstructorParams: function(params) {
          return params.title;
        },

        title: function() {
          return this._title;
        },

        id: function() {
          return this._id;
        }

      });

      return Company;
    });
})(angular);