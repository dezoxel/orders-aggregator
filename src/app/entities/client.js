(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Client', function (ActiveRecordBase) {

      var Client = ActiveRecordBase.extend({
        attrs: ['id', 'name'],
        belongsTo: 'office',
        hasOne: 'account',
        associationKey: 'clientId'
      });

      return Client;
    });
})(angular);