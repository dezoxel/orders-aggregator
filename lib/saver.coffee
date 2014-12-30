Promise = require 'bluebird'
fs = require 'fs'
path = require 'path'

class Saver
  constructor: (html) ->
    @html = html
    @report_path = '/Users/username/Dropbox/Public/recorded_clients_table.html'
  save: ->
    new Promise (resolve, reject) =>
      fs.writeFile @report_path, @html, (err) ->
        if err then reject err else resolve()

module.exports = Saver