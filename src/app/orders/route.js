(function() {
  'use strict';

  angular
    .module('sfba.orders')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/orders/orders.html',
        controller: 'OrdersController',
        controllerAs: 'vm'
      });
  }

})();
