function Doctor(db) {
  this.db = db;
  this.report = {};
}

Doctor.prototype.giveDiagnose = function() {
  this.diagnoseDbConnection();
};

Doctor.prototype.diagnoseDbConnection = function() {
  return this.db.connect().error(function(err) {

    this.report.dbConnection = {
      level: 'error',
      code: 1,
      message: '[DOCTOR] DB connection error: ' + err.message
    };
  }.bind(this));
};

Doctor.prototype.hasReportFor = function(problem) {
  return Boolean(this.report[problem]);
};
};

module.exports = Doctor;
