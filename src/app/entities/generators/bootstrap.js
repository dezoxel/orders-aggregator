(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('BootstrapGenerator', function(CompanyGenerator, OfficeGenerator) {

      var BootstrapGenerator = this;

      BootstrapGenerator.everything = function() {
        var company = CompanyGenerator.one();
        var offices = OfficeGenerator.manyFor(company);

        return {
          company: company,
          offices: offices
        };
      };

      return BootstrapGenerator;
    });
})(angular);