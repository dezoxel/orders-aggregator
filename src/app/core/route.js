(function() {
  'use strict';

  angular
    .module('sfba.core')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  }

})();
