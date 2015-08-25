(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('BootstrapGenerator', function(CompanyGenerator, OfficeGenerator, ClientGenerator) {

      var BootstrapGenerator = this;

      BootstrapGenerator.everything = function() {
        var company = CompanyGenerator.one();
        var offices = OfficeGenerator.manyFor(company);
        var clients = ClientGenerator.manyForEach(offices);

        return {
          company: company,
          offices: offices,
          clients: clients
        };
      };

      return BootstrapGenerator;
    });
})(angular);