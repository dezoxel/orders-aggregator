function Doctor(db) {
  this.db = db;
  this.report = {};
}

Doctor.prototype.diagnose = function() {
  this.diagnoseDb();
};

Doctor.prototype.diagnoseDb = function() {
  return this.db.connect().error(function(err) {
    this.report.db = {
      level: 'error',
      code: 1,
      message: '[DOCTOR] DB connection error: ' + err.message
    };
  }.bind(this));
};

Doctor.prototype.hasReportFor = function(problem) {
  return Boolean(this.report.db);
};

module.exports = Doctor;
