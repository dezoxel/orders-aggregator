(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Account', function (ActiveRecordBase) {

      var Account = ActiveRecordBase.extend({
        belongsTo: 'client',
        hasMany: 'transactions'
      });

      return Account;
    });
})(angular);