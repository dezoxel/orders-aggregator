describe('Office', function() {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Office, Company, company;
  beforeEach('reassign injected services', inject(function (_Office_, _Company_) {
    Office = _Office_;
    Company = _Company_;
  }));

  beforeEach('create company', function() {
    company = new Company('Cogniance');
  });

  describe('#create', function() {

    context('given valid arguments', function() {

      beforeEach('create office', function() {
        this.office = new Office({company: company, title: 'Office 1', ignoredAttr: 'hello world'});
      });

      it('has title', function() {
        expect(this.office.title()).to.equal('Office 1');
      });

      it('has empty id', function() {
        expect(this.office.id()).to.be.empty;
      });

      it('sets company', function() {
        expect(this.office.company()).to.be.an.instanceOf(Company);
      });
    });

    context('given invalid arguments', function() {

      context('when empty signature', function() {

        it('throws an error', function() {
          expect(function() {
            new Office(null);
          }).to.throw('Office: constructor params is not valid');
        });
      });

      context('when empty params hash', function() {

        it('throws an error', function() {
          expect(function() {
            new Office({});
          }).to.throw('Office: constructor params is not valid');
        });
      });

      context('when title is not specified', function() {

        it('throws an error', function() {
          expect(function() {
            new Office({company: company});
          }).to.throw('Office: constructor params is not valid');
        });
      });

      context('when company is not specified', function() {

        it('throws an error', function() {
          expect(function() {
            new Office({title: 'Office Mega'});
          }).to.throw('Office: constructor params is not valid');
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
      var officeData;
      beforeEach('valid office data', function() {
        officeData = {
          company: {
            title: 'Cogniance'
          },
          title: 'Office 1',
          id: 123
        };
      });

      context('when found', function() {
        beforeEach('stub network activity', function() {
          sinon.stub(backend, 'get').returns($q(function(resolve) {
            resolve(officeData);
          }));
        });

        afterEach('restore stubbed network', function() {
          backend.get.restore();
        });

        it('returns Office instance', function() {
          Office.find(123)
            .then(function(office) {
              expect(office).to.be.an.instanceOf(Office);
            });

          resolvePromises();
        });

        it('makes request to /office/id resource', function() {
          Office.find(123)
            .then(function() {
              expect(backend.get).to.have.been.calledWith('/office/123');
            });

          resolvePromises();
        });

        it('office instance should have an ID', function() {
          Office.find(123)
            .then(function(office) {
              expect(office.id()).to.equal(123);
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
          Office.find(-1)
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
          var officeArgs = this.officeArgs;

          expect(function() {
            Office.find(officeArgs);
          }).to.throw('Office: non-number specified as an argument');
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
            this.officeArgs = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

  describe('#title', function() {
    beforeEach('create office', function() {
      this.office = new Office({title: 'Office 1', company: company});
    });

    it('has title', function() {
      expect(this.office.title()).to.equal('Office 1');
    });
  });

  describe('#id', function() {

    context('when specified', function() {

      beforeEach('office with id', function() {
        this.office = new Office({title: 'Office 1', id: 123, company: company});
      });

      it('returns correct ID', function() {
        expect(this.office.id()).to.equal(123);
      });
    });

    context('when not specified', function() {

      beforeEach('office without id', function() {
        this.office = new Office({title: 'Office 2', company: company});
      });

      it('returns empty ID', function() {
        expect(this.office.id()).to.be.empty;
      });
    });
  });

  describe('#setCompany', function() {
    beforeEach('create office', function() {
      this.office = new Office({
        company: company,
        title: 'Office 1'
      });
    });

    context('given valid arguments', function() {
      beforeEach(function() {
        this.office.setCompany(new Company('Cogniance'));
      });

      it('sets the new company instance', function() {
        expect(this.office.company().title()).to.equal('Cogniance');
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an error', function() {
          var companyArgs = this.companyArgs;
          var office = this.office;

          expect(function() {
            office.setCompany(companyArgs);
          }).to.throw('Order: invalid argument for setCompany');
        });
      }

      var specs = [
        {description: 'when nothing specified', args: null},
        {description: 'when hash specified instead of Company instance', args: {title: 'Cogniance'}},
        {description: 'when number specified', args: 123},
        {description: 'when string specified', args: 'Hello from Hack world'},
        {description: 'when array specified', args: [1,2,3]},
      ];

      specs.forEach(function(spec) {

        context(spec.description, function() {
          beforeEach(function() {
            this.companyArgs = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });

});