(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .provider('backend', function(ordersOffice1, ordersOffice2, cogniance) {

      return {
        $get: function($q) {
          return {
            get: function(url) {
              return $q(function(resolve, reject) {
                if (true) {
                  if (url === '/company/1') {
                    resolve(cogniance);
                  } else if (url.indexOf('/company/1/office/office1/week') !== -1) {
                    resolve(ordersOffice1);
                  } else if (url.indexOf('/company/1/office/office2/week') !== -1) {
                    resolve(ordersOffice2);
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