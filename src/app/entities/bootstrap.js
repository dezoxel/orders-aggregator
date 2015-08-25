(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Bootstrap', function(Class, backend, $log, Company, Office, Client) {

      var Bootstrap = Class.create({

        statics: {
          where: function(params) {
            var companyId = params.companyId;
            var weekStartDate = params.weekStartDate;

            var url = '/company/' + companyId + '/offices/all/weekStartDate/' + weekStartDate + '/orders';
            return backend.get(url)
              .catch(function() {
                $log.error('Bootstrap: An error occured when fetching bootstrap info');
              });
          },

          initWith: function(data) {
            Company.addOne(data.company);
            Office.addMany(data.offices);
            Client.addMany(data.clients);
          }
        }
      });

      return Bootstrap;
    });
})(angular);