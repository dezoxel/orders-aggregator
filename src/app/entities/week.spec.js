describe('Week', function () {
  'use strict';

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

});