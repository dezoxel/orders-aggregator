BaseReport = require './base'

class HtmlReport extends BaseReport
  constructor: ->
  menu_for_week: ->
    @test()

module.exports = HtmlReport