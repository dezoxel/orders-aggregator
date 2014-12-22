Table = require 'cli-table'
moment = require 'moment'
_s = require 'underscore.string'
Promise = require 'bluebird'

class Report

  constructor: (calculator) ->
    @_calculator = calculator

  #
  # Example of data type:
  #
  #   records_by_dish_type = {
  #     meat: [{
  #       date: new Date()
  #       count: 5
  #       title: 'Куриный биток'
  #     }, {
  #       date: new Date()
  #       count: 7
  #       title: 'Свиной биток'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Котлета по-киевски'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Рыба, фаршированная порциями'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Мясо по-французски с ананасом'
  #     }],
  #
  #     salad: [{
  #       date: new Date()
  #       count: 5
  #       title: 'Салат из краснокочанной капусты'
  #     }, {
  #       date: new Date()
  #       count: 7
  #       title: 'Салат из свежей капусты со свежим огурцом'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Салат из соленых огурцов с репчатым луком'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Салат из квашеной капусты'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Салат из свежих огурцов и помидоров с ялтинским луком'
  #     }]
  #  }
  # TODO: Handle reject promise
  records_for_week: (from_date, to_date) ->
    new Promise (resolve, reject) =>

      table = new Table head: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

      @_calculator.records_for_week from_date, to_date

        .then (records_by_dish_type) =>

          for dish_type, records of records_by_dish_type
            row = {}
            row[dish_type] = @_compose_values_using records, table.options.head
            table.push row

        .then -> resolve table

  total_prime_cost: (from_date, to_date) ->
    @_total_by_dish_type from_date, to_date, prime_cost: true

  total_usual_cost: (from_date, to_date) ->
    @_total_by_dish_type from_date, to_date, prime_cost: false

  # TODO: Handle reject promise
  _total_by_dish_type: (from_date, to_date, {prime_cost} = {}) ->
    prime_cost ?= false

    new Promise (resolve, reject) =>
      table = new Table head: ['Dish type', 'Count'];

      @_calculator.total_by_dish_type from_date, to_date, prime_cost: prime_cost

        .then (records) =>
          for record in records
            table.push [record.type, record.count]

        .then -> resolve table

  #
  # Example of data type:
  #
  #   records = [{
  #       date: new Date()
  #       count: 5
  #       title: 'Куриный биток'
  #     }, {
  #       date: new Date()
  #       count: 7
  #       title: 'Свиной биток'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Котлета по-киевски'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Рыба, фаршированная порциями'
  #     }, {
  #       date: new Date()
  #       count: 15
  #       title: 'Мясо по-французски с ананасом'
  #     }
  #   ]
  _compose_values_using: (records, table_head) ->
    values = [0, 0, 0, 0, 0]

    for record in records
      # look for match of day week to record's date
      i = table_head.indexOf(moment(record.date).format('dddd')) - 1
      values[i] = record.count

    values

module.exports = Report
