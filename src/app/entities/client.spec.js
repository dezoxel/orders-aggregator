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
          expect(this.client.get('fullName')).to.equal('Vasya Pupkin');
        });

        it('has empty id', function() {
          expect(this.client.get('id')).to.be.empty;
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
          }).to.throw(Error);
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

  describe('set fullName', function() {
    beforeEach('create client', function() {
      this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
    });

    context('given valid arguments', function() {
      beforeEach('set full name', function() {
        this.client.set('fullName', 'Petro Petrovich');
      });

      it('returns correct full name', function() {
        expect(this.client.get('fullName')).to.equal('Petro Petrovich');
      });
    });

    context('given invalid arguments', function() {
      var specs = [
        {title: 'nothing', arg: null},
        {title: 'empty name', arg: ''},
        {title: 'less than 2 symbols', arg: 'M'},
        {title: 'more than 100 symbols', arg: new Array(100).join('a')},
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.title + ' specified', function() {
          it('throws an exception', function() {
            expect(function() {
              this.client.set('fullName', spec.arg);
            }).to.throw(Error);
          });
        });
      });
    });
  });

  describe('set id', function() {

    context('given valid arguments', function() {

      context('when ID specified', function() {
        beforeEach('valid client', function() {
          this.client = new Client({fullName: 'Vasya Pupkin', id: 123});
        });

        it('returns correct ID', function() {
          expect(this.client.get('id')).to.equal(123);
        });
      });

      context('when ID is not specified', function() {
        beforeEach('client without id', function() {
          this.client = new Client('Vasya Pupkin');
        });

        it('returns empty ID', function() {
          expect(this.client.get('id')).to.be.empty;
        });
      });
    });

    context('given invalid arguments', function() {
      var specs = [
        {title: 'zero', arg: 0},
        {title: 'not a number', arg: 'hello world'},
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.title + ' specified', function() {
          it('throws an exception', function() {
            expect(function() {
              this.client.set('id', spec.arg);
            }).to.throw(Error);
          });
        });
      });
    });
  });

  describe('.findOrCreateByFullName', function() {
    function resolvePromises() {
      $rootScope.$digest();
    }

    var $q, $rootScope, backend;
    beforeEach('reassign injected services', inject(function(_$q_, _$rootScope_, _backend_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      backend = _backend_;
    }));

    beforeEach(function() {
      this.fullName = 'Petro Petrovich';
    });

    context('given valid arguments', function() {
      context('when found', function() {
        beforeEach(function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve(Factory.buildSync('clientData', {fullName: 'Petro Petrovich'}));
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        it('makes request to "/clients/findOrCreate/fullName" API', function() {
          Client.findOrCreateByFullName(this.fullName)
            .then(function() {
              expect(backend.get).to.have.been.calledWith('/clients/findOrCreate/fullName/' + this.fullName);
            }.bind(this));

          resolvePromises();
        });

        it('returns client instance', function() {
          Client.findOrCreateByFullName(this.fullName)
            .then(function(client) {
              expect(client.get('fullName')).to.equal(this.fullName);
            }.bind(this));

          resolvePromises();
        });

        it('returns client containing ID', function() {
          Client.findOrCreateByFullName(this.fullName)
            .then(function(client) {
              expect(client.get('id')).to.exist;
            });

          resolvePromises();
        });
      });

      context('when not found', function() {
        var $log;
        beforeEach('reassign injected services', inject(function(_$log_) {
          $log = _$log_;
        }));

        beforeEach(function() {
          sinon.stub(backend, 'get').returns($q(function(resolve, reject) {
            reject();
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        beforeEach(function() {
          sinon.stub($log, 'error');
        });

        afterEach(function() {
          $log.error.restore();
        });

        it('logs the error', function() {
          Client.findOrCreateByFullName(this.fullName)
            .then(function() {
              // hack in order to cover case when client code doesn't return rejected promise by chain if failed
              expect(true).to.be.false;
            })
            .catch(function() {
              expect($log.error).to.have.been.called;
            });

          resolvePromises();
        });

        it('rejects promise', function() {
          var promise = Client.findOrCreateByFullName(this.fullName);
          resolvePromises();
          // TODO: This shit doesn't work at all, figure out why
          expect(promise).to.be.rejected;
        });
      });
    });

    context('given invalid arguments', function() {
      context('when nothing specified', function() {
        it('throws an exception', function() {
          expect(function() {
            Client.findOrCreateByFullName();
          }).to.throw(Error);
        });
      });
    });
  });
});