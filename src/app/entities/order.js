(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('Order', function ($log, Class, Client, Week, Office, Company, orderTypes, backend, moment) {

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

          createCollectionFrom: function(ordersData) {

            if (!ordersData || !ordersData.office || !ordersData.week || !(ordersData.list instanceof Array)) {
              throw new Error('Order: invalid orders data format specified');
            }

            return ordersData.list.map(function(orderItemData) {
              var order = orderItemData;

              order.client = new Client(orderItemData.client);

              order.week = new Week({startDate: moment(ordersData.week.startDate, 'YYYY-MM-DD')});

              order.office = new Office({
                company: new Company(ordersData.office.company),
                title: ordersData.office.title
              });

              return new Order(order);
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

        constructor: function(params) {
          params = params || {};

          if (!this.isValidConstructorParams(params)) {
            throw new Error('Order: constructor params is not valid');
          }

          this._id = params.id;

          this.setClient(params.client);
          this.setWeek(params.week);
          this.setOffice(params.office);

          this._dishSet = params.dishSet;
        },

        isValidConstructorParams: function(params) {
          return params.client && params.week && params.office;
        },

        dishsetFor: function(weekday) {
          return orderTypes.displayNameFor(this._dishSet[weekday]);
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
        }
      });

      return Order;
    });
})(angular);