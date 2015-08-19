(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('OfficeGenerator', function(RandomGenerator, CompanyGenerator) {
      var OfficeGenerator = this;

      OfficeGenerator.titles = ['Office 1', 'Office 2', 'Office 3'];

      OfficeGenerator.title = function() {
        var min = 0, max = this.titles.length - 1;

        return this.titles[RandomGenerator.int(min, max)];
      };

      OfficeGenerator.one = function() {
        return {
          id: RandomGenerator.id(),
          title: this.title(),
        }
      };

      OfficeGenerator.many = function(count) {
        count = count || 2;

        var offices = [];
        for(var i = 0; i < count; i++) {
          offices.push(this.one())
        }

        return offices;
      };

      OfficeGenerator.listWithCompany = function() {
        return {
          company: CompanyGenerator.one(),
          list: OfficeGenerator.many(2)
        }
      };
    });
})(angular);