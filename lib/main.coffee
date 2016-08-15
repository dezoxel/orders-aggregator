Promise = require 'bluebird'

Importer = require './importer'
LunchesApiImporter = require './lunches-api-importer'
auth_client = require './auth_client'
Transformator = require './transformator'
Renderer = require './renderer'
Saver = require './saver'

config = require './config'

lunchesApiImporter = new LunchesApiImporter

importerForRegularMenu = new Importer auth_client, config.worksheetNumberForRegularMenu, config.spreadsheetIdForRegularMenu
importerForDietMenu = new Importer auth_client, config.worksheetNumberForDietMenu, config.spreadsheetIdForDietMenu

Promise.all [importerForRegularMenu.import(), importerForDietMenu.import(), lunchesApiImporter.import()]
  .then (data) ->

    sheetsRegularOrders = data[0]
    sheetsDietOrders = data[1]

    lunchesRegularOrders = data[2][0]
    lunchesDietOrders = data[2][1]

    regularTransformator = new Transformator()
    dietTransformator = new Transformator()

    regularReportData = regularTransformator.transform sheetsRegularOrders, lunchesRegularOrders
    dietReportData = dietTransformator.transform sheetsDietOrders, lunchesDietOrders

    regularRenderer = new Renderer regularReportData
    dietRenderer = new Renderer dietReportData

    return Promise.all [regularRenderer.render(), dietRenderer.render()]
  .then (htmlData) ->
    regularHtml = htmlData[0]
    dietHtml = htmlData[1]

    regularSaver = new Saver regularHtml, config.reportPathForRegularMenu
    dietSaver = new Saver dietHtml, config.reportPathForDietMenu

    regularSaver.save()
    dietSaver.save()
