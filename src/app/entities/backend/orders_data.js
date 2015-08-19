(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('ordersData', function(dishSets, clientsData) {

      function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      }

      var dishSetIDs = Object.keys(dishSets.list());
      var weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];

      function generateRandomOrders() {
        var orders = [];
        for(var i = 0; i < 15; i++) {

          orders.push({
            id: generateId(),
            client: clientsData.generateAny(),
            dishSet: generateDishSet(),
            payments: generatePayments()
          });
        }

        return orders;
      }

      function generateId() {
        return randomInteger(1, 999);
      }

      function generateDishSet() {
        var dishSet = {};

        weekdays.forEach(function(weekday) {
          dishSet[weekday] = dishSetIDs[randomInteger(0, dishSetIDs.length - 1)];
        });

        return dishSet;
      }

      function generatePayments() {
        var payments = [];
        var bills = [20, 50, 100, 200];

        for(var i = 0; i < randomInteger(1, 3); i++) {
          payments.push({
            id: randomInteger(1, 999),
            timestamp: moment().unix(),
            amount: bills[randomInteger(0, bills.length - 1)]
          });
        }

        return payments;
      }

      return {
        office1: {
          office: {id: 1, title: 'Office 1', company: {id: 1, title: 'Cogniance'}},
          week: {startDate: '2015-01-05'},
          list: generateRandomOrders()
        },
        office2: {
          office: {id: 2, title: 'Office 2', company: {id: 1, title: 'Cogniance'}},
          week: {startDate: '2015-01-05'},
          list: generateRandomOrders()
        }
      };
    });
})(angular);