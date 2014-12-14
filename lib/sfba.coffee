argv = require('minimist')(process.argv.slice(2))
db = require './dbConfig'

doctor_give_diagnose = (argv) ->
  Doctor = require './doctor'
  doctor = new Doctor db, argv

  doctor.give_diagnose()

if argv.doctor
  doctor_give_diagnose argv
  return 0

Report = require './report'

report = new Report db

report.records_for_week_by_dish_type '2014-12-15', '2014-12-19'
