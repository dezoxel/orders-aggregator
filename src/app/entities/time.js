(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Time', function(moment) {
      return {
        startOfWeek: function() {
          return moment().startOf('isoWeek').format('YYYY-MM-DD');
        }
      };
    });
})(angular);