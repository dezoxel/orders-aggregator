var _s = require('underscore.string');

function Doctor(db) {
  this._db = db;
  this.report = {};
}

Doctor.prototype.giveDiagnose = function() {
  var self = this;

  self.diagnoseDbConnection().finally(function() {
    if (self.report.dbConnection) {
      self.printReport(self.report.dbConnection);
    }
  });
};

Doctor.prototype.diagnoseDbConnection = function() {
  var self = this;

  return self._db.connect().then(function() {
    self._db.closeConnection();
  }).error(function(err) {

    self.report.dbConnection = {
      level: 'error',
      code: 1,
      title: 'DB connection error',
      message: err.message
    };
  });
};

Doctor.prototype.hasReportFor = function(problem) {
  return Boolean(this.report[problem]);
};

Doctor.prototype.printReport = function(report) {
  console.log('');
  console.log(_s.capitalize(report.level) + ': ' + report.title);
  console.log(report.message);
};

Doctor.prototype.getDB = function() {
  return this._db;
};

module.exports = Doctor;
