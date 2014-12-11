class Calculator
  presetNames: ['full', 'half', 'noSalad']
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  weekTotalFor: (preset, target) ->
    total = 0

    week = target[preset]

    for weekday, countServings of week
      continue if @weekdays.indexOf(weekday) == -1

      total += countServings if countServings

    return total

  calcTotalsFor: (targets) ->
    totals = {}

    for target, presets of targets
      @presetNames.forEach (preset) =>
        return false unless presets[preset]

        totals[target] = {} unless totals[target]
        totals[target][preset] = @weekTotalFor preset, presets

    return totals

module.exports = Calculator;