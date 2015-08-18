(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', function ($log, Class, Client, Week, Office, Company, Payment, dishSets, backend, moment) {

      var Order = Class.create({

        statics: {
          findWhere: function(office, week) {
            if (!office || !week || !(office instanceof Office) || !(week instanceof Week)) {
              throw new Error('Order: invalid arguments for findWhere');
            }

            var ordersUrl =
              '/office/' + office.id() +
              '/week/' + week.startDate().format('YYYY-MM-DD') +
              '/orders';

            return backend.get(ordersUrl)
              .then(function(orders) {
                return Order.createCollectionFrom(orders);
              })
              .catch(function() {
                $log.error('Order: An error occured when fetching orders');
              });
          },

          createCollectionFrom: function(ordersData) {

            if (!ordersData || !ordersData.office || !ordersData.week || !(ordersData.list instanceof Array)) {
              throw new Error('Order: invalid orders data format specified');
            }

            return ordersData.list.map(function(orderData) {

              return new Order({
                id: orderData.id,
                client: new Client(orderData.client),
                week: new Week({startDate: moment(ordersData.week.startDate, 'YYYY-MM-DD')}),
                office: new Office({
                  company: new Company(ordersData.office.company),
                  title: ordersData.office.title
                }),
                payments: Payment.createCollectionFrom(orderData.payments),
                dishSet: orderData.dishSet
              });
            });
          }
        },

        _id: null,
        _client: null,
        _week: null,
        _office: null,
        _dishSet: {
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
        },
        _weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
        _payments: [],

        constructor: function(params) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._id = params.id;

          this.setClient(params.client);
          this.setWeek(params.week);
          this.setOffice(params.office);

          this._dishSet = params.dishSet || this._dishSet;
          this.setPayments(params.payments);
        },

        isValidConstructorParams: function(params) {
          return params.client && params.week && params.office;
        },

        dishsetFor: function(weekday) {
          return this._isValidWeekday(weekday) ? dishSets.displayNameFor(this._dishSet[weekday]) : '';
        },

        setDishsetFor: function(weekday, dishSet) {
          if (this._isValidWeekday(weekday) && dishSets.isValid(dishSet)) {
            this._dishSet[weekday] = dishSet;
          } else {
            throw new Error('Order: invalid argument for setDishsetFor');
          }
        },

        checkOutFor: function(weekday) {
          if (this._isValidWeekday(weekday)) {
            this._dishSet[weekday] = null;
          } else {
            throw new Error('Order: invalid argument for checkOutFor');
          }
        },

        _isValidWeekday: function(weekday) {
          return typeof weekday === 'string' && this._weekdays.indexOf(weekday) !== -1;
        },

        setClient: function(client) {
          if (client && client instanceof Client) {
            this._client = client;
          } else {
            throw new Error('Order: invalid argument for setClient');
          }
        },

        client: function() {
          return this._client;
        },

        id: function() {
          return this._id;
        },

        week: function() {
          return this._week;
        },

        office: function() {
          return this._office;
        },

        setWeek: function(week) {
          if (week && week instanceof Week) {
            this._week = week;
          } else {
            throw new Error('Order: invalid argument for setWeek');
          }
        },

        setOffice: function(office) {
          if (office && office instanceof Office) {
            this._office = office;
          } else {
            throw new Error('Order: invalid argument for setOffice');
          }
        },

        totalToPay: function() {
          var total = 0;

          for(var weekday in this._dishSet) {
            var dishSetPerDay = this._dishSet[weekday];

            total += dishSets.priceFor(dishSetPerDay);
          }

          return total;
        },

        totalPaid: function() {
          return this._payments.reduce(function(sum, payment) {
            return sum + payment.get('amount');
          }, 0);
        },

        setPayments: function(payments) {
          if (!(payments instanceof Array)) {
            throw new Error('Order: payments should be an array');
          }

          this._payments = payments;

          return this;
        },

        addPayment: function(payment) {
          if (!payment || !payment.amount) {
            throw new Error('Order: addPayment: must be valid payment');
          }

          this._payments.push(payment);
        },

        payments: function() {
          return this._payments;
        }

      });

      return Order;
    });
})(angular);