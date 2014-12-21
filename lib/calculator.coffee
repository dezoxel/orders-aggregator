Promise = require 'bluebird'

class Calculator
  preset_names: ['full', 'half', 'no_salad']
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  constructor: (db) ->
    @_db = db

  #
  # Example of data type:
  # records =
  #   meat:
  #     2014-12-15: 5
  #     2014-12-16: 8
  #     2014-12-17: 11
  #     2014-12-18: 3
  #     2014-12-19: 7
  #   salad:
  #     2014-12-15: 3
  #     ...
  #     2014-12-19: 8
  #   garnish:
  #     2014-12-15: 3
  #     ...
  #     2014-12-19: 8
  #
  # TODO: Handle reject promise
  records_for_week: (from_date, to_date) ->
    result = {}

    return new Promise (resolve, reject) =>

      @_db.records_for_week 'meat', from_date, to_date

        .then (records) =>
          result.meat = records
          return @_db.records_for_week 'garnish', from_date, to_date

        .then (records) =>
          result.garnish = records
          return @_db.records_for_week 'salad', from_date, to_date

        .then (records) =>
          result.salad = records
          return @_db.records_for_week 'main', from_date, to_date

        .then (records) =>
          result.main = records
          return @_db.records_for_week 'meat', from_date, to_date, half: true

        .then (records) =>
          result['meat/2'] = records
          return @_db.records_for_week 'garnish', from_date, to_date, half: true

        .then (records) =>
          result['garnish/2'] = records
          return @_db.records_for_week 'salad', from_date, to_date, half: true

        .then (records) =>
          result['salad/2'] = records
          return @_db.records_for_week 'main', from_date, to_date, half: true

        .then (records) =>
          result['main/2'] = records
        .then ->
          resolve result

  total_by_dish_type: (from_date, to_date, {prime_cost} = {}) ->
    prime_cost ?= false

    @_db.total_by_dish_type from_date, to_date, prime_cost: prime_cost

  week_total_for: (preset, target) ->
    total = 0

    week = target[preset]

    for weekday, count_servings of week
      continue if @weekdays.indexOf(weekday) == -1

      total += count_servings if count_servings

    return total

  totals_for: (targets) ->
    totals = {}

    for target, presets of targets
      @preset_names.forEach (preset) =>
        return false unless presets[preset]

        totals[target] = {} unless totals[target]
        totals[target][preset] = @week_total_for preset, presets

    return totals

  total_servings_from: (totals) ->
    total = 0

    for target, presets of totals
      for preset, total_per_preset of presets
        total += total_per_preset

    return total

module.exports = Calculator;