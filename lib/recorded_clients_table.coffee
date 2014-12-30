Importer = require './importer'
auth_client = require './auth_client'
Transformator = require './transformator'
Renderer = require './renderer'
Saver = require './saver'

importer = new Importer auth_client

importer.import()
  .then (data) ->
    transformator = new Transformator()
    report_data = transformator.transform data
    renderer = new Renderer report_data
    return renderer.render()
  .then (html) ->
    saver = new Saver html
    return saver.save()
