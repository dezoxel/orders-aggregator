function Calculator() {
}

Calculator.prototype.presetNames = ['full', 'half', 'noSalad'];
Calculator.prototype.weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

Calculator.prototype.weekTotalFor = function(presetName, target) {
  var total = 0;

  this.presetNames.forEach(function(presetName) {
    for(var weekday in target[presetName]) {
      if (this.weekdays.indexOf(weekday) === -1) {
        continue;
      }

      if (target[presetName][weekday]) {
        total += target[presetName][weekday];
      }
    }
  }, this);

  return total;
};

Calculator.prototype.calcTotalsFor = function(targets) {
  var totals = {};

  for(var targetName in targets) {
    this.presetNames.forEach(function(presetName) {
      if (!targets[targetName][presetName]) {
        return false;
      }

      if (!totals[targetName]) {
        totals[targetName] = {};
      }

      totals[targetName][presetName] = this.weekTotalFor(presetName, targets[targetName]);
    }, this);
  }

  return totals;
};

module.exports = Calculator;