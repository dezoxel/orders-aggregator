GoogleSpreadsheets = require 'google-spreadsheets'
Promise = require 'bluebird'

configured = false
auth_client = null
spreadsheetId = null
worksheet = null
range = null

_is_valid = (params) ->
  params.auth_client && params.spreadsheetId &&
  params.worksheet && params.range

_fetch = ->
  new Promise (resolve, reject) =>
    GoogleSpreadsheets.cells(
      key: spreadsheetId,
      worksheet: worksheet,
      auth: auth_client,
      range: range,
      (err, spreadsheet) ->
        reject err if err
        resolve spreadsheet.cells
    )

import_orders = ->

  unless configured
    throw new Error '`import_orders` was not configured, please call `import_orders.configure() first`'

  _fetch()

import_orders.configure = (params) ->

  unless _is_valid(params)
    throw new Error 'One of the mandatory parameters is not specified'

  auth_client = params.auth_client
  spreadsheetId = params.spreadsheetId
  worksheet = params.worksheet
  range = params.range

  configured = true

import_orders.reset = ->
  configured = false
  auth_client = null
  spreadsheetId = null
  worksheet = null
  range = null


module.exports = import_orders