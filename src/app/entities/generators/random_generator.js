(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('RandomGenerator', function() {

      var RandomGenerator = this;

      RandomGenerator.moneyItems = [5, 10, 20, 50, 100, 200, 500];
      RandomGenerator.weekStartDates = ['2015-01-05', '2015-01-12', '2015-01-19', '2015-01-26'];
      RandomGenerator.names = [
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

      RandomGenerator.int = function(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      };

      RandomGenerator.id = function() {
        return RandomGenerator.int(1, 1000000);
      };

      RandomGenerator.money = function() {
        var min = 0, max = this.moneyItems.length - 1;

        return this.moneyItems[RandomGenerator.int(min, max)];
      };

      RandomGenerator.name = function() {
        var min = 0, max = this.names.length - 1;

        return this.names[RandomGenerator.int(min, max)];
      };

      RandomGenerator.weekStartDate = function() {
        var min = 0, max = this.weekStartDates.length - 1;

        return this.weekStartDates[RandomGenerator.int(min, max)];
      };

      return RandomGenerator;
    });
})(angular);