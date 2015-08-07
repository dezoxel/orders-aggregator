describe('Company', function() {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Company;
  beforeEach('reassign injected services', inject(function (_Company_) {
    Company = _Company_;
  }));

  describe('#create', function() {

    context('given valid arguments', function() {

      function behavesLikeValidCompany() {
        it('has title', function() {
          expect(this.company.title()).to.equal('Cogniance');
        });

        it('has empty id', function() {
          expect(this.company.id()).to.be.empty;
        });
      }

      context('possible specify only title', function() {
        beforeEach('create company', function() {
          this.company = new Company('Cogniance');
        });

        behavesLikeValidCompany();
      });

      context('possible specify many arguments', function() {
        beforeEach('create company', function() {
          this.company = new Company({title: 'Cogniance', ignoredAttr: 'hello world'});
        });

        behavesLikeValidCompany();
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var companyArguments = this.companyArguments;
          expect(function() {
            new Company(companyArguments);
          }).to.throw('Company: constructor params is not valid');
        });
      }

      var specs = [
        {description: 'when empty signature', args: null},
        {description: 'when empty params hash', args: {}},
        {description: 'when title is not specified', args: {foo: 'bar', baz: 'boo'}}
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.companyArguments = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('.find', function() {

    function resolvePromises() {
      $rootScope.$digest();
    }

    var $q, $rootScope, $log, backend;
    beforeEach('reassign injected services', inject(function(_$q_, _$rootScope_, _$log_, _backend_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $log = _$log_;
      backend = _backend_;
    }));

    context('given valid arguments', function() {
      var companyData;
      beforeEach('valid company data', function() {
        companyData = {title: 'Cogniance', id: 123};
      });

      context('when found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve(companyData);
          }));
        });

        afterEach('restore stubbed network', function() {
          backend.get.restore();
        });

        it('returns Company instance', function() {
          Company.find(123)
            .then(function(company) {
              expect(company).to.be.an.instanceOf(Company);
            });

          resolvePromises();
        });

        it('makes request to /company/id resource', function() {
          Company.find(123)
            .then(function() {
              expect(backend.get).to.have.been.calledWith('/company/123');
            });

          resolvePromises();
        });
      });

      context('when not found', function() {

        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve, reject) {
            reject();
          }));
        });

        afterEach(function() {
          backend.get.restore();
        });

        beforeEach('stub $log service', function() {
          sinon.stub($log, 'error');
        });

        afterEach(function() {
          $log.error.restore();
        });

        it('rejects promise and logs the error', function() {
          Company.find(-1)
            .then(function() {
              expect($log.error).to.have.been.called;
            });

          resolvePromises();
        });
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var companyArguments = this.companyArguments;

          expect(function() {
            Company.find(companyArguments);
          }).to.throw('Company: non-number specified as an argument');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when array specified', args: [1,2,3]},
        {description: 'when object specified', args: {hello: 'world'}},
        {description: 'when NaN specified', args: NaN},
        {description: 'when Infinity specified', args: Infinity},
        {description: 'when any string specified', args: '$&#(*$&(#'}
      ];

      specs.forEach(function(spec) {
        context(spec.description, function() {
          beforeEach(function() {
            this.companyArguments = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('#title', function() {
    beforeEach('create company', function() {
      this.company = new Company('Cogniance');
    });

    it('has title', function() {
      expect(this.company.title()).to.equal('Cogniance');
    });
  });

  describe('#id', function() {

    context('when specified', function() {

      beforeEach('company with id', function() {
        this.company = new Company({title: 'Cogniance', id: 123});
      });

      it('returns correct ID', function() {
        expect(this.company.id()).to.equal(123);
      });
    });

    context('when not specified', function() {

      beforeEach('company without id', function() {
        this.company = new Company('Cogniance');
      });

      it('returns empty ID', function() {
        expect(this.company.id()).to.be.empty;
      });
    });
  });
});