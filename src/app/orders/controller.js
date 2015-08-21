(function(angular) {
  'use strict';

  angular
    .module('sfba.orders')
    .controller('OrdersController', function ($log, $q, Week, Office, Time, moment, companyId) {
      var vm = this;

      vm.init = function() {
        vm.defineInitialState();

        return Office.findByCompany(companyId)
          .then(function(offices) {
            vm.offices = offices;
          })
          .catch(function() {
            $log.error('OrdersController: An error occurred when fetching offices');

            return $q.reject();
          });
      };

      vm.defineInitialState = function() {
        vm.offices = [];

        // TODO: deprecated
        vm.week = new Week({
          startDate: moment().startOf('isoWeek'),
        });

        // current week
        vm.weekStartDate = Time.startOfWeek();
      };

      vm.init();
    });
})(angular);
