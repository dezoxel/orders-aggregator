(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('clientsData', function() {

      function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      }

      return {
        clientWithName: function(fullName) {
          return {
            id: randomInteger(1, 999),
            fullName: fullName
          };
        }
      };
    });
})(angular);