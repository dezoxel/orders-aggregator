(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .provider('backend', function(orders) {

      return {
        $get: function($q) {
          return {
            get: function() {
              return $q(function(resolve, reject) {
                if (true) {
                  resolve(orders);
                } else {
                  reject();
                }
              });
            }
          };
        }
      };
    });
})(angular);