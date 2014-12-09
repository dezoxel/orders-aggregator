var Calculator = require('../lib/calculator');

describe('Calculator', function() {
  var calculator;

  beforeEach(function() {
    calculator = new Calculator();
  });

  it('calculates total for the specified preset name and target', function() {
    var target = {
      full: {
        mon: 5,
        tue: 6
      }
    };

    expect(calculator.calcTotalFor('full', target)).to.eql(11);
  });

  it('calculates totals hash for each target', function() {
    var targets = {
      office1: {
        full: {
          mon: 5,
          wed: 4
        }
      },
      office2: {
        half: {
          tue: 10
        }
      }
    };

    expect(calculator.calcTotalsFor(targets)).to.eql({
      office1: {
        full: 9
      },
      office2: {
        half: 10
      }
    });
  });

});