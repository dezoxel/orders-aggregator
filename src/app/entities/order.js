(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', Order);

    function Order(Class, Client, orderTypes) {

      return Class.create({

        _id: null,
        _client: null,
        _mon: null,
        _tue: null,
        _wed: null,
        _thu: null,
        _fri: null,

        constructor: function(params) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._client = params.client;
          this._mon = params.mon;
          this._tue = params.tue;
          this._wed = params.wed;
          this._thu = params.thu;
          this._fri = params.fri;
        },

        isValidConstructorParams: function(params) {
          return params.client && params.client instanceof Client;
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
    }
})(angular);