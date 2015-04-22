import_orders = require '../../../lib/reports/order/import_orders'
GoogleSpreadsheets = require 'google-spreadsheets'

describe 'import_orders', ->

  config_params = {}

  beforeEach ->
    config_params =
      auth_client: {}
      spreadsheetId: '1SLqbhmzZn_6s8A2IccAF6jN5CGr0cQo0S1RRVaF1fnY'
      worksheet: 1
      range: 'R9C1:R54C6'

  describe 'when configure', ->

    it 'throws an exception if configuration was not executed', ->
      expect(-> import_orders()).to.throw Error

    it 'requires `auth_client` param to be specified', ->
      config_params.auth_client = null

      expect(-> import_orders.configure(config_params)).to.throw Error

    it 'requires `spreadsheetId` param to be specified', ->
      config_params.spreadsheetId = null

      expect(-> import_orders.configure(config_params)).to.throw(Error)

    it 'requires `worksheet` param to be specified', ->
      config_params.worksheet = null

      expect(-> import_orders.configure(config_params)).to.throw(Error)

    it 'requires `range` param to be specified', ->
      config_params.range = null

      expect(-> import_orders.configure(config_params)).to.throw(Error)

  describe '#import_orders', ->

    beforeEach ->
      import_orders.configure config_params

      sinon.stub(GoogleSpreadsheets, 'cells').yields null, {cells: [1,2,3]}

    afterEach ->
      GoogleSpreadsheets.cells.restore()

    it 'makes request to the google spreadsheets', ->
      import_orders()

      expect(GoogleSpreadsheets.cells).to.have.been.called

    it 'resolves promise if everything fine', ->
      expect(import_orders()).to.eventually.eql [1,2,3]

    describe 'when error', ->

      beforeEach ->
        GoogleSpreadsheets.cells.restore()
        sinon.stub(GoogleSpreadsheets, 'cells').yields 'Oh my Gosh!'

      it 'rejects promise', ->
        expect(import_orders()).to.eventually.be.rejectedWith 'Oh my Gosh!'
