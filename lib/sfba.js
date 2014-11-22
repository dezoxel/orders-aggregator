var argv = require('minimist')(process.argv.slice(2));
var db = require('./dbConfig');

function doctorGiveDiagnose() {
  var Doctor = require('./doctor');
  var doctor = new Doctor(db);

  doctor.giveDiagnose();
}

if (argv['doctor']) {
  doctorGiveDiagnose();

  return 0;
}
