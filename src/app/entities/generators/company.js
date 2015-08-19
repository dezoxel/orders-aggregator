(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('CompanyGenerator', function(RandomGenerator) {
      var CompanyGenerator = this;

      CompanyGenerator.titles = ['Google', 'Microsoft', 'Apple', 'Facebook'];

      CompanyGenerator.title = function() {
        var min = 0, max = this.titles.length - 1;

        return this.titles[RandomGenerator.int(min, max)];
      };

      CompanyGenerator.one = function() {
        return {
          id: RandomGenerator.id(),
          title: CompanyGenerator.title(),
        }
      };
    });
})(angular);