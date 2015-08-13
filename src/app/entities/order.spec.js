describe('Order', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Order, Client, Week, Office;
  var order, client, week, office;
  var orderData, anotherOrderData, officeData, weekData;

  beforeEach(inject(function(_Order_, _Client_, _Week_, _Office_) {
    Order = _Order_;
    Client = _Client_;
    Week = _Week_;
    Office = _Office_;
  }));

  // TODO: Use Factory instead of Fixture
  beforeEach(function () {

    orderData = {
      client: {
        firstName: 'Vasya',
        lastName: 'Pupkin',
      },
      dishSet: {
        mon: 'big_no_salad',
        tue: 'big_no_meat',
        wed: 'big',
        thu: 'mid_no_meat',
        fri: 'mid_no_salad'
      }
    };

    anotherOrderData = {
      client: {
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      dishSet: {
        mon: 'mid_no_salad',
        tue: 'mid_no_meat',
        wed: 'mid',
        thu: 'big_no_meat',
        fri: 'big_no_salad'
      }
    };
  });

  beforeEach(function() {
    officeData = {
      id: 123,
      title: 'Office 1',
      company: {
        title: 'Cogniance'
      }
    };
  });

  beforeEach(function() {
    weekData = {startDate: '2015-01-05'};
  });

  beforeEach('create client', function() {
    client = new Client(orderData.client);
  });

  beforeEach('create week', inject(function(moment) {
    week = new Week({
      startDate: moment(weekData.startDate, 'YYYY-MM-DD')
    });
  }));

  beforeEach('create offce', inject(function(Company) {
    office = new Office({
      id: officeData.id,
      title: officeData.title,
      company: new Company(officeData.company.title)
    });
  }));

  describe('#create', function() {

    context('given valid arguments', function() {
      beforeEach('create order', function() {
        var orderParams = orderData;
        orderParams.client = client;
        orderParams.week = week;
        orderParams.office = office;
        order = new Order(orderParams);
      });

      it('sets Client dependency', function() {
        expect(order.client()).to.be.an.instanceOf(Client);
      });

      it('sets Week dependency', function() {
        expect(order.week()).to.be.an.instanceOf(Week);
      });

      it('sets Office dependency', function() {
        expect(order.office()).to.be.an.instanceOf(Office);
      });

      var specs = [
        {weekday: 'mon', expected: 'Big, no salad'},
        {weekday: 'tue', expected: 'Big, no meat'},
        {weekday: 'wed', expected: 'Big'},
        {weekday: 'thu', expected: 'Medium, no meat'},
        {weekday: 'fri', expected: 'Medium, no salad'},
      ];

      specs.forEach(function(spec) {
        it('sets order for the ' + spec.weekday, function() {
          expect(order.dishsetFor(spec.weekday)).to.equal(spec.expected);
        });
      });
    });

    context('given invalid arguments', function() {
      context('when empty signature', function() {
        it('throws an error', function() {
          expect(function() {
            new Order();
          }).to.throw('Order: constructor params is not valid');
        });
      });

      context('when client is not specified', function() {
        it('throws an error', function() {
          expect(function() {
            new Order({week: week, office: office});
          }).to.throw('Order: constructor params is not valid');
        });
      });

      context('when week is not specified', function() {
        it('throws an error', function() {
          expect(function() {
            new Order({client: client, office: office});
          }).to.throw('Order: constructor params is not valid');
        });
      });

      context('when office is not specified', function() {
        it('throws an error', function() {
          expect(function() {
            new Order({week: week, client: client});
          }).to.throw('Order: constructor params is not valid');
        });
      });
    });
  });

  describe('#id', function() {

    context('when specified', function() {

      beforeEach('order with id', function() {
        this.order = new Order({id: 123, client: client, week: week, office: office});
      });

      it('returns correct ID', function() {
        expect(this.order.id()).to.equal(123);
      });
    });

    context('when not specified', function() {

      beforeEach('order without id', function() {
        this.order = new Order({client: client, week: week, office: office});
      });

      it('returns empty ID', function() {
        expect(this.order.id()).to.be.empty;
      });
    });
  });

  describe('#setClient', function() {
    beforeEach('create new order', function() {
      this.order = new Order({client: client, week: week, office: office});
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

  describe('#setWeek', function() {
    beforeEach(function() {
      this.order = new Order({client: client, week: week, office: office});
    });

    context('given valid arguments', function() {
      beforeEach(inject(function(moment) {
        this.order.setWeek(new Week({startDate: moment('2015-01-12', 'YYYY-MM-DD')}));
      }));

      it('sets the new week instance', function() {
        expect(this.order.week().startDate().format('YYYY-MM-DD')).to.equal('2015-01-12');
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var orderArgs = this.orderArgs;
          var order = this.order;

          expect(function() {
            order.setWeek(orderArgs);
          }).to.throw('Order: invalid argument for setWeek');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when hash specified instead of Week instance', args: {startDate: '2015-05-12'}},
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

  describe('#setOffice', function() {
    beforeEach('create new order', function() {
      this.order = new Order({client: client, week: week, office: office});
    });

    context('given valid arguments', function() {
      beforeEach(inject(function(Company) {
        this.order.setOffice(new Office({
          title: 'Office 2',
          company: new Company('Google')
        }));
      }));

      it('sets the new office instance', function() {
        expect(this.order.office().title()).to.equal('Office 2');
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var orderArgs = this.orderArgs;
          var order = this.order;

          expect(function() {
            order.setOffice(orderArgs);
          }).to.throw('Order: invalid argument for setOffice');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when hash specified instead of Office instance', args: {title: 'Office 1'}},
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

  describe('#setDishsetFor', function() {
    beforeEach('create new order', function() {
      this.order = new Order({client: client, week: week, office: office});
    });

    context('given valid arguments', function() {
      beforeEach(function() {
        this.order.setDishsetFor('thu', 'big_no_meat');
      });

      it('sets the new desired dishset for the specified week day', function() {
        expect(this.order.dishsetFor('thu')).to.equal('Big, no meat');
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var orderArgs = this.orderArgs;
          var order = this.order;

          expect(function() {
            order.setDishsetFor('tue', orderArgs);
          }).to.throw('Order: invalid argument for setDishsetFor');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when hash specified instead of Office instance', args: {title: 'Office 1'}},
        {description: 'when number specified', args: 123},
        {description: 'when array specified', args: [1,2,3]},
        {description: 'when non existing dishset specified', args: 'super_big'},
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.orderArgs = spec.args;
          });

          throwsAnException();
        });
      });

      context('when non existing weekday specified', function() {
        it('throws an error', function() {
          expect(function() {
            order.setDishsetFor('tuesday', 'big');
          }).to.throw('Order: invalid argument for setDishsetFor');
        });
      });
    });
  });

  describe('.createCollectionFrom', function() {

    context('given valid arguments', function() {
      beforeEach(function() {
        this.collection = Order.createCollectionFrom({
          office: officeData,
          week: weekData,
          list: [orderData, anotherOrderData]
        });
      });

      it('returns an array of Order instances', function() {
        expect(this.collection).to.be.an('array').that.have.property(0).that.is.instanceOf(Order);
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var args = this.args;
          expect(function() {
            this.collection = Order.createCollectionFrom(args);
          }).to.throw('Order: invalid orders data format specified');
        });
      }

      var specs = [
        {description: 'nothing', args: null},
        {description: 'array', args: [1, 2, 3]},
        {description: 'string', args: 'hello'},
        {description: 'number', args: 123},
        {description: 'boolean', args: true}
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.description + ' specified', function() {
          beforeEach(function() {
            this.args = spec.args;
          });

          throwsAnException();
        });
      });

      context('client is not specified in the data structure', function() {
        it('throws an error', function() {
          expect(function() {
            Order.createCollectionFrom({office: officeData, week: weekData, list: [{}]});
          }).to.throw('Client: constructor params is not valid');
        });
      });

      context('office is not specified in the data structure', function() {
        it('throws an error', function() {
          expect(function() {
            Order.createCollectionFrom({week: weekData, list: [{client: orderData.client}]});
          }).to.throw('Order: invalid orders data format specified');
        });
      });

      context('week is not specified in the data structure', function() {
        it('throws an error', function() {
          expect(function() {
            Order.createCollectionFrom({office: officeData, list: [{client: orderData.client}]});
          }).to.throw('Order: invalid orders data format specified');
        });
      });

    });
  });

  describe('.findWhere', function() {
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

    context('given valid arguments', function() {

      context('when found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve({
              office: officeData,
              week: weekData,
              list: [orderData, anotherOrderData]
            });
          }));
        });

        afterEach('restore stubbed network', function() {
          backend.get.restore();
        });

        it('returns an array of Order instances', function() {
          Order.findWhere(office, week)
            .then(function(orders) {
              expect(orders).to.be.an('array').that.have.property(1).that.is.an.instanceOf(Order);
            });

          resolvePromises();
        });

        it('makes request to correct url', function() {
          Order.findWhere(office, week)
            .then(function() {
              var ordersUrl = '/office/123/week/2015-01-05/orders';
              expect(backend.get).to.have.been.calledWith(ordersUrl);
            });

          resolvePromises();
        });

      });

      context('when not found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve({
              office: officeData,
              week: weekData,
              list: []
            });
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        it('returns empty array', function() {
          Order.findWhere(office, week)
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
          Order.findWhere(office, week)
            .then(function() {
              expect($log.error).to.have.been.called;
            });

          resolvePromises();
        });
      });
    });

    context('given invalid arguments', function() {
      context('when arguments are not specified', function() {
        it('throws an error', function() {
          expect(function() {
            Order.findWhere();
          }).to.throw('Order: invalid arguments for findWhere');
        });
      });

      context('when week is not specified', function() {
        it('throws an error', function() {
          expect(function() {
            Order.findWhere(office);
          }).to.throw('Order: invalid arguments for findWhere');
        });
      });

      context('when office is not specified', function() {
        it('throws an error', function() {
          expect(function() {
            Order.findWhere(null, week);
          }).to.throw('Order: invalid arguments for findWhere');
        });
      });

      context('when office is not an instance of Office', function() {
        it('throws an error', function() {
          expect(function() {
            Order.findWhere(function() {}, week);
          }).to.throw('Order: invalid arguments for findWhere');
        });
      });

      context('when week is not an instance of Week', function() {
        it('throws an error', function() {
          expect(function() {
            Order.findWhere(office, function() {});
          }).to.throw('Order: invalid arguments for findWhere');
        });
      });
    });
  });
});