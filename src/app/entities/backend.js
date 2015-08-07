(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .provider('backend', function(orders, cogniance) {

      return {
        $get: function($q) {
          return {
            get: function(url) {
              return $q(function(resolve, reject) {
                if (true) {
                  if (url === '/company/1') {
                    resolve(cogniance);
                  } else if (url.indexOf('/company/1/week') !== -1) {
                    resolve(orders);
                  }
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