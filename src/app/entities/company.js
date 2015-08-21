(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Company', function (ActiveRecordBase) {

      var Company = ActiveRecordBase.extend({
        attrs: ['id', 'name']
      });

      return Company;
    });
})(angular);