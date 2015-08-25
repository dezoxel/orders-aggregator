(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('OrderGenerator', function(RandomGenerator, ClientGenerator, OfficeGenerator, CompanyGenerator, dishSets) {

      var OrderGenerator = this;

      OrderGenerator.weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];
      OrderGenerator.dishSetIDs = Object.keys(dishSets.list());

      OrderGenerator.dishSetForDay = function() {
        var min = 0, max = this.dishSetIDs.length - 1;

        return this.dishSetIDs[RandomGenerator.int(min, max)];
      };

      OrderGenerator.dishSetForWeek = function() {
        return this.weekdays.reduce(function(dishSetForWeek, weekday) {
          dishSetForWeek[weekday] = this.dishSetForDay();
          return dishSetForWeek;
        }.bind(this), {});
      };

      OrderGenerator.one = function() {
        return {
          id: RandomGenerator.id(),
          client: ClientGenerator.one(),
          dishSet: this.dishSetForWeek()
        };
      };

      OrderGenerator.many = function(count) {
        count = count || 15;

        var orders = [];
        for(var i = 0; i < count; i++) {
          orders.push(this.one());
        }

        return orders;
      };

      OrderGenerator.listWithOfficeAndWeek = function() {
        // TODO: Avoid adding company to the office
        var company = CompanyGenerator.one();
        var office = OfficeGenerator.oneFor(company);
        return {
          office: office,
          weekStartDate: RandomGenerator.weekStartDate(),
          list: this.many()
        };
      };
    });
})(angular);