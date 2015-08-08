(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .constant('ordersOffice1', [{
      client: {
        firstName: 'Vasya',
        lastName: 'Pupkin'
      },
      mon: 'big_no_salad',
      tue: 'mid_no_garnish',
      thu: 'mid'
    }, {
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