Table = require 'cli-table'
moment = require 'moment'

class Report
  constructor: (db) ->
    @_db = db

  meat_for_week: (begin_date, end_date) ->
    table = new Table()
    tableHead = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    tableRow = [0, 0, 0, 0, 0]

    @_db.records_for_week_by_dish_type 'meat', begin_date, end_date
      .then (records) ->
        for record in records
          # look for match of day week to record's date
          i = tableHead.indexOf(moment(record.date).format('dddd')) - 1
          tableRow[i] = record.count

        table.options.head = tableHead
        table.push {'Meat': tableRow}

module.exports = Report
