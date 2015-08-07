describe('OrdersController', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  beforeEach(module('sfba.orders'));

  var $rootScope, $q, Week, Order, Client;
  beforeEach('reassign injected services', inject(function (_$rootScope_, _$q_, _Week_, _Order_, _Client_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Week = _Week_;
    Order = _Order_;
    Client = _Client_;
  }));

  var $log;
  beforeEach('stub $log', function() {
    $log = {error: sinon.stub()};
  });

  var vm;
  beforeEach('create controller', inject(function($controller, moment) {
    vm = $controller('OrdersController', {Week: Week, moment: moment, $log: $log});
  }));

  describe('#defineInitialState', function() {

    it('has empty orders list', function() {
      expect(vm.orders).to.be.empty;
    });

    it('uses current week', function() {
      var begin = vm.week.startDate();
      var end = vm.week.endDate().clone().add(1, 'day'); // because moment.isBetween() is exclusive

      expect(moment().isBetween(begin, end)).to.be.true;
    });
  });

  describe('#fetchOrders', function() {
    var client;
    beforeEach(function() {
      client = new Client({
        firstName: 'Vasya',
        lastName: 'Pupkin'
      });
    });

    var order;
    beforeEach(function() {
      order = new Order(client);
    });

    beforeEach(function() {
      sinon.stub(Order, 'findWhere').returns($q(function(resolve) {
        resolve([order]);
      }));
    });

    afterEach(function() {
      Order.findWhere.restore();
    });

    it('returns an array of order instances', function() {
      vm.fetchOrders()
        .then(function() {
          expect(vm.orders).to.be.an('array').that.have.property(0).that.is.an.instanceOf(Order);
        });

      resolvePromises();
    });

    context('when error occured', function() {

      beforeEach(function() {
        Order.findWhere.restore();
        sinon.stub(Order, 'findWhere').returns($q(function(resolve, reject) {
          reject();
        }));
      });

      it('logs error message if any error occured while fetching orders', function() {
        vm.fetchOrders()
          .then(function() {
            expect($log.error).to.have.been.called;
          });

        resolvePromises();
      });
    });
  });
});