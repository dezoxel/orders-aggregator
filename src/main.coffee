Promise = require 'bluebird'

Importer = require './importer'
# LunchesApiImporter = require './lunches-api-importer'
auth_client = require './auth_client'
Transformator = require './transformator'
Renderer = require './renderer'
Saver = require './saver'

config = require './config'

# lunchesApiImporter = new LunchesApiImporter

importerForRegularMenu = new Importer auth_client, config.worksheetNumberForRegularMenu, config.spreadsheetIdForRegularMenu
importerForDietMenu = new Importer auth_client, config.worksheetNumberForDietMenu, config.spreadsheetIdForDietMenu
importerForVeganMenu = new Importer auth_client, config.worksheetNumberForVeganMenu, config.spreadsheetIdForVeganMenu, config.rangeForVeganMenu

Promise.all [
    importerForRegularMenu.import(),
    importerForDietMenu.import(),
    importerForVeganMenu.import()
    # lunchesApiImporter.import()
]
  .then (data) ->

    sheetsRegularOrders = data[0]
    sheetsDietOrders = data[1]
    sheetsVeganOrders = data[2]

    # lunchesRegularOrders = data[2][0]
    # lunchesDietOrders = data[2][1]
    # lunchesVeganOrders = data[2][2]
    # todo: add lunches api support back
    lunchesRegularOrders = []
    lunchesDietOrders = []
    lunchesVeganOrders = []

    regularTransformator = new Transformator()
    dietTransformator = new Transformator()
    veganTransformator = new Transformator()

    regularReportData = regularTransformator.transform sheetsRegularOrders, lunchesRegularOrders
    dietReportData = dietTransformator.transform sheetsDietOrders, lunchesDietOrders
    veganReportData = veganTransformator.transform sheetsVeganOrders, lunchesVeganOrders, true

    regularRenderer = new Renderer regularReportData
    dietRenderer = new Renderer dietReportData
    veganRenderer = new Renderer veganReportData

    return Promise.all [
        regularRenderer.render(),
        dietRenderer.render()
        veganRenderer.render()
    ]
  .then (htmlData) ->
    regularHtml = htmlData[0]
    dietHtml = htmlData[1]
    veganHtml = htmlData[2]

    regularSaver = new Saver regularHtml, config.reportPathForRegularMenu
    dietSaver = new Saver dietHtml, config.reportPathForDietMenu
    veganSaver = new Saver veganHtml, config.reportPathForVeganMenu

    regularSaver.save()
    dietSaver.save()
    veganSaver.save()
