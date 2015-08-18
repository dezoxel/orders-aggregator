(function(angular) {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersTableController', function($scope, $log, $q, Order, Client) {
      var vm = this;

      vm.init = function() {
        vm.defineInitialState();

        return vm.fetchOrders();
      };

      vm.defineInitialState = function() {
        vm.office = $scope.office;
        vm.week = $scope.week;
        vm.orders = [];
        vm.ordersDisplayedCopy = [];
      };

      vm.fetchOrders = function() {
        return Order.findWhere(vm.office, vm.week)
          .then(function(orders) {
            vm.orders = orders;
          })
          .catch(function() {
            var msg = 'OrdersTableController: Unable to fetch orders';

            $log.error(msg);
            return $q.reject(msg);
          });
      };

      vm.checkIn = function(fullName, selectedDishSets) {
        var order = new Order({
          client: new Client(fullName),
          week: vm.week,
          office: vm.office,
          dishSet: angular.copy(selectedDishSets),
          payments: []
        });

        vm.orders.push(order);
      };

      vm.checkOut = function(order, index) {
        vm.orders.splice(index, 1);
      };

      vm.checkOutOneDay = function(order, weekday) {
        order.checkOutFor(weekday);
      };

      vm.init();
    })
    .directive('ordersTable', function() {
      return {
        restrict: 'E',
        scope: {
          office: '=for',
          week: '='
        },
        controller: 'OrdersTableController as vm',
        templateUrl: 'app/orders/orders_table.html'
      };
    });
})(angular);