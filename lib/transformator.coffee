moment = require 'moment'

class Transformator

  constructor: ->
    @person_col = '1'
    @floors = ['Floor 1', 'Floor 2', 'Floor 3']

    @result = {}
    @number_to_weekday =
      '2': 'ПН'
      '3': 'ВТ'
      '4': 'СР'
      '5': 'ЧТ'
      '6': 'ПТ'

    @start_records_row = 9

  _fetch_person_name_from: (row) ->
    if row[@person_col]
      row[@person_col].value
    else
      ''

# Return data format example:
# {
#   ПН: {
#     count: 13,
#     floors: {
#       Office1: {
#         count: 4,
#         dish_types: {
#           full: {
#             count: 5,
#             people: [
#               'Vanya',
#               'Peria',
#               'Dima'
#             ]
#           }
#         }
#       }
#     }
#   }
# }

  transformSheetsData: (data) ->
    floor = ''
    for row_number, row of data
      person_name = @_fetch_person_name_from row
      continue if row_number < @start_records_row
      continue unless person_name

      if person_name in @floors
        floor = person_name
        continue

      for day_number, one_day_record of row
        continue if day_number is @person_col

        weekday = @number_to_weekday[day_number]
        dish_type = @user_entry_to_dish_type one_day_record.value.trim()

        @_add_record_to_report weekday, floor, dish_type, person_name, one_day_record.value

    @result

  transform: (sheetsData, orders) ->
    @transformSheetsData sheetsData
    @transformDataFromLunchesApi orders

    @result

  transformDataFromLunchesApi: (orders) ->
    console.log 'Transformator: Start transforming...'
    orders.forEach (order) =>
      person_name = @_get_person_name_of order
      floor = @_get_floor_of order
      weekday = @_get_weekday_of order
      dish_type = @_get_dish_type_of order

      console.log 'Transformator: Add record: ' + order.id + ', ' + weekday + ', ' + floor + ', ' + @user_entry_to_dish_type(dish_type) + ' (' + dish_type + '), ' + person_name
      @_add_record_to_report weekday, floor, @user_entry_to_dish_type(dish_type), person_name, 'none'

  _get_dish_type_of: (order) ->
    dish_types = order.items.map (item) -> item.product.type

    dish_types.join('+') + '.' + order.items[0].size

  _get_weekday_of: (order) ->
    # +1 because I want to reuse @number_to_weekday that expects weekday numbering from 2
    @number_to_weekday[moment(order.shipmentDate).weekday() + 1]

  _get_person_name_of: (order) ->
    order.user.fullname

  _get_floor_of: (order) ->
    floor_number = @_fetch_floor_number_from order.address
    console.log 'Transformator: Unable to fetch floor from address: "' + order.address + '"' if !floor_number

    'Floor ' + floor_number

  _fetch_floor_number_from: (address) ->
    # 3 - index of floor part in address
    address.split(', ')[3]

  _increase_count_for: (dish_type, weekday, floor) ->
    @_init_result_data_structure(dish_type, weekday, floor)

    @result[weekday].count++
    @result[weekday].floors[floor].count++
    @result[weekday].floors[floor].dish_types[dish_type].count++

  _record_person: (name, dish_type, weekday, floor) ->
    @_init_result_data_structure(dish_type, weekday, floor)

    @result[weekday].floors[floor].dish_types[dish_type].people.push(name)

  _init_result_data_structure: (dish_type, weekday, floor) ->
    unless @result[weekday]
      @result[weekday] = count: 0, floors: {}

    unless @result[weekday].floors[floor]
      @result[weekday].floors[floor] = count: 0, dish_types: {}

    unless @result[weekday].floors[floor].dish_types[dish_type]
      @result[weekday].floors[floor].dish_types[dish_type] = count: 0, people: []

  _add_record_to_report: (weekday, floor, dish_type, person_name, raw_user_entry) ->
    if dish_type
      @_increase_count_for dish_type, weekday, floor
      @_record_person person_name, dish_type, weekday, floor
    else
      console.error 'Unrecognized user entry: >>>' + raw_user_entry + '<<<'
      console.error 'Floor: ' + floor
      console.error 'Weekday: ' + weekday
      console.error 'Person: ' + person_name

  user_entry_to_dish_type: (raw_user_entry) ->
    user_entry = raw_user_entry.toLowerCase()

    switch user_entry
      when 'x', 'х', 'целая', 'большая', 'meat+garnish+salad.big' # latin & cyrillic
        'Больших'
      when 'большая без мяса', 'garnish+salad.big'
        'Больших без мяса'
      when 'большая без салата', 'большая без салата', 'meat+garnish.big'
        'Больших без салата'
      when 'большая без гарнира', 'meat+salad.big'
        'Больших без гарнира'
      when 'салат', 'только салат', 'salad.big'
        'Большой салат'
      when 'salad.medium'
        'Средний салат'
      when 'мясо', 'только мясо', 'meat.big'
        'Большое мясо'
      when 'meat.medium'
        'Среднее мясо'
      when 'только гарнир', 'garnish.big'
        'Большой гарнир'
      when 'garnish.medium'
        'Средний гарнир'
      when '0.5', '0,5', 'средняя', 'meat+garnish+salad.medium'
        'Средних'
      when '0.5 без мяса', '0,5 без мяса', 'средняя без мяса', 'garnish+salad.medium'
        'Средних без мяса'
      when '0.5 без салата', ' 0.5 без салату', '0,5 без салата', ' 0,5 без салату', 'средняя без салата', 'meat+garnish.medium'
        'Средних без салата'
      when '0.5 без гарнира', '0,5 без гарнира', 'средняя без гарнира', 'meat+salad.medium'
        'Средних без гарнира'
      else
        false

module.exports = Transformator