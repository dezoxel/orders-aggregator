describe('OrdersController', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  beforeEach(module('sfba.orders'));

  var vm, Week, $rootScope, $q, $log, Order;

  beforeEach(inject(function ($controller, _$rootScope_, _$q_, moment, _Week_, _Order_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Week = _Week_;
    Order = _Order_;

    sinon.stub(Order, 'findWhere').returns($q(function(resolve) {
      resolve([1,2,3]);
    }));

    $log = {error: sinon.stub()};

    vm = $controller('OrdersController', {Week: Week, moment: moment, $log: $log});
  }));

  afterEach(function() {
    Order.findWhere.restore();
  });

  it('has empty orders list as initial state', function() {
    expect(vm.orders).to.be.empty;
  });

  it('fetches the orders', function() {
    vm.fetchOrders()
      .then(function() {
        expect(vm.orders).to.deep.equal([1,2,3]);
      });

    resolvePromises();
  });

  it('uses current week when fetching orders', function() {
    var begin = vm.week.startDate();
    var end = vm.week.endDate().clone().add(1, 'day'); // because moment.isBetween() is exclusive

    expect(moment().isBetween(begin, end)).to.be.true;
  });

  it('logs error message if any error occured while fetching orders', function() {
    Order.findWhere.restore();
    sinon.stub(Order, 'findWhere').returns($q(function(resolve, reject) {
      reject();
    }));

    vm.fetchOrders()
      .then(function() {
        expect($log.error).to.have.been.called;
      });

    resolvePromises();
  });

});