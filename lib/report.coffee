Table = require 'cli-table'
moment = require 'moment'
_s = require 'underscore.string'

class Report

  constructor: (db) ->
    @_db = db

  records_for_week: (from_date, to_date) ->
    table = new Table head: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    @_db.records_for_week 'meat', from_date, to_date

      .then (records) =>
        table.push 'Meat': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'garnish', from_date, to_date
      .then (records) =>
        table.push 'Garnish': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'salad', from_date, to_date
      .then (records) =>
        table.push 'Salad': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'main', from_date, to_date
      .then (records) =>
        table.push 'Main': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'meat', from_date, to_date, half: true
      .then (records) =>
        table.push 'Meat/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'garnish', from_date, to_date, half: true
      .then (records) =>
        table.push 'Garnish/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'salad', from_date, to_date, half: true
      .then (records) =>
        table.push 'Salad/2': @_compose_values_for records, table.options.head

        return @_db.records_for_week 'main', from_date, to_date, half: true
      .then (records) =>
        table.push 'Main/2': @_compose_values_for records, table.options.head
      .then ->
        console.log 'Total recorded paying servings by dish type'
        return console.log table.toString()

  total_prime_cost: (from_date, to_date) ->
    table = new Table head: ['Dish type', 'Count'];

    @_db.total_prime_cost '2014-12-15', '2014-12-19', prime_cost: false

      .then (records) =>
        for record in records
          table.push [record.type, record.count]

        console.log 'Total paying servings'
        console.log table.toString()

  total_usual_price: (from_date, to_date) ->
    table = new Table head: ['Dish type', 'Count'];

    @_db.total_prime_cost '2014-12-15', '2014-12-19', prime_cost: true

      .then (records) =>
        for record in records
          table.push [record.type, record.count]

        console.log 'Total prime cost servings'
        console.log table.toString()

  _compose_values_for: (records, table_head) ->
    values = [0, 0, 0, 0, 0]

    for record in records
      # look for match of day week to record's date
      i = table_head.indexOf(moment(record.date).format('dddd')) - 1
      values[i] = record.count

    values



module.exports = Report
