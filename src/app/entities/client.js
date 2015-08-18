(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', function(BaseModel) {

      var Client = BaseModel.extend({

        _attrs: ['id', 'fullName'],

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
          }
        },

        constructor: function(params) {
          if (typeof params === 'string') {
            params = {fullName: params};
          } else {
            params = params || {};
          }

          this._super([params]);
        }
      });

      return Client;
    });
})(angular);