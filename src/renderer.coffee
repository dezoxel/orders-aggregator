Promise = require 'bluebird'
fs = require 'fs'
path = require 'path'
_ = require 'lodash'

class Renderer

  constructor: (data) ->
    @data = data
    @template_path = path.resolve __dirname, './reports/templates/recorded_clients_table.ejs'
    @file_encoding = 'utf8'

  render: ->
    new Promise (resolve, reject) =>
      fs.readFile @template_path, @file_encoding, (err, tpl) =>
        if err
          reject err
        else
          render = _.template(tpl)
          resolve(render {data: @data, helpers: this})

module.exports = Renderer

