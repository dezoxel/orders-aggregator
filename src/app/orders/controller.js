(function() {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersController', OrdersController);

  function OrdersController($log, Week, Order, moment) {
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
      return Order.where(vm.week)
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
