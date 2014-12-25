fs = require 'fs'
Promise = require 'bluebird'
_ = require 'underscore'
yaml = require 'js-yaml'

current_menu_id_path = './data/current_menu_id'
file_encoding = 'utf8'
menu_template_path = './lib/reports/templates/menu_for_week.ejs'
report_path = '/Users/username/Dropbox/Public/menu_for_week.html'

get_current_menu_id = ->
  new Promise (resolve, reject) ->
    fs.readFile current_menu_id_path, file_encoding, (err, data) ->
      if err then reject err else resolve data

get_next_menu_id_by = (prev_menu_id) ->
  new Promise (resolve, reject) ->
    resolve(if prev_menu_id is 'first_week' then 'second_week' else 'first_week')

get_menu_data_for = (menu_id) ->
  menu_data_path = './data/menu/' + menu_id + '.yml'

  new Promise (resolve, reject) ->
    fs.readFile menu_data_path, file_encoding, (err, data) ->
      if err then reject err else resolve yaml.safeLoad data

render_menu_using = (menu_data) ->
  new Promise (resolve, reject) ->
    fs.readFile menu_template_path, file_encoding, (err, data) ->
      if err
        reject err
      else
        render = _.template(data)
        resolve(render {menu: menu_data})

save_to_permanent_file = (output) ->
  new Promise (resolve, reject) ->
    fs.writeFile report_path, output, (err) ->
      if err then reject err else resolve()

save_current_menu_id = (menu_id) ->
  new Promise (resolve, reject) ->
    fs.writeFile current_menu_id_path, menu_id, (err) ->
      if err then reject err else resolve menu_id

get_current_menu_id()
  .then (prev_menu_id) -> get_next_menu_id_by prev_menu_id
  .then (next_menu_id) -> save_current_menu_id next_menu_id
  .then (next_menu_id) -> get_menu_data_for next_menu_id
  .then (menu_data) -> render_menu_using menu_data
  .then (output) -> save_to_permanent_file output
  .then -> console.log 'Menu permanent file saved'
  .catch (err) -> throw err

