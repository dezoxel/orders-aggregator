describe('Week', function () {
  'use strict';

  function resolvePromises() {
    $rootScope.$digest();
  }

  beforeEach(module('sfba.entities'));

  var Week, week, startDate, $rootScope;

  beforeEach(inject(function (_Week_, _$rootScope_) {
    Week = _Week_;
    $rootScope = _$rootScope_;
  }));

  describe('is valid', function() {

    beforeEach(function() {
      startDate = moment().startOf('isoWeek');

      week = new Week({
        startDate: startDate
      });
    });

    describe('start date', function() {

      it('is instance of Moment class', function() {
        expect(moment.isMoment(week.startDate())).to.be.true;
      });

      it('is specified', function() {
        expect(week.startDate().format('YYYY-MM-DD')).to.equal(startDate.format('YYYY-MM-DD'));
      });

      it('is Monday', function() {
        var MONDAY = 1;

        expect(week.startDate().isoWeekday()).to.equal(MONDAY);
      });
    });

    it('sets week end date automatically to Sunday', function() {
      var SUNDAY = 7;

      expect(week.endDate().isoWeekday()).to.equal(SUNDAY);
    });

  });

  describe('is not valid', function() {

    describe('when create', function() {

      it('throws an exception if no arguments specified', function() {
        expect(function() {
          week = new Week();
        }).to.throw('Week: constructor params is not valid');
      });

      it('throws an exception if start date argument is not specified', function() {
        expect(function() {
          week = new Week({
            someSuperParam: 'Hello World!'
          });
        }).to.throw('Week: constructor params is not valid');
      });

      it('throws an exception if non-hashmap object specified', function() {
        expect(function() {
          week = new Week(1, 2, 3);
        }).to.throw('Week: constructor params is not valid');
      });
    });

    describe('start date', function() {

      beforeEach(function() {
        week = new Week({
          startDate: moment().startOf('isoWeek')
        });
      });

      it('throws an exception if date is not a Moment instance', function() {
        expect(function() {
          week.setStartDate('2015-05-23');
        }).to.throw('Week: Specified week start date is not a Moment instance!');
      });

      it('throws an exception if date is not a Monday', function() {
        expect(function() {
          week.setStartDate(moment().endOf('isoWeek'));
        }).to.throw('Week: Specified week start date is not a Monday!');
      });
    });

  });

  describe('when fetching orders', function() {

    var sampleOrdersList;
    beforeEach(inject(function(_sampleOrdersList_) {
      sampleOrdersList = _sampleOrdersList_;

      week = new Week({
        startDate: moment().startOf('isoWeek')
      });
    }));

    it('makes async request', function() {
      expect(week.fetchOrders().then).to.exist;
    });

    it('reject promise if any error occured');

    describe('when ok', function() {

      it('returns an array', function() {
        expect(week.fetchOrders()).to.eventually.is.an('array');

        resolvePromises();
      });

      it('returns an array of Order instances', function() {
        var order = sampleOrdersList[0];

        expect(week.fetchOrders()).to.eventually.contain(order);

        resolvePromises();
      });

      it('returns empty array if no instances found');

      it('caches response', function(done) {
        week.fetchOrders()
          .then(function() {
            expect(week.orders()).to.deep.equal(sampleOrdersList);
          })
          .then(done);

        resolvePromises();
      });
    });

  });
});