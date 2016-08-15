rp = require 'request-promise'
moment = require 'moment'

SHORT_DATE_FORMAT = 'YYYY-MM-DD'

class LunchesApiImporter
  import: ->
    startDate = moment().startOf('week').format(SHORT_DATE_FORMAT);
    endDate = moment().endOf('week').format(SHORT_DATE_FORMAT);

    baseUrl = 'http://api.cogniance.lunches.com.ua'
    ordersUrl = baseUrl + '/orders?startDate=' + startDate + '&endDate=' + endDate
    menusUrl = baseUrl + '/menus?startDate=' + startDate + '&endDate=' + endDate

    console.log 'Importer: GET ' + ordersUrl
    console.log 'Importer: GET ' + menusUrl

    console.log 'Importer: startDate: ', startDate
    console.log 'Importer: endDate: ', endDate
    console.log ''

    Promise.all([
      rp({uri: ordersUrl, json: true}),
      rp({uri: menusUrl, json: true})
    ])
      .then (res) =>
        orders = res[0]
        menus = res[1]
        console.log 'Importer: website orders:    total', orders.length

        @split_to_regular_and_diet orders, menus

      .catch (err) ->
        console.log err

  split_to_regular_and_diet: (orders, menus) ->
    [regular_menu_product_ids, diet_menu_product_ids] = @compose_product_ids_by_menu_type menus

    regular_orders = []
    diet_orders = []

    orders.forEach (order) =>
      if @is_regular_order order, regular_menu_product_ids[order.shipmentDate]
        regular_orders.push order
      else
        diet_orders.push order

    console.log 'Importer: website orders: regular:', regular_orders.length
    console.log 'Importer: website orders:    diet:', diet_orders.length
    [regular_orders, diet_orders]

  is_regular_order: (order, regular_menu_product_ids) ->
    n = 0
    order.items.forEach (line_item) =>
      if regular_menu_product_ids.indexOf(line_item.product.id) != -1
        n = n + 1

    n == order.items.length;

  compose_product_ids_by_menu_type: (menus) ->
    regular_menu_product_ids = {}
    diet_menu_product_ids = {}

    menus.forEach (day_menu) =>
      if day_menu.type == 'regular'
        day_menu.products.forEach (product) =>
          regular_menu_product_ids[day_menu.date] = [] unless regular_menu_product_ids[day_menu.date]
          regular_menu_product_ids[day_menu.date].push(product.id)

      if day_menu.type == 'diet'
        day_menu.products.forEach (product) =>
          diet_menu_product_ids[day_menu.date] = [] unless diet_menu_product_ids[day_menu.date]
          diet_menu_product_ids[day_menu.date].push(product.id)

    [regular_menu_product_ids, diet_menu_product_ids]

module.exports = LunchesApiImporter