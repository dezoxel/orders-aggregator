(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('BootstrapGenerator', function(
      CompanyGenerator,
      OfficeGenerator,
      ClientGenerator,
      RandomGenerator,
      AccountGenerator
    ) {

      var BootstrapGenerator = this;

      BootstrapGenerator.everything = function() {
        var company = CompanyGenerator.one();
        var offices = OfficeGenerator.manyFor(company);
        var clients = ClientGenerator.manyForEach(offices);

        return {
          company: company,
          offices: offices,
          weekStartDate: RandomGenerator.weekStartDate(),

          clients: clients,
          accounts: AccountGenerator.oneForEach(clients),
          transactions: [],
        };
      };

      return BootstrapGenerator;
    });
})(angular);