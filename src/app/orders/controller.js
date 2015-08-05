(function() {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersController', OrdersController);

  function OrdersController(Week, moment, $log) {
    var vm = this;

    vm.init = function() {
      vm.defineInitialState();
    };

    vm.defineInitialState = function() {
      vm.orders = [];
      vm.week = new Week({
        startDate: moment().startOf('isoWeek'),
      });
    };

    // is called automatically by Smart Table directive (st-pipe)
    vm.fetchOrders =function() {
      return vm.week.fetchOrders()
        .then(function(orders) {
          vm.orders = orders;
        })
        .catch(function() {
          $log.error('Unable to fetch order for the current week');
        });
    };

    vm.init();
  }
})();
