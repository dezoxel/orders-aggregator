(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .constant('ordersData', {
      office1: {
        office: {
          id: 1,
          title: 'Office 1',
          company: {
            id: 1,
            title: 'Cogniance'
          }
        },
        week: {
          startDate: '2015-01-05'
        },
        list: [{
          client: {
            firstName: 'Vasya',
            lastName: 'Pupkin'
          },
          dishSet: {
            mon: 'big_no_salad',
            tue: 'mid_no_garnish',
            thu: 'mid'
          }
        }, {
          client: {
            firstName: 'Ivan',
            lastName: 'Ivanov'
          },
          dishSet: {
            mon: 'big',
            tue: 'big',
            wed: 'big',
            thu: 'big',
            fri: 'big'
          }
        }]
      },
      office2: {
        office: {
          id: 2,
          title: 'Office 2',
          company: {
            id: 1,
            title: 'Cogniance'
          }
        },
        week: {
          startDate: '2015-01-05'
        },
        list: [{
          client: {
            firstName: 'Petro',
            lastName: 'Petrovich'
          },
          dishSet: {
            mon: 'mid_no_salad',
            tue: 'mid_no_garnish',
            fri: 'salad',
            thu: 'mid'
          }
        }]
      }
    });
})(angular);