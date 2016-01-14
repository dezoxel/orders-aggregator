Promise = require 'bluebird'
fs = require 'fs'
path = require 'path'

class Saver
  constructor: (html) ->
    @html = html
    @report_path = '/var/www/api.cogniance.lunches.com.ua/shared/recorded_clients_table.html'
  save: ->
    new Promise (resolve, reject) =>
      fs.writeFile @report_path, @html, (err) ->
        if err then reject err else resolve()

module.exports = Saver