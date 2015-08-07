(function() {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersController', OrdersController);

  function OrdersController($log, Week, Order, Company, moment, companyId) {
    var vm = this;

    vm.init = function() {
      vm.defineInitialState();

      vm.fetchCompany(companyId);
    };

    vm.defineInitialState = function() {
      vm.orders = [];
      // current week
      vm.week = new Week({
        startDate: moment().startOf('isoWeek'),
      });
      vm.company = null;
    };

    vm.fetchCompany = function(id) {
      return Company.find(id)
        .then(function(company) {
          vm.company = company;
        })
        .catch(function() {
          $log.error('Unable to fetch company');
        });
    },

    // is called automatically by Smart Table directive (st-pipe)
    vm.fetchOrders =function() {
      return Order.findWhere(vm.company, vm.week)
        .then(function(orders) {
          vm.orders = orders;
        })
        .catch(function() {
          $log.error('Unable to fetch orders for the current week');
        });
    };

    vm.init();
  }
})();
