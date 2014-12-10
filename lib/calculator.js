function Calculator() {
}

Calculator.prototype.presetNames = ['full', 'half', 'noSalad'];

Calculator.prototype.calcTotalFor = function(presetName, target) {
  var total = 0;

  this.presetNames.forEach(function(presetName) {
    for(var weekday in target[presetName]) {
      if (target[presetName][weekday]) {
        total += target[presetName][weekday];
      }
    }
  });

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

      totals[targetName][presetName] = this.calcTotalFor(presetName, targets[targetName]);
    }, this);
  }

  return totals;
};

module.exports = Calculator;