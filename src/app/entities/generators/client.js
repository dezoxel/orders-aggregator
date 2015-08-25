(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('ClientGenerator', function(RandomGenerator) {
      var ClientGenerator = this;

      ClientGenerator.one = function(name) {
        return {
          id: RandomGenerator.id(),
          name: name || RandomGenerator.name()
        };
      };

      ClientGenerator.oneFor = function(office, name) {
        return {
          id: RandomGenerator.id(),
          name: name || RandomGenerator.name(),
          officeId: office.id
        };
      };

      ClientGenerator.manyFor = function(office) {
        // 15 clients by default
        var count = 15;

        var clients = [];
        for(var i = 0; i < count; i++) {
          clients.push(this.oneFor(office));
        }

        return clients;
      };

      ClientGenerator.manyForEach = function(offices) {
        var clients = [];

        offices.forEach(function(office) {
          clients = clients.concat(this.manyFor(office));
        }, this);

        return clients;
      };
    });
})(angular);