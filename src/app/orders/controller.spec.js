describe('OrdersController', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  beforeEach(module('sfba.orders'));

  var $rootScope, $q, $controller, vm, Week, Office, Company, moment;
  beforeEach('reassign injected services', inject(function(_$rootScope_, _$q_, _$controller_, _Week_, _Office_, _Company_, _moment_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    $controller = _$controller_;
    Week = _Week_;
    Office = _Office_;
    moment = _moment_;
    Company = _Company_;
  }));

  var $log;
  beforeEach('stub $log', function() {
    $log = {error: sinon.stub()};
  });

  var office;
  beforeEach('create office', function() {
    office = new Office({
      id: 1,
      title: 'Office 1',
      company: new Company('Cogniance')
    });
  });

  describe('#init', function() {

    context('given valid arguments', function() {
      beforeEach('stub Office.findByCompany', function() {
        sinon.stub(Office, 'findByCompany').returns($q(function(resolve) {
          resolve([office]);
        }));
      });

      afterEach('unstub Office.findByCompany', function() {
        Office.findByCompany.restore();
      });

      beforeEach('create valid controller', function() {
        vm = $controller('OrdersController', {$log: $log, $q: $q, Week: Week, Office: Office, moment: moment, companyId: 1});
      });

      it('defines initial state', function() {
        sinon.stub(vm, 'defineInitialState');

        vm.init();
        expect(vm.defineInitialState).to.have.been.called;

        vm.defineInitialState.restore();
      });

      context('fetch list of offices', function() {
        context('when found', function() {

          it('calls findByCompany', function() {
            expect(Office.findByCompany).to.have.been.calledWith(1);
          });

          it('stores offices to controller property', function() {
            resolvePromises();

            expect(vm.offices).to.be.an('array').with.length(1).that.have.property(0).that.is.an.instanceOf(Office);
          });
        });

        context('when error occured', function() {
          beforeEach('restub Office.findByCompany', function() {
            Office.findByCompany.restore();
            sinon.stub(Office, 'findByCompany').returns($q(function(resolve, reject) {
              reject('Error');
            }));
          });

          it('logs the error', function() {
            // need to call it again, because restub was executed after controller created
            vm.init();

            resolvePromises();

            expect($log.error).to.have.been.called;
          });
        });
      });
    });

    context('given invalid arguments', function() {
      context('company ID is not number', function() {
        it('throws an exception', function() {
          expect(function() {
            vm = $controller('OrdersController', {$log: $log, $q: $q, Week: Week, Office: Office, moment: moment, companyId: 'hello'});
          }).to.throw(Error);
        });
      });
    });
  });

  describe('#defineInitialState', function() {
    beforeEach('create valid controller', function() {
      vm = $controller('OrdersController', {$log: $log, $q: $q, Week: Week, Office: Office, moment: moment, companyId: 1});
    });

    it('has empty offices list', function() {
      expect(vm.offices).to.be.empty;
    });

    it('creates the current week instance', function() {
      var begin = vm.week.startDate();
      var end = vm.week.endDate().clone().add(1, 'day'); // because moment.isBetween() is exclusive

      expect(moment().isBetween(begin, end)).to.be.true;
    });
  });
});