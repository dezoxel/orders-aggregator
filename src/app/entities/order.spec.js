describe('Order', function () {
  'use strict';

  beforeEach(module('sfba.entities'));

  var Order, order, Client;

  beforeEach(inject(function (_Order_, _Client_) {
    Order = _Order_;
    Client = _Client_;
  }));

  describe('is valid', function() {

    it('requires client instance', function() {
      order = new Order({
        client: new Client({
          firstName: 'Vasya',
          lastName: 'Pupkin'
        })
      });

      expect(order.client()).to.be.an.instanceOf(Client);
    });

    it('allows to specify order for specific week day', function() {
      order = new Order({
        client: new Client({
          firstName: 'Vasya',
          lastName: 'Pupkin',
        }),
        mon: 'big_no_salad',
        tue: 'big_no_meat',
        wed: 'big',
        thu: 'mid_no_meat',
        fri: 'mid_no_salad'
      });

      expect(order.dishsetForMon()).to.equal('Большая без салата');
      expect(order.dishsetForTue()).to.equal('Большая без мяса');
      expect(order.dishsetForWed()).to.equal('Большая');
      expect(order.dishsetForThu()).to.equal('Средняя без мяса');
      expect(order.dishsetForFri()).to.equal('Средняя без салата');
    });

    it('returns the empty ID', function() {
      expect(order.id()).to.be.null;
    });

    it('changes client', function() {
      order.setClient(new Client({
        firstName: 'Ivan',
        lastName: 'Ivanov'
      }));

      expect(order.client().fullName()).to.equal('Ivan Ivanov');
    });
  });

  describe('is not valid', function() {

    it('throws an exception if client is not specified', function() {
      expect(function() {
        order = new Order();
      }).to.throw('Order: constructor params is not valid');
    });
  });

});