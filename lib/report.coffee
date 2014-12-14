Table = require 'cli-table'
moment = require 'moment'
_s = require 'underscore.string'

class Report

  constructor: (db) ->
    @_db = db

  records_for_week_by_dish_type: (dish_type, begin_date, end_date) ->
    table = new Table()
    table_head = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    table_row = {}
    table_row_values = [0, 0, 0, 0, 0]

    @_db.records_for_week_by_dish_type dish_type, begin_date, end_date
      .then (records) ->
        for record in records
          # look for match of day week to record's date
          i = table_head.indexOf(moment(record.date).format('dddd')) - 1
          table_row_values[i] = record.count

        table.options.head = table_head
        table_row[_s.capitalize dish_type] = table_row_values
        table.push table_row

        console.log table.toString()


module.exports = Report
