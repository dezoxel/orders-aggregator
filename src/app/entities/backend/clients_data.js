(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('clientsData', function() {

      var names = [
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
        'Brandi Macdonald',
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
      ];

      function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      }

      var balances = [-250, -190, -100, -45, 0, 50, 100, 225];

      return {
        clientWithName: function(fullName) {
          return {
            id: randomInteger(1, 999),
            fullName: fullName,
            balance: randomInteger(0, balances.length - 1)
          };
        },

        generateAny: function() {
          return {
            id: randomInteger(1, 999),
            fullName: names[randomInteger(0, names.length - 1)],
            balance: balances[randomInteger(0, balances.length - 1)]
          };
        }
      };
    });
})(angular);