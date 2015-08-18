describe('Payment', function() {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Payment;
  beforeEach(inject(function(_Payment_) {
    Payment = _Payment_;
  }));

  describe('#create', function() {
    context('given valid arguments', function() {
      beforeEach('create valid payment', function() {
        this.payment = new Payment({id: 5, timestamp: 123456789, amount: 250});
      });

      it('sets amount', function() {
        expect(this.payment.get('amount')).to.equal(250);
      });

      it('sets timestamp', function() {
        expect(this.payment.get('timestamp')).to.equal(123456789);
      });

      it('sets id', function() {
        expect(this.payment.get('id')).to.equal(5);
      });
    });

    context('given invalid arguments', function() {
      var specs = [
        {title: 'empty signature', args: null},
        {title: 'amount is not specified', args: {timestamp: 123456789}},
        {title: 'amount is not a number', args: {timestamp: 123456789, amount: 'hello'}},
        {title: 'timestamp is not specified', args: {amount: 100}},
        {title: 'timestamp is not number', args: {amount: 100, timestamp: 'hello'}}
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.title, function() {
          it('throws an exception', function() {
            expect(function() {
              new Payment(spec.args);
            }).to.throw(Error);
          });
        });
      });
    });
  });

  describe('.createCollectionFrom', function() {

    context('given valid arguments', function() {

      context('when not empty array specified', function() {
        beforeEach(function() {
          this.collection = Payment.createCollectionFrom([
            {timestamp: 123456789, amount: 500},
            {timestamp: 987654321, amount: 200}
          ]);
        });

        it('returns an array of Payment instances', function() {
          expect(this.collection).to.be.an('array').that.have.property(1).that.is.instanceOf(Payment);
        });
      });

      context('when empty array specified', function() {
        beforeEach(function() {
          this.collection = Payment.createCollectionFrom([]);
        });

        it('returns empty array', function() {
          expect(this.collection).to.be.an('array').that.have.length(0);
        });
      });
    });

    context('given invalid arguments', function() {

      function throwsAnException() {
        it('throws an exception', function() {
          var args = this.args;
          expect(function() {
            this.collection = Payment.createCollectionFrom(args);
          }).to.throw(Error);
        });
      }

      var specs = [
        {description: 'nothing', args: null},
        {description: 'not an array', args: {hello: 'world'}},
      ];

      specs.forEach(function(spec) {
        context('when ' + spec.description + ' specified', function() {
          beforeEach(function() {
            this.args = spec.args;
          });

          throwsAnException();
        });
      });
    });
  });
});