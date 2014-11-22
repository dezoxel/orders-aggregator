var _s = require('underscore.string');

function Doctor(db) {
  this.db = db;
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

  return self.db.connect().then(function() {
    // Doctor doesn't print anything in successful state, just closes connection

    self.db.getConnection().end();

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
  console.log(_s.capitalize(report.level) + ': ' + report.title);
  console.log(report.message);
};

module.exports = Doctor;
