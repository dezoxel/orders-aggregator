(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('ordersData', function(dishSets) {

      function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      }

      var names = {
        office1: [
          'Jack Larsen',
          'Jerry Lewis',
          'Robert Graves',
          'Tom Vinson',
          'Martin Gallagher',
          'Brian Potter',
          'Benjamin Snyder',
          'Timothy Fletcher',
          'Joshua Pratt',
          'Connor Dalton',
          'Robert Roberson',
          'Pete Hebert',
          'George McCarty',
          'Jay Barry',
          'Jessie Hayden',
          'Nancy Griffin',
          'Willie Oliver',
          'Joyce Benson',
          'Carol Houston',
          'Joan Hill',
          'Cassandra Pena',
          'Brenda Prince',
          'Daniela McBride',
          'Brandi Macdonald'
        ],
        office2: [
          'Theodore Dorsey',
          'Paul Hines',
          'Russell Vaughan',
          'Tracy Neill',
          'Hector Haley',
          'Edward Cross',
          'Georgia Conley',
          'Lucy Rhodes',
          'Kathy Calderon',
          'Suzanne Christensen',
          'Lois Swanson',
          'Peggy Herring',
          'Ebony Snider',
          'Sabrina Walter',
          'Ellie Lowe',
          'Camila Kirk'
        ]
      };

      var dishSetIDs = Object.keys(dishSets.list());
      var weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];

      function generateRandomOrdersFor(officeId) {
        return names[officeId].map(function(name) {
          var dishSet = {};
          weekdays.forEach(function(weekday) {
            dishSet[weekday] = dishSetIDs[randomInteger(0, dishSetIDs.length - 1)];
          });

          return {
            client: {fullName: name},
            dishSet: dishSet
          };
        });
      }

      return {
        office1: {
          office: {id: 1, title: 'Office 1', company: {id: 1, title: 'Cogniance'}},
          week: {startDate: '2015-01-05'},
          list: generateRandomOrdersFor('office1')
        },
        office2: {
          office: {id: 2, title: 'Office 2', company: {id: 1, title: 'Cogniance'}},
          week: {startDate: '2015-01-05'},
          list: generateRandomOrdersFor('office2')
        }
      };
    });
})(angular);