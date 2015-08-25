(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Transaction', function (ActiveRecordBase) {

      var Transaction = ActiveRecordBase.extend({
        attrs: ['id', 'income', 'charge', 'balance', 'datetime'],
        belongsTo: 'account',
      });

      return Transaction;
    });
})(angular);