describe('Order', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Order, Client, order, orderData;

  beforeEach(inject(function(_Order_, _Client_) {
    Order = _Order_;
    Client = _Client_;
  }));

  // TODO: Use Factory instead of Fixture
  beforeEach(function () {
    orderData = {
      client: {
        firstName: 'Vasya',
        lastName: 'Pupkin',
      },
      mon: 'big_no_salad',
      tue: 'big_no_meat',
      wed: 'big',
      thu: 'mid_no_meat',
      fri: 'mid_no_salad'
    };
  });

  describe('is valid', function() {

    beforeEach(function() {
      order = Order.createInstanceFrom(orderData);
    });

    it('requires client instance', function() {
      expect(order.client()).to.be.an.instanceOf(Client);
    });

    it('allows to specify order for specific week day', function() {
      expect(order.dishsetForMon()).to.equal('Большая без салата');
      expect(order.dishsetForTue()).to.equal('Большая без мяса');
      expect(order.dishsetForWed()).to.equal('Большая');
      expect(order.dishsetForThu()).to.equal('Средняя без мяса');
      expect(order.dishsetForFri()).to.equal('Средняя без салата');
    });

    it('returns the empty ID', function() {
      expect(order.id()).to.be.null;
    });

    it('changes client', function() {
      order.setClient(new Client({
        firstName: 'Ivan',
        lastName: 'Ivanov'
      }));

      expect(order.client().fullName()).to.equal('Ivan Ivanov');
    });
  });

  describe('is not valid', function() {

    it('throws an exception if client is not specified', function() {
      expect(function() {
        order = new Order();
      }).to.throw('Order: constructor params is not valid');
    });
  });

  describe('when fetching orders', function() {

    function resolvePromises() {
      $rootScope.$digest();
    }

    var $rootScope, $q, $log;
    var week, backend, order;

    beforeEach('reassign injected services', inject(function(_$rootScope_, _$q_, _$log_, _backend_) {
      $rootScope = _$rootScope_;
      $q = _$q_;
      $log = _$log_;
      backend = _backend_;
    }));

    beforeEach('create week instance', inject(function(Week, moment) {
      week = new Week({
        startDate: moment().startOf('isoWeek')
      });
    }));

    beforeEach('stub network activity', function() {
      sinon.stub(backend, 'get').returns($q(function(resolve) {
        resolve([orderData]);
      }));
    });

    afterEach('restore stubbed network activity', function() {
      backend.get.restore();
    });

    it('makes async request', function() {
      expect(Order.where(week).then).to.exist;
    });

    describe('when error occured', function() {

      beforeEach('stub network with returned error', function() {
        backend.get.restore();
        sinon.stub(backend, 'get').returns($q(function(resolve, reject) {
          reject('Some error');
        }));

        sinon.stub($log, 'error');
      });

      afterEach(function() {
        $log.error.restore();
      });

      it('logs the error', function() {
        Order.where(week)
          .then(function() {
            expect($log.error).to.have.been.called;
          });

        resolvePromises();
      });
    });

    describe('when ok', function() {

      describe('orders found', function() {

        it('returns an array', function() {
          expect(Order.where(week)).to.eventually.is.an('array');

          resolvePromises();
        });

        it('returns an array of Order instances', function() {
          order = Order.createInstanceFrom(orderData);

          expect(Order.where(week)).to.eventually.contain(order);

          resolvePromises();
        });
      });

      describe('orders not found', function() {

        beforeEach(function() {
          backend.get.restore();

          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve([]);
          }));
        });

        it('returns empty array', function() {
          expect(Order.where(week)).to.eventually.be.empty;

          resolvePromises();
        });
      });
    });
  });
});