(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', function ($log, Class, Client, Office, Company, Payment, dishSets, backend, moment) {

      var Order = Class.create({

        statics: {
          findWhere: function(office, weekStartDate) {
            if (!office || !weekStartDate || !(office instanceof Office)) {
              throw new Error('Order: invalid arguments for findWhere');
            }

            var ordersUrl =
              '/office/' + office.id() +
              '/weekStartDate/' + weekStartDate +
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

            if (!ordersData || !ordersData.office || !ordersData.weekStartDate || !(ordersData.list instanceof Array)) {
              throw new Error('Order: invalid orders data format specified');
            }

            return ordersData.list.map(function(orderData) {

              return new Order({
                id: orderData.id,
                client: new Client(orderData.client),
                weekStartDate: ordersData.weekStartDate,
                office: new Office({
                  company: new Company(ordersData.office.company),
                  title: ordersData.office.title
                }),
                dishSet: orderData.dishSet
              });
            });
          }
        },

        _id: null,
        _client: null,
        _weekStartDate: null,
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
          this.setWeekStartDate(params.weekStartDate);
          this.setOffice(params.office);

          this._dishSet = params.dishSet || this._dishSet;
        },

        isValidConstructorParams: function(params) {
          return params.client && params.weekStartDate && params.office;
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

        weekStartDate: function() {
          return this._weekStartDate;
        },

        office: function() {
          return this._office;
        },

        setWeekStartDate: function(weekStartDate) {
          if (weekStartDate) {
            this._weekStartDate = weekStartDate;
          } else {
            throw new Error('Order: invalid argument for setWeekStartDate');
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