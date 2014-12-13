_s = require 'underscore.string'
Promise = require 'bluebird'

class Doctor
  constructor: (db, argv) ->
    @_db = db
    @_argv = argv
    @reports = {}

  give_diagnose: ->
    Promise.all @diagnose_db_connection()
      .finally ->
        @print_report report for report in @reports when report

  diagnose_db_connection: ->
    @_db.connect()
      .then( => @_db.closeConnection())
      .error (err) =>
        @reports.dbConnection =
          level: 'error'
          code: 1
          title: 'DB connection error'
          message: err.message

  has_report_for: (problem) ->
    Boolean @reports[problem]

  print_report: (report) ->
    console.log ''
    console.log _s.capitalize report.level  + ': ' + report.title
    console.log report.message

  getDB: -> @_db

module.exports = Doctor
