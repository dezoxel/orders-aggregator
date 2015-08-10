(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .constant('ordersOffice1', [{
      weekStartDate: '2015-01-05',
      client: {
        firstName: 'Vasya',
        lastName: 'Pupkin'
      },
      mon: 'big_no_salad',
      tue: 'mid_no_garnish',
      thu: 'mid'
    }, {
      weekStartDate: '2015-01-05',
      client: {
        firstName: 'Ivan',
        lastName: 'Ivanov'
      },
      mon: 'big',
      tue: 'big',
      wed: 'big',
      thu: 'big',
      fri: 'big'
    }]);
})(angular);