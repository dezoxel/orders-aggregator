describe('OrdersController', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  beforeEach(module('sfba.orders'));

  var $rootScope, $q, Week, Order, Client, Company;
  beforeEach('reassign injected services', inject(function (_$rootScope_, _$q_, _Week_, _Order_, _Client_, _Company_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Week = _Week_;
    Order = _Order_;
    Client = _Client_;
    Company = _Company_;
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

    it('has no company assigned', function() {
      expect(vm.company).to.be.null;
    });
  });

  var offices = [
    {method: 'fetchOrdersOffice1', title: 'office1', key: 'ordersOffice1'},
    {method: 'fetchOrdersOffice2', title: 'office2', key: 'ordersOffice2'}
  ];

  offices.forEach(function(office) {
    describe('#' + office.method , function() {
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

      it('calls Order.findWhere() for searching orders', function() {
        vm[office.method]()
          .then(function() {
            expect(Order.findWhere).to.have.been.called;
          });

        resolvePromises();
      });

      it('returns an array of order instances', function() {
        vm[office.method]()
          .then(function() {
            expect(vm[office.key]).to.be.an('array').that.have.property(0).that.is.an.instanceOf(Order);
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
          vm[office.method]()
            .then(function() {
              expect($log.error).to.have.been.called;
            });

          resolvePromises();
        });
      });
    });
  });

  describe('#fetchCompany', function() {
    var company;
    beforeEach('create company', function() {
      company = new Company('Cogniance');
    });

    beforeEach('stub company', function() {
      sinon.stub(Company, 'find').returns($q(function(resolve) {
        resolve(company);
      }));
    });

    afterEach('unstub company', function() {
      Company.find.restore();
    });

    it('returns an instance of Company', function() {
      vm.fetchCompany()
        .then(function() {
          expect(vm.company).to.be.an.instanceOf(Company);
        });

      resolvePromises();
    });

    context('when error occured', function() {

      beforeEach(function() {
        Company.find.restore();
        sinon.stub(Company, 'find').returns($q(function(resolve, reject) {
          reject();
        }));
      });

      it('logs error message if any error occured while fetching orders', function() {
        vm.fetchCompany()
          .then(function() {
            expect($log.error).to.have.been.called;
          });

        resolvePromises();
      });
    });
  });
});