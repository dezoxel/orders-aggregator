class Calculator
  preset_names: ['full', 'half', 'no_salad']
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

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

module.exports = Calculator;