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

        it('has first name', function() {
          expect(this.client.firstName()).to.equal('Vasya');
        });

        it('has last name', function() {
          expect(this.client.lastName()).to.equal('Pupkin');
        });

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
          this.client = new Client({firstName: 'Vasya', lastName: 'Pupkin'});
        });

        behavesLikeValidClient();
      });

      context('fist, last and full name specified', function() {
        beforeEach('create client', function() {
          this.client = new Client({firstName: 'Vasya', lastName: 'Pupkin', fullName: 'Ivan Ivanov'});
        });

        it('ignores full name', function() {
          expect(this.client.lastName()).to.equal('Pupkin');
        });
      });
    });

    context('given invalid arguments', function() {
      function throwsAnException() {
        it('throws an error', function() {
          var clientArgs = this.clientArgs;
          expect(function() {
            new Client(clientArgs);
          }).to.throw('Client: constructor params is not valid');
        });
      }

      var specs = [
        {description: 'when empty signature', args: null},
        {description: 'when empty params hash', args: {}},
        {description: 'when only first name specified', args: {firstName: 'Vasya'}},
        {description: 'when only last name specified', args: {lastName: 'Pupkin'}},
        {description: 'when empty full name specified', args: {fullName: ''}},
        {description: 'when only first name specified as the full name', args: {fullName: 'Vasya'}}
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
      this.client = new Client({firstName: 'Vasya', lastName: 'Pupkin', id: 123});
    });

    it('returns correct full name', function() {
      expect(this.client.fullName()).to.equal('Vasya Pupkin');
    });
  });

  describe('#firstName', function() {
    beforeEach('create client', function() {
      this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
    });

    it('returns correct first name', function() {
      expect(this.client.firstName()).to.equal('Vasya');
    });
  });

  describe('#lastName', function() {
    beforeEach('create client', function() {
      this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
    });

    it('returns correct last name', function() {
      expect(this.client.lastName()).to.equal('Pupkin');
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