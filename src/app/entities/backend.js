(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('backend', function($q, officesData, ordersData) {
      return {
        get: function(url) {
          return $q(function(resolve, reject) {
            // like a reminder that we have to implement error case
            if (true) {
              if (url === '/company/1/offices') {
                resolve(officesData);
              } else if (url.indexOf('/office/1/week') !== -1) {
                resolve(ordersData.office1);
              } else if (url.indexOf('/office/2/week') !== -1) {
                resolve(ordersData.office2);
              } else {
                throw new Error('backend: Incorrect URL: "' + url + '"');
              }
            } else {
              reject();
            }
          });
        }
      };
    });
})(angular);