describe('Client', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Client;

  beforeEach(inject(function (_Client_) {
    Client = _Client_;
  }));

  describe('#create', function() {

    context('given valid arguments', function() {

      function behavesLikeValidClient() {

        it('has full name', function() {
          expect(this.client.fullName()).to.equal('Vasya Pupkin');
        });

        it('has empty id', function() {
          expect(this.client.id()).to.be.empty;
        });
      }

      context('possible specify only fullName', function() {
        beforeEach('create client', function() {
          this.client = new Client('Vasya Pupkin');
        });

        behavesLikeValidClient();
      });

      context('possible specify many arguments', function() {
        beforeEach('create client', function() {
          this.client = new Client({fullName: 'Vasya Pupkin', ignoredAttr: 30});
        });

        behavesLikeValidClient();
      });
    });

    context('given invalid arguments', function() {
      function throwsAnException() {
        it('throws an exception', function() {
          var clientArgs = this.clientArgs;
          expect(function() {
            new Client(clientArgs);
          }).to.throw('Client: constructor params is not valid');
        });
      }

      var specs = [
        {description: 'when empty signature', args: null},
        {description: 'when empty params hash', args: {}},
        {description: 'when empty full name specified', args: {fullName: ''}}
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.clientArgs = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('#fullName', function() {
    beforeEach('create client', function() {
      this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
    });

    it('returns correct full name', function() {
      expect(this.client.fullName()).to.equal('Vasya Pupkin');
    });
  });

  describe('#id', function() {

    context('when specified', function() {

      beforeEach('client with id', function() {
        this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
      });

      it('returns correct ID', function() {
        expect(this.client.id()).to.equal(123);
      });
    });

    context('when not specified', function() {

      beforeEach('client without id', function() {
        this.client = new Client('Vasya Pupkin');
      });

      it('returns empty ID', function() {
        expect(this.client.id()).to.be.empty;
      });
    });
  });
});