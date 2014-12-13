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

module.exports = DB