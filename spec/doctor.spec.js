var Doctor = require('../lib/doctor');

describe('Doctor', function () {
  var doctor;

  describe('when diagnosing DB', function() {
    var fakeDb = factory.buildSync('db');

    it('doesnt generate report if db connection established', function() {
      doctor = new Doctor(fakeDb);

      return doctor.diagnoseDb().then(function() {
        expect(doctor.hasReportFor('db')).to.be.false;
      });
    });

    it('generates report if any connection error', function() {
      doctor = new Doctor(factory.buildSync('db', {state: 'not_connected'}));

      return doctor.diagnoseDb().then(function() {
        expect(doctor.hasReportFor('db')).to.be.true;
      });

    });

  });

});