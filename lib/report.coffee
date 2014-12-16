Table = require 'cli-table'
moment = require 'moment'
_s = require 'underscore.string'

class Report

  constructor: (db) ->
    @_db = db

  records_for_week_by_dish_type: (from_date, to_date) ->
    table = new Table head: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    @_db.records_for_week_by_dish_type 'meat', from_date, to_date

      .then (records) =>
        table.push 'Meat': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'garnish', from_date, to_date
      .then (records) =>
        table.push 'Garnish': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'salad', from_date, to_date
      .then (records) =>
        table.push 'Salad': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'main', from_date, to_date
      .then (records) =>
        table.push 'Main': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'meat', from_date, to_date, half: true
      .then (records) =>
        table.push 'Meat/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'garnish', from_date, to_date, half: true
      .then (records) =>
        table.push 'Garnish/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'salad', from_date, to_date, half: true
      .then (records) =>
        table.push 'Salad/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week_by_dish_type 'main', from_date, to_date, half: true
      .then (records) =>
        table.push 'Main/2': @_compose_values_for records, table.options.head
      .then ->
        console.log table.toString()

  _compose_values_for: (records, table_head) ->
    values = [0, 0, 0, 0, 0]

    for record in records
      # look for match of day week to record's date
      i = table_head.indexOf(moment(record.date).format('dddd')) - 1
      values[i] = record.count

    values



module.exports = Report
