(function(angular) {
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
      vm.ordersOffice1 = [];
      vm.ordersOffice2 = [];
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
    vm.fetchOrdersOffice1 =function() {
      return Order.findWhere(vm.company, vm.week, 'office1')
        .then(function(orders) {
          vm.ordersOffice1 = orders;
        })
        .catch(function() {
          $log.error('Unable to fetch orders for the current week of office1');
        });
    };

    // is called automatically by Smart Table directive (st-pipe)
    vm.fetchOrdersOffice2 =function() {
      return Order.findWhere(vm.company, vm.week, 'office2')
        .then(function(orders) {
          vm.ordersOffice2 = orders;
        })
        .catch(function() {
          $log.error('Unable to fetch orders for the current week of office2');
        });
    };

    vm.init();
  }
})(angular);
