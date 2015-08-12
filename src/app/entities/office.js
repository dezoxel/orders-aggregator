(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Office', function ($log, Class, Company, backend) {

      var Office = Class.create({

        statics: {
          find: function(rawId) {
            var id = Number(rawId);

            if (id === 0 || isNaN(id) || id === Infinity) {
              throw new Error('Office: non-number specified as an argument');
            }

            return backend.get('/office/' + id)
              .then(function(officeData) {
                return new Office({
                  id: officeData.id,
                  title: officeData.title,
                  company: new Company(officeData.company)
                });
              })
              .catch(function() {
                $log.error('Office: Unable to find office');
              });
          }
        },

        _id: null,
        _title: null,

        constructor: function Office(params) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Office: constructor params is not valid');
          }

          this._id = params.id;
          this._title = params.title;
          this.setCompany(params.company);
        },

        setCompany: function(company) {
          if (company && company instanceof Company) {
            this._company = company;
          } else {
            throw new Error('Order: invalid argument for setCompany');
          }
        },

        company: function() {
          return this._company;
        },

        isValidConstructorParams: function(params) {
          return params.title && params.company;
        },

        title: function() {
          return this._title;
        },

        id: function() {
          return this._id;
        }

      });

      return Office;
    });
})(angular);