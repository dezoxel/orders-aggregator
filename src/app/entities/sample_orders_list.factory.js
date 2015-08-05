(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('sampleOrdersList', function(Order, Client) {

      var pupkin = new Client({
        firstName: 'Vasya',
        lastName: 'Pupkin'
      });

      var ivanov = new Client({
        firstName: 'Ivan',
        lastName: 'Ivanov'
      });

      return [
        new Order({
          client: pupkin,
          mon: 'big_no_salad',
          tue: 'mid_no_garnish',
          thu: 'mid'
        }),
        new Order({
          client: ivanov,
          mon: 'big',
          tue: 'big',
          wed: 'big',
          thu: 'big',
          fri: 'big'
        }),
      ];
    });
})(angular);