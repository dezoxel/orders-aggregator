var DB = require('../lib/db');
var mysql = require('mysql');

describe('DB', function () {
  var db;

  describe('when init', function() {

    it('creates connection object', function() {
      sinon.spy(mysql, 'createConnection');

      db = new DB({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sfba'
      });

      expect(mysql.createConnection).to.have.been.called;
    });
  });

  describe('when connect', function() {

    beforeEach(function() {
      db = new DB({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sfba'
      });
    });

    it('connects async and returns promise', function() {
      db.setConnection(factory.buildSync('connection'));

      expect(db.connect()).to.have.property('then');
    });

    it('successfully connects if no error occurred', function() {
      db.setConnection(factory.buildSync('connection'));

      return expect(db.connect()).to.be.fulfilled;
    });

    it('fails to connect if any error occured', function() {
      db.setConnection(factory.buildSync('connection', {state: 'disconnected'}));

      return expect(db.connect()).to.be.rejected;
    });

    it('returns error object if connection is failed', function() {
      db.setConnection(factory.buildSync('connection', {state: 'disconnected'}));

      return expect(db.connect()).to.eventually.be.rejectedWith(Error, 'Unable to connect');
    });

    it('requires to close the connection by user', function(done) {
      db.setConnection(factory.buildSync('connection'));

      return db.connect().finally(function() {
        setTimeout(function() {
          expect(db.isConnected()).to.be.true;
          done();
        }, 100);
      });
    });

  });

});