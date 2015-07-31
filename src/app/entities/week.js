(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Week', Week);

    function Week(Class, $q, Order, sampleOrdersList, moment) {

      return Class.create({

        _startDate: null,
        _endDate: null,

        constructor: function(params) {
          if (!this.isValidConstructorParams(params)) {
            throw new Error('Week: constructor params is not valid');
          }

          this.setStartDate(params.startDate);
        },

        setStartDate: function(startDate) {
          // 1 - iso number of Monday
          if (startDate.isoWeekday() !== 1) {
            throw new Error('Week: Specified date for the start week date is not a Monday!');
          }

          this._startDate = startDate;
          // TODO: Maybe there is more correct way of getting end of week?
          // 6 - amount of other week days
          this._endDate = startDate.clone().add(6, 'days');
        },

        getStartDate: function() {
          return this._startDate;
        },

        getEndDate: function() {
          return this._endDate;
        },

        isValidConstructorParams: function(params) {
          return moment.isMoment(params.startDate);
        },

        fetchOrders: function() {
          return $q(function(resolve, reject) {
            if (true) {
              resolve(sampleOrdersList);
            } else {
              reject();
            }
          });
        }

      });
    }
})(angular);