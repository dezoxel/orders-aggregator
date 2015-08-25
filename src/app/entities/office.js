(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Office', function (ActiveRecordBase) {

      var Office = ActiveRecordBase.extend({
        attrs: ['id', 'name'],
        belongsTo: 'company',
        persistence: '/offices'
      });

      return Office;
    });
})(angular);