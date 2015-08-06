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
            return orders.map(function(order) {
              return Order.createInstanceFrom(order);
            });
          },

          createInstanceFrom: function(params) {
            return new Order(
              params,
              new Client(params.client)
            );
          }
        },

        _id: null,
        _client: null,
        _mon: null,
        _tue: null,
        _wed: null,
        _thu: null,
        _fri: null,

        constructor: function(params, client) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._client = client;
          this._mon = params.mon;
          this._tue = params.tue;
          this._wed = params.wed;
          this._thu = params.thu;
          this._fri = params.fri;
        },

        isValidConstructorParams: function(params) {
          return params.client;
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
          this._client = client;
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