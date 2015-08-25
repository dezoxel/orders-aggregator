(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('AccountGenerator', function(RandomGenerator) {

      var AccountGenerator = this;

      AccountGenerator.oneFor = function(client) {
        return {
          id: RandomGenerator.id(),
          name: client.name,
          clientId: client.id
        };
      };

      AccountGenerator.oneForEach = function(clients) {
        return clients.map(function(client) {
          return AccountGenerator.oneFor(client);
        });
      };

      return AccountGenerator;
    });
})(angular);