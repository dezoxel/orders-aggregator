(function(angular) {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('CheckinRowController', function($scope, dishSets) {

      var vm = this;

      vm.init = function() {
        vm.defineInitialState();
      };

      vm.defineInitialState = function() {
        vm.clientFullName = '';
        vm.dishSets = dishSets.list();
        vm.weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];
        vm.selectedDishSets = {};
        vm.resetSelectedDishSet();
      };

      vm.resetSelectedDishSet = function() {
        vm.weekdays.forEach(function(weekday) {
          vm.selectedDishSets[weekday] = 'none';
        });
      };

      vm.checkinOrder = function() {
        $scope.onCheckin(vm.clientFullName, vm.selectedDishSets);

        vm.cleanFormFields();
      };

      vm.cleanFormFields = function() {
        vm.clientFullName = '';
        vm.resetSelectedDishSet();
      };

      vm.init();
    })
    .directive('checkinRow', function() {
      return {
        scope: {
          onCheckin: '='
        },
        templateUrl: 'app/orders/checkin_row.html',
        controller: 'CheckinRowController as vm'
      };
    });
})(angular);