Promise = require 'bluebird'
fs = require 'fs'
path = require 'path'

class Saver
  constructor: (html, report_path) ->
    @html = html
    @report_path = report_path
  save: ->
    new Promise (resolve, reject) =>
      console.log 'Saver: saving to:', @report_path
      fs.writeFile @report_path, @html, (err) ->
        if err then reject err else resolve()

module.exports = Saver