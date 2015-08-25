(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('backend', function($q, BootstrapGenerator, OrderGenerator, ClientGenerator) {
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
              } else if (url.indexOf('/clients/findOrCreate/fullName/') !== -1) {
                var fullName = url.replace('/clients/findOrCreate/fullName/', '');
                resolve(ClientGenerator.one(fullName));
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