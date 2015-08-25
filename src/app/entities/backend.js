(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('backend', function($q, BootstrapGenerator, OrderGenerator, ClientGenerator, RandomGenerator) {
      return {
        get: function(url) {
          console.log(url);
          return $q(function(resolve, reject) {
            // like a reminder that we have to implement error case
            if (true) {
              if (url.indexOf('/company') !== -1) {
                resolve(BootstrapGenerator.everything());
              } else if (url.indexOf('/office') !== -1) {
                resolve(OrderGenerator.listWithOfficeAndWeek());
              } else {
                throw new Error('backend: Incorrect URL: "' + url + '"');
              }
            } else {
              reject();
            }
          });
        },

        create: function(url, attrs) {
          var newAttrs = angular.copy(attrs);
          if (!attrs.id) {
            newAttrs.id = RandomGenerator.id();
          }

          return $q(function(resolve) {
            resolve(newAttrs);
          });
        },

        findBy: function(url, attrs) {
          return $q.reject();
        }
      };
    });
})(angular);