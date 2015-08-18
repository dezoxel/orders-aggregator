function Payment() {}
function Order() {}
function Client() {}
function Week() {}
function Office() {}
function Company() {}

Factory.define('payment', Payment, {
  get: function() {
    return function(attr) {
      return this[attr];
    };
  },

  id: 5,
  amount: 250,
  timestamp: 123456789
});

Factory.define('paymentTwo', Payment, {
  get: function() {
    return function(attr) {
      return this[attr];
    };
  },

  id: 42,
  amount: 180,
  timestamp: 987654321
});

Factory.define('client', Client, {
  id: 56,
  fullName: 'Vasya Pupkin'
});

Factory.define('week', Week, {
  startDate: '2015-01-05',
  endDate: '2015-01-09'
});

Factory.define('company', Company, {
  id: 27,
  title: 'Cogniance'
});

Factory.define('office', Office, {
  id: 78,
  title: 'Office 1',
  company: Factory.buildSync('company')
});

Factory.define('orderNoPayments', Order, {
  client: Factory.buildSync('client'),
  week: Factory.buildSync('week'),
  office: Factory.buildSync('office'),
  payments: []
});
