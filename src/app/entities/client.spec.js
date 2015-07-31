describe('Client', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Client, client;

  beforeEach(inject(function (_Client_) {
    Client = _Client_;
  }));

  describe('when creating', function() {

    describe('is valid', function() {

      beforeEach(function() {
        client = new Client({
          firstName: 'Vasya',
          lastName: 'Pupkin'
        });
      });

      it('requires first name', function() {
        expect(client.firstName()).to.equal('Vasya');
      });

      it('requires last name', function() {
        expect(client.lastName()).to.equal('Pupkin');
      });

      it('returns the empty ID', function() {
        expect(client.id()).to.be.null;
      });
    });

    describe('is not valid', function() {

      it('throws an exception if first name is not specified', function() {

        expect(function() {

          client = new Client({
            lastName: 'Pupkin'
          });

        }).to.throw('Client: constructor params is not valid');
      });

      it('throws an exception if last name is not specified', function() {

        expect(function() {

          client = new Client({
            firstName: 'Vasya'
          });

        }).to.throw('Client: constructor params is not valid');
      });
    });

  });

  describe('when created', function() {

    beforeEach(function() {
      client = new Client({
        firstName: 'Vasya',
        lastName: 'Pupkin'
      });
    });

    it('returns full name', function() {
      expect(client.fullName()).to.equal('Vasya Pupkin');
    });

    it('returns first name', function() {
      expect(client.firstName()).to.equal('Vasya');
    });

    it('returns last name', function() {
      expect(client.lastName()).to.equal('Pupkin');
    });

  });

});