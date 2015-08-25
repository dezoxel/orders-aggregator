(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('OfficeGenerator', function(RandomGenerator, CompanyGenerator) {
      var OfficeGenerator = this;

      OfficeGenerator.names = ['Office 1', 'Office 2', 'Office 3', 'Office 4'];

      OfficeGenerator.name = function() {
        var min = 0, max = this.names.length - 1;

        return this.names[RandomGenerator.int(min, max)];
      };

      OfficeGenerator.oneFor = function(company) {
        return {
          id: RandomGenerator.id(),
          name: this.name(),
          companyId: company.id
        };
      };

      OfficeGenerator.manyFor = function(company) {
        // 2 offices by default
        var count = 2;

        var offices = [];
        for(var i = 0; i < count; i++) {
          offices.push(this.oneFor(company));
        }

        return offices;
      };

    });
})(angular);