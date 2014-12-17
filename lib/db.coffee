Promise = require 'bluebird'
mysql = require 'mysql'

class DB
  constructor: (params) ->
    @_connection = mysql.createConnection params

  connect: ->
    new Promise (resolve, reject) =>
      @_connection.connect (err) ->
        if err
          reject err
        else
          resolve @_connection

  getConnection: ->
    @_connection

  setConnection: (connection) ->
    @_connection = connection
    @

  isConnected: ->
    @_connection.state is 'connected'

  closeConnection: ->
    @_connection.end()
    @

  records_for_week_by_dish_type: (dish_type, begin_date, end_date, {half} = {}) ->
    half ?= false
    sql = '
      SELECT
        date,
        COUNT(*) AS count,
        title
      FROM
        record r INNER JOIN
        dish d ON r.dish_id = d.id
      WHERE
        type = ? AND
        date >= ? AND
        date <= ? AND
        half = ?
      GROUP BY
        date
    '
    @_run_query sql, [dish_type, begin_date, end_date, half]

  _run_query: (sql, data) ->
    new Promise (resolve, reject) =>
      @_connection.query sql, data, (err, rows) =>
        if err
          reject err
        else
          resolve rows

module.exports = DB