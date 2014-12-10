var Calculator = require('../lib/calculator');

describe('Calculator', function() {
  var calculator;

  beforeEach(function() {
    calculator = new Calculator();
  });

  describe('when calc total for the specified preset name and target', function() {

    it('summarizes values by week days', function() {
      var target = {
        full: {
          mon: 5,
          tue: 6
        }
      };

      expect(calculator.calcTotalFor('full', target)).to.eql(11);
    });

    it('ignores nonexistent weekdays from the input', function() {
      var target = {
        half: {
          aaa: 5,
          bbb: 6
        }
      };

      expect(calculator.calcTotalFor('half', target)).to.eql(0);
    });
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