(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('CompanyGenerator', function(RandomGenerator) {
      var CompanyGenerator = this;

      CompanyGenerator.names = ['Google', 'Microsoft', 'Apple', 'Facebook'];

      CompanyGenerator.name = function() {
        var min = 0, max = this.names.length - 1;

        return this.names[RandomGenerator.int(min, max)];
      };

      CompanyGenerator.one = function() {
        return {
          id: 1,
          name: CompanyGenerator.name(),
        };
      };
    });
})(angular);