(function(angular) {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersController', function ($log, $q, Bootstrap, Time, Company, companyId) {
      var vm = this;

      vm.init = function() {
        vm.defineInitialState();

        return Bootstrap.where({companyId: companyId, weekStartDate: vm.weekStartDate})
          .then(function(data) {
            Bootstrap.initWith(data);

            vm.offices = Company.find(companyId).offices();
          })
          .catch(function() {
            var msg = 'OrdersController: An error occurred when fetching orders';
            $log.error(msg);

            return $q.reject();
          });
      };

      vm.defineInitialState = function() {
        vm.offices = [];

        // current week
        vm.weekStartDate = Time.startOfWeek();
      };

      vm.init();
    });
})(angular);
