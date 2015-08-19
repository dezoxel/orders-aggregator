(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', function(BaseModel, validate, $q, $log, backend) {

      var Client = BaseModel.extend({

        _attrs: ['id', 'fullName', 'balance'],

        _validators: {
          fullName: {
            presence: true,
            length: {
              minimum: 2,
              maximum: 100
            }
          },
          id: {
            numericality: {
              onlyInteger: true,
              greaterThan: 0
            }
          },
          balance: {
            presence: true,
            numericality: {
              onlyInteger: true
            }
          }
        },

        statics: {
          findOrCreateByFullName: function(fullName) {
            if (!fullName) {
              throw new Error('Client: invalid arguments for findOrCreateByFullName');
            }

            var url = '/clients/findOrCreate/fullName/' + fullName;
            return backend.get(url)
              .then(function(clientData) {
                return new Client(clientData);
              })
              .catch(function() {
                var msg = 'Client: An error occured while finding client';
                $log.error(msg);

                return $q.reject(msg);
              });
          },
        }
      });

      return Client;
    });
})(angular);