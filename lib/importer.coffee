GoogleSpreadsheets = require 'google-spreadsheets'
Promise = require 'bluebird'

class Importer
  constructor: (auth_client, worksheet, spreadsheetId) ->
    @auth_client = auth_client
    @spreadsheetId = spreadsheetId
    @range = 'R9C1:R500C6'
    @worksheet = worksheet

  import: ->
    new Promise (resolve, reject) =>

      console.log 'Importer: authorization...'
      @auth_client.authorize (err, tokens) =>
        return reject err if err

        console.log 'Importer: fetching data...'
        console.log 'Importer:   range:', @range
        console.log 'Importer:   spreadsheet:', @spreadsheetId
        console.log 'Importer:   worksheet:', @worksheet

        GoogleSpreadsheets.cells
          key: @spreadsheetId,
          worksheet: @worksheet,
          auth: @auth_client,
          range: @range,
          (err, spreadsheet) ->
            return reject err if err
            resolve spreadsheet.cells

module.exports = Importer