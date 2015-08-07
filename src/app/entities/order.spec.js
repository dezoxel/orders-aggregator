describe('Order', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Order, Client, order, orderData, anotherOrderData, client;

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

    anotherOrderData = {
      client: {
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      mon: 'mid_no_salad',
      tue: 'mid_no_meat',
      wed: 'mid',
      thu: 'big_no_meat',
      fri: 'big_no_salad'
    };
  });

  beforeEach(function() {
    client = new Client(orderData.client);
  });

  describe('#create', function() {

    context('given valid arguments', function() {
      beforeEach(function() {
        order = new Order(client, orderData);
      });

      it('sets Client dependency', function() {
        expect(order.client()).to.be.an.instanceOf(Client);
      });

      var specs = [
        {weekday: 'Mon', getter: 'dishsetForMon', expected: 'Большая без салата'},
        {weekday: 'Tue', getter: 'dishsetForTue', expected: 'Большая без мяса'},
        {weekday: 'Wed', getter: 'dishsetForWed', expected: 'Большая'},
        {weekday: 'Thu', getter: 'dishsetForThu', expected: 'Средняя без мяса'},
        {weekday: 'Fri', getter: 'dishsetForFri', expected: 'Средняя без салата'}
      ];

      specs.forEach(function(spec) {
        it('sets order for the ' + spec.weekday, function() {
          expect(order[spec.getter]()).to.equal(spec.expected);
        });
      });
    });

    context('given invalid arguments', function() {
      // try to do not deep inside, just use it :)
      function createOrderUsing(args) {
        var F = (Order.bind.apply(Order, args));
        return new F();
      }

      function throwsAnException() {
        it('throws an error', function() {
          var args = this.orderArgs;
          expect(function() {
            createOrderUsing(args);
          }).to.throw('Order: constructor params is not valid');
        });
      }

      var specs = [
        {description: 'when empty signature', args: null},
        {description: 'when empty params hash', args: [{}, client]},
        {description: 'when client is not specified', args: [{mon: 'big'}]}
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.orderArgs = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('#id', function() {

    context('when specified', function() {

      beforeEach('order with id', function() {
        this.order = new Order(client, {id: 123});
      });

      it('returns correct ID', function() {
        expect(this.order.id()).to.equal(123);
      });
    });

    context('when not specified', function() {

      beforeEach('order without id', function() {
        this.order = new Order(client, {});
      });

      it('returns empty ID', function() {
        expect(this.order.id()).to.be.empty;
      });
    });
  });

  describe('#setClient', function() {
    beforeEach(function() {
      this.order = new Order(client, {});
    });

    context('given valid arguments', function() {
      beforeEach(function() {
        this.order.setClient(new Client({
          firstName: 'Ivan',
          lastName: 'Ivanov'
        }));
      });

      it('sets the new client instance', function() {
        expect(this.order.client().fullName()).to.equal('Ivan Ivanov');
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var orderArgs = this.orderArgs;
          var order = this.order;

          expect(function() {
            order.setClient(orderArgs);
          }).to.throw('Order: invalid argument for setClient');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when hash specified instead of Client instance', args: {
          firstName: 'Ivan',
          lastName: 'Ivanov'
        }},
        {description: 'when number specified', args: 123},
        {description: 'when string specified', args: 'Hello from Hack world'},
        {description: 'when array specified', args: [1,2,3]},
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.orderArgs = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('.createCollectionFrom', function() {

    context('given valid arguments', function() {
      beforeEach(function() {
        this.collection = Order.createCollectionFrom([orderData, anotherOrderData]);
      });

      it('returns an array of Order instances', function() {
        expect(this.collection).to.be.an('array').that.have.property(0).that.is.instanceOf(Order);
      });
    });

    context('given invalid arguments', function() {
      function returnsEmptyArray() {
        it('returns empty array', function() {
          expect(this.collection).to.be.empty;
        });
      }

      var specs = [
        {description: 'nothing', args: null},
        {description: 'empty array', args: []},
        {description: 'object', args: {hello: 'world'}},
        {description: 'string', args: 'hello'},
        {description: 'number', args: 123},
        {description: 'boolean', args: true}
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.description + ' specified', function() {
          beforeEach(function() {
            this.collection = Order.createCollectionFrom(spec.args);
          });

          returnsEmptyArray();
        });
      });

      context('client is not specified in the data structure', function() {
        it('throws an error', function() {
          expect(function() {
            Order.createCollectionFrom([{}]);
          }).to.throw;
        });
      });
    });
  });

  describe('.where', function() {
    function resolvePromises() {
      $rootScope.$digest();
    }

    var $q, $rootScope, $log, backend;
    beforeEach('reassign injected services', inject(function(_$q_, _$rootScope_, _$log_, _backend_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $log = _$log_;
      backend = _backend_;
    }));

    var week;
    beforeEach('create week instance', inject(function(Week, moment) {
      week = new Week({
        startDate: moment().startOf('isoWeek')
      });
    }));

    context('given valid arguments', function() {

      context('when found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve([orderData, anotherOrderData]);
          }));
        });

        afterEach('restore stubbed network', function() {
          backend.get.restore();
        });

        it('returns an array of Order instances', function() {
          Order.where(week)
            .then(function(orders) {
              expect(orders).to.be.an('array').that.have.property(1).that.is.an.instanceOf(Order);
            });

          resolvePromises();
        });

        it('makes request to "/week/YYYY-MM-DD/orders" resource and use startDate', function() {
          Order.where(week)
            .then(function() {
              expect(backend.get).to.have.been.calledWith('/week/' + week.startDate().format('YYYY-MM-DD') + '/orders');
            });

          resolvePromises();
        });

      });

      context('when not found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve([]);
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        it('returns empty array', function() {
          Order.where(week)
            .then(function(orders) {
              expect(orders).to.be.an('array').that.have.length(0);
            });

          resolvePromises();
        });
      });

      context('when error occured', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve, reject) {
            reject();
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        beforeEach('stub $log service', function() {
          sinon.stub($log, 'error');
        });

        afterEach(function() {
          $log.error.restore();
        });

        it('rejects promise and logs the error', function() {
          Order.where(week)
            .then(function() {
              expect($log.error).to.have.been.called;
            });

          resolvePromises();
        });
      });
    });
  });
});