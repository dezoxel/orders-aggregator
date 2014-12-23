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
Calculator = require './calculator'

calculator = new Calculator db
report = new Report calculator

report.records_for_week '2014-12-15', '2014-12-19'
  .then (table) ->
    console.log 'Total recorded paying servings by dish type'
    console.log table.toString()

    return report.total_prime_cost '2014-12-15', '2014-12-19'

  .then (table) ->
    console.log 'Total prime cost servings'
    console.log table.toString()

    return report.total_usual_cost '2014-12-15', '2014-12-19'

  .then (table) ->
    console.log 'Total usual cost servings'
    console.log table.toString()

