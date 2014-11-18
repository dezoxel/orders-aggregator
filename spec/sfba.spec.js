var TestClass = require('../lib/sfba');

describe('TestClass', function () {
  var testObj;

  it('says hello to specified name', function () {
    testObj = new TestClass();

    expect(testObj.sayHello('Dez')).equal('Hello, Dez');
  });

  it('specifies greeting word thru contructor', function () {
    testObj = new TestClass('Hi');

    expect(testObj.sayHello('Dez')).equal('Hi, Dez');
  });
});