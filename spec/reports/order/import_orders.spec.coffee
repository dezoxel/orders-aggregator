import_orders = require '../../../lib/reports/order/import_orders'

describe 'import_orders', ->

  config_params = {}

  beforeEach ->
    config_params =
      auth_client: {}
      spreadsheetId: '1SLqbhmzZn_6s8A2IccAF6jN5CGr0cQo0S1RRVaF1fnY'
      worksheet: 1
      range: 'R9C1:R54C6'

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
