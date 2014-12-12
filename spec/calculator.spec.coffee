Calculator = require '../lib/calculator'

describe 'Calculator', ->
  calculator = null

  beforeEach ->
    calculator = new Calculator()

  describe 'when calc total for the specified preset name and target', ->

    it 'summarizes values by week days', ->
      target = full: {mon: 5, tue: 6}

      expect(calculator.weekTotalFor 'full', target).to.eql 11

    it 'ignores nonexistent weekdays from the input', ->
      target = half: {aaa: 5, bbb: 6}

      expect(calculator.weekTotalFor 'half', target).to.eql 0

    it 'summarizes only for the specified preset', ->
      target = half: {mon: 5, tue: 6}

      expect(calculator.weekTotalFor 'full', target).to.eql 0

  describe 'when calculate totals for each target', ->

  it 'calculates totals hash for each target', ->
    targets =
      office1:
        full: {mon: 5, wed: 4}
        half: {wed: 3}
      office2:
        half: {tue: 10}

    expect(calculator.totalsFor targets).to.eql office1: {full: 9, half: 3}, office2: {half: 10}
