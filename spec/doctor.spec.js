var Doctor = require('../lib/doctor');

describe('Doctor', function () {
  var doctor;

  describe('when diagnosing DB', function() {
    var fakeDb = factory.buildSync('db');

    it('doesnt generate report if db connection established', function() {
      doctor = new Doctor(fakeDb);

      return doctor.diagnoseDbConnection().then(function() {
        expect(doctor.hasReportFor('dbConnection')).to.be.false;
      });
    });

    it('generates report if any connection error', function() {
      doctor = new Doctor(factory.buildSync('db', {state: 'not_connected'}));

      return doctor.diagnoseDbConnection().then(function() {
        expect(doctor.hasReportFor('dbConnection')).to.be.true;
      });

    });

    it('closes db connection if no error occurred');

  });

  describe('when giving diagnose', function() {

    it('diagnoses db connection');
  });

});