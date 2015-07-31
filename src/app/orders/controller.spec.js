describe('ListController', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  function fulfilledPromise(args) {
    return sinon.stub().returns($q(function(resolve) {
      resolve(args);
    }));
  }

  function rejectedPromise(entry) {
    return sinon.stub().returns($q(function(resolve, reject) {
      reject(entry);
    }));
  }

  beforeEach(module('sfba.orders'));

  var vm, Week, $rootScope, $q, $log;

  beforeEach(inject(function ($controller, _$rootScope_, _$q_, moment, _Week_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Week = _Week_;
    Week.prototype.fetchOrders = fulfilledPromise([1,2,3]);

    $log = {error: sinon.stub()};

    vm = $controller('OrdersController', {Week: Week, moment: moment, $log: $log});
  }));

  it('has empty orders list as initial state', function() {
    expect(vm.orders).to.be.empty;
  });

  it('fetches the orders', function(done) {
    vm.week.fetchOrders()
      .then(function() {
        expect(vm.orders).to.deep.equal([1,2,3]);
      })
      .then(done);

    resolvePromises();
  });

  it('uses current week when fetching orders', function() {
    var begin = vm.week.getStartDate();
    var end = vm.week.getEndDate().clone().add(1, 'day'); // because moment.isBetween() is exclusive

    expect(moment().isBetween(begin, end)).to.be.true;
  });

  it('logs error message if any error occured while fetching orders', function(done) {
    Week.prototype.fetchOrders = rejectedPromise();

    vm.fetchOrdersForCurrentWeek()
      .then(function() {
        expect($log.error).to.have.been.called;
      })
      .then(done);

    resolvePromises();
  });

});