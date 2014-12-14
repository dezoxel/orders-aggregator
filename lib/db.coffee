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


  records_for_week_by_dish_type: (dish_type, begin_date, end_date) ->
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
        half = 0
      GROUP BY
        date
  '
    new Promise (resolve, reject) =>

      @_connection.query sql, [dish_type, begin_date, end_date], (err, rows) =>
        @closeConnection()
        if err
          reject err
        else
          resolve rows
        resolve err, rows

module.exports = DB