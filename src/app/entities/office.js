(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Office', function ($log, $q, Class, Company, backend) {

      var Office = Class.create({

        statics: {
          findByCompany: function(rawId) {
            var id = Number(rawId);

            if (id === 0 || isNaN(id) || id === Infinity) {
              throw new Error('Office: non-number specified as an argument for findByCompany');
            }

            return backend.get('/company/' + id + '/offices')
              .then(function(offices) {
                return Office.createCollectionFrom(offices);
              })
              .catch(function() {
                var msg = 'Office: An error occured when fetching offices';

                $log.error(msg);
                return $q.reject(msg);
              });
          },

          createCollectionFrom: function(officesData) {
            if (!officesData || !officesData.company || !(officesData.list instanceof Array)) {
              throw new Error('Office: invalid offices data format specified');
            }

            return officesData.list.map(function(officeItemData) {
              var office = officeItemData;

              office.company = new Company(officesData.company);

              return new Office(office);
            });
          },

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
                var msg = 'Office: Unable to find office';

                $log.error(msg);
                return $q.reject(msg);
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
            throw new Error('Office: invalid argument for setCompany');
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