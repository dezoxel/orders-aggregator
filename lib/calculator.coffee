class Calculator
  presetNames: ['full', 'half', 'noSalad']
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  weekTotalFor: (presetName, target) ->
    total = 0

    for weekday of target[presetName]
      if @weekdays.indexOf(weekday) == -1
        continue

      if target[presetName][weekday]
        total += target[presetName][weekday]

    return total

  calcTotalsFor: (targets) ->
    totals = {}

    for targetName of targets
      @presetNames.forEach (presetName) ->
        unless targets[targetName][presetName]
          return false

        unless totals[targetName]
          totals[targetName] = {}

        totals[targetName][presetName] = this.weekTotalFor presetName, targets[targetName]
      , this

    return totals

module.exports = Calculator;