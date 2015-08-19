(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('ClientGenerator', function(RandomGenerator) {
      var ClientGenerator = this;

      ClientGenerator.one = function(name) {
        return {
          id: RandomGenerator.id(),
          fullName: name || RandomGenerator.name(),
          balance: 0
        };
      };
    });
})(angular);