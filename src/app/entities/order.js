(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', function($log, Class, Client, orderTypes, backend) {

      var Order = Class.create({

        statics: {
          where: function(week) {
            return backend.get('/week/' + week.startDate().format('YYYY-MM-DD') + '/orders')
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

            return orders.map(function(order) {
              return new Order(
                new Client(order.client),
                order
              );
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

        constructor: function(client, params) {
          params = params || {};

          if (!this.isValidConstructorParams(params, client)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._id = params.id;
          this.setClient(client);
          this._mon = params.mon;
          this._tue = params.tue;
          this._wed = params.wed;
          this._thu = params.thu;
          this._fri = params.fri;
        },

        isValidConstructorParams: function(params, client) {
          return client;
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
        }

      });

      return Order;
    });
})(angular);