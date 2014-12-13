_s = require 'underscore.string'
_ = require 'underscore'
Promise = require 'bluebird'

class Doctor
  constructor: (db, argv) ->
    @_db = db
    @_argv = argv
    @reports = {}

  giveDiagnose: ->
    Promise.all @diagnoseDbConnection()
      .finally ->
        @printReport report for report in @reports when report

  diagnoseDbConnection: ->
    @_db.connect()
      .then( => @_db.closeConnection())
      .error (err) =>
        @reports.dbConnection =
          level: 'error'
          code: 1
          title: 'DB connection error'
          message: err.message

  hasReportFor: (problem) ->
    Boolean @reports[problem]

  printReport: (report) ->
    console.log ''
    console.log _s.capitalize report.level  + ': ' + report.title
    console.log report.message

  getDB: -> @_db

module.exports = Doctor
