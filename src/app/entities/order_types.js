(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('orderTypes', function() {

      var typesMap = {
        big: 'Большая',
        big_no_meat: 'Большая без мяса',
        big_no_salad: 'Большая без салата',
        big_no_garnish: 'Большая без гарнира',
        salad: 'Только салат',
        meat: 'Только мясо',
        garnish: 'Только гарнир',
        mid: 'Средняя',
        mid_no_meat: 'Средняя без мяса',
        mid_no_salad: 'Средняя без салата',
        mid_no_garnish: 'Средняя без гарнира',
      };

      this.displayNameFor = function(orderType) {
        return typesMap[orderType];
      };

    });
})(angular);