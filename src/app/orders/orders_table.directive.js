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
        vm.weekStartDate = $scope.weekStartDate;
        vm.orders = [];
        vm.ordersDisplayedCopy = [];
      };

      vm.fetchOrders = function() {
        return Order.findWhere(vm.office, vm.weekStartDate)
          .then(function(orders) {
            vm.orders = orders;
          })
          .catch(function() {
            var msg = 'OrdersTableController: Unable to fetch orders';

            $log.error(msg);
            return $q.reject(msg);
          });
      };

      vm.checkIn = function(name, selectedDishSets) {
        var dishSets = angular.copy(selectedDishSets);

        Client.findOrCreateBy({name: name})
          .then(function(client) {

            var order = new Order({
              client: client,
              weekStartDate: vm.weekStartDate,
              office: vm.office,
              dishSet: dishSets,
              payments: []
            });

            vm.orders.push(order);
          })
          .catch(function() {
            $log.error('OrdersTableController: Unable to find or create client with name "' + name + '"');
          });
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
          weekStartDate: '='
        },
        controller: 'OrdersTableController as vm',
        templateUrl: 'app/orders/orders_table.html'
      };
    });
})(angular);