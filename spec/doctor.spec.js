var Doctor = require('../lib/doctor');

describe('Doctor', function () {
  var doctor, fakeDb;

  describe('when diagnosing DB', function() {

    beforeEach(function() {
      fakeDb = factory.buildSync('db');
      doctor = new Doctor(fakeDb);
    });

    it('doesnt generate report if db connection established', function() {
      return doctor.diagnoseDbConnection().finally(function() {
        expect(doctor.hasReportFor('dbConnection')).to.be.false;
      });
    });

    it('generates report if any connection error', function() {
      doctor = new Doctor(factory.buildSync('db', {state: 'disconnected'}));

      return doctor.diagnoseDbConnection().finally(function() {
        expect(doctor.hasReportFor('dbConnection')).to.be.true;
      });

    });

    it('closes db connection if no error occurred', function() {
      return doctor.diagnoseDbConnection().finally(function() {
        expect(doctor.getDB().isConnected()).to.be.false;
      });
    });

  });

  describe('when giving diagnose', function() {

    it('diagnoses db connection', function() {
      sinon.spy(doctor, 'diagnoseDbConnection');

      doctor.giveDiagnose();

      expect(doctor.diagnoseDbConnection).to.have.been.called;
    });
  });

});