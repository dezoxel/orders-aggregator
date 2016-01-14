GoogleSpreadsheets = require 'google-spreadsheets'
Promise = require 'bluebird'

class Importer
  constructor: (auth_client) ->
    @auth_client = auth_client
    @spreadsheetId = '1SLqbhmzZn_6s8A2IccAF6jN5CGr0cQo0S1RRVaF1fnY'
    @range = 'R9C1:R500C6'
    @worksheet = 1

  import: ->
    new Promise (resolve, reject) =>

      @auth_client.authorize (err, tokens) =>
        return reject err if err

        GoogleSpreadsheets.cells
          key: @spreadsheetId,
          worksheet: @worksheet,
          auth: @auth_client,
          range: @range,
          (err, spreadsheet) ->
            return reject err if err
            resolve spreadsheet.cells

module.exports = Importer