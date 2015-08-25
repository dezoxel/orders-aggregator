(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Account', function (ActiveRecordBase) {

      var Account = ActiveRecordBase.extend({
        belongsTo: 'client',
        hasMany: 'transactions',

        totalPaidFor: function() {
          return 0;
        }
      });

      return Account;
    });
})(angular);