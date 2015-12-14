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

  transform: (data) ->
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

        if dish_type
          @_increase_count_for dish_type, weekday, floor
          @_record_person person_name, dish_type, weekday, floor
        else
          console.error 'Unrecognized user entry: >>>' + one_day_record.value + '<<<'
          console.error 'Floor: ' + floor
          console.error 'Weekday: ' + weekday
          console.error 'Person: ' + person_name


    @result

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

  user_entry_to_dish_type: (raw_user_entry) ->
    user_entry = raw_user_entry.toLowerCase()

    switch user_entry
      when 'x', 'х', 'целая', 'большая' # latin & cyrillic
        'Больших'
      when 'большая без мяса'
        'Больших без мяса'
      when 'большая без салата', 'большая без салата'
        'Больших без салата'
      when 'большая без гарнира'
        'Больших без гарнира'
      when 'салат', 'только салат'
        'Только салат'
      when 'мясо', 'только мясо'
        'Только мясо'
      when 'только гарнир'
        'Только гарнир'
      when '0.5', '0,5', 'средняя'
        'Средних'
      when '0.5 без мяса', '0,5 без мяса', 'средняя без мяса'
        'Средних без мяса'
      when '0.5 без салата', ' 0.5 без салату', '0,5 без салата', ' 0,5 без салату', 'средняя без салата'
        'Средних без салата'
      when '0.5 без гарнира', '0,5 без гарнира', 'средняя без гарнира'
        'Средних без гарнира'
      else
        false

module.exports = Transformator