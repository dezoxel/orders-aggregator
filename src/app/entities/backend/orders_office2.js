(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .constant('ordersOffice2', [{
      weekStartDate: '2015-01-05',
      client: {
        firstName: 'Hello',
        lastName: 'World'
      },
      mon: 'mid',
      tue: 'mid',
      thu: 'mid',
      fri: 'mid'
    }]);
})(angular);