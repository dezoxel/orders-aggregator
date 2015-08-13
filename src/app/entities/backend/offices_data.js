(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .constant('officesData', {
      company: {
        id: 1,
        title: 'Cogniance'
      },
      list: [
        {
          id: 1,
          title: 'Office 1',
        },
        {
          id: 2,
          title: 'Office 2',
        }
      ]
    });
})(angular);