(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Payment', function(BaseModel) {

      var Payment = BaseModel.extend({

        _attrs: ['amount', 'timestamp', 'id'],

        _validators: {
          amount: {
            presence: true,
            numericality: {
              onlyInteger: true,
              greaterThan: 0
            }
          },
          timestamp: {
            presence: true,
            datetime: true
          },
          id: {
            numericality: {
              onlyInteger: true,
              greaterThan: 0
            }
          }
        },

        statics: {
          createCollectionFrom: function(paymentsData) {

            if (!(paymentsData instanceof Array)) {
              throw new Error('Payment: invalid payments data format specified');
            }

            return paymentsData.map(function(paymentData) {
              return new Payment(paymentData);
            });
          }
        }
      });

      return Payment;
    });
})(angular);