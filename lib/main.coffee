Importer = require './importer'
auth_client = require './auth_client'
Transformator = require './transformator'
Renderer = require './renderer'
Saver = require './saver'

config = require './config'

importerForRegularMenu = new Importer auth_client, config.worksheetNumberForRegularMenu
importerForDietMenu = new Importer auth_client, config.worksheetNumberForDietMenu

importerForRegularMenu.import()
  .then (data) ->
    transformator = new Transformator()
    report_data = transformator.transform data
    renderer = new Renderer report_data
    return renderer.render()
  .then (html) ->
    saver = new Saver html, config.reportPathForRegularMenu
    return saver.save()

importerForDietMenu.import()
  .then (data) ->
    transformator = new Transformator()
    report_data = transformator.transform data
    renderer = new Renderer report_data
    return renderer.render()
  .then (html) ->
    saver = new Saver html, config.reportPathForDietMenu
    return saver.save()
