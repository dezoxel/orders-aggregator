(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', function ($log, Class, Client, Week, orderTypes, backend, moment) {

      var Order = Class.create({

        statics: {
          findWhere: function(office, week) {
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

          createCollectionFrom: function(orders) {
            if (!orders || !(orders instanceof Array)) {
              return [];
            }

            return orders.map(function(orderData) {

              var order = orderData;
              order.client = new Client(orderData.client);
              order.week = new Week({startDate: moment('YYYY-MM-DD', orderData.week.startDate)});

              return new Order(order);
            });
          }
        },

        _id: null,
        _client: null,
        _mon: null,
        _tue: null,
        _wed: null,
        _thu: null,
        _fri: null,
        _week: null,

        constructor: function(params) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._id = params.id;
          this.setClient(params.client);
          this.setWeek(params.week);
          this._mon = params.mon;
          this._tue = params.tue;
          this._wed = params.wed;
          this._thu = params.thu;
          this._fri = params.fri;
        },

        isValidConstructorParams: function(params) {
          return params.client && params.week;
        },

        dishsetForMon: function() {
          return orderTypes.displayNameFor(this._mon);
        },

        dishsetForTue: function() {
          return orderTypes.displayNameFor(this._tue);
        },

        dishsetForWed: function() {
          return orderTypes.displayNameFor(this._wed);
        },

        dishsetForThu: function() {
          return orderTypes.displayNameFor(this._thu);
        },

        dishsetForFri: function() {
          return orderTypes.displayNameFor(this._fri);
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

        setWeek: function(week) {
          if (week && week instanceof Week) {
            this._week = week;
          } else {
            throw new Error('Order: invalid argument for setWeek');
          }
        }
      });

      return Order;
    });
})(angular);