DB = require '../lib/db'
mysql = require 'mysql'

describe 'DB', ->
  db = null

  describe 'when init', ->

    it 'creates connection object', ->
      sinon.spy(mysql, 'createConnection')

      db = new DB
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sfba'

      expect(mysql.createConnection).to.have.been.called

  describe 'when connect', ->

    beforeEach ->
      db = new DB
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sfba'

    it 'connects async and returns promise', ->
      db.setConnection(factory.buildSync 'connection')

      expect(db.connect()).to.have.property 'then'

    it 'successfully connects if no error occurred', ->
      db.setConnection(factory.buildSync 'connection')

      expect(db.connect()).to.be.fulfilled

    it 'fails to connect if any error occured', ->
      db.setConnection(factory.buildSync 'connection', state: 'disconnected')

      expect(db.connect()).to.be.rejected

    it 'returns error object if connection is failed', ->
      db.setConnection(factory.buildSync 'connection', state: 'disconnected')

      expect(db.connect()).to.eventually.be.rejectedWith Error, 'Unable to connect'

    it 'requires to close the connection by user', (done) ->
      db.setConnection(factory.buildSync 'connection')

      db.connect().finally ->
        setTimeout ->
          expect(db.isConnected()).to.be.true
          done()
        , 100
